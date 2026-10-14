/**
 * Error reporting shared by every memobit app, in the browser and in Node. Errors and
 * warnings are batched and POSTed to the hub's errors/ingest endpoint, which groups them,
 * lists them on the hub's Errors page and emails on new errors and on spikes.
 *
 * React-free on purpose (it ships through the `@memobit/libs/errors` entry), so Node
 * servers can use it too. The hub can switch reporting off — globally, per app, or
 * automatically on a spike — and the reporter then stays quiet for as long as it is told.
 */

export type ErrorReportLevel = 'error' | 'warning';

export type ErrorReportContext = Record<string, unknown>;

export interface ErrorReportingConfig {
    /** The app id registered in the hub, e.g. `garage`. */
    appId: string;
    /** The hub ingest URL, e.g. `https://hub.memobit.ro/api/errors/ingest`. */
    endpoint: string;
    /** Turns reporting off for this run, e.g. `import.meta.env.PROD` to report only from production builds. Defaults to true. */
    enabled?: boolean;
    /** Shown in the hub next to each error. Defaults to `production`. */
    environment?: string;
    /** Build or commit the errors came from. */
    release?: string;
    /** Also report `console.error` and `console.warn` calls. Defaults to true. */
    captureConsole?: boolean;
    /** Messages to drop, on top of the built-in browser noise filters. */
    ignore?: (string | RegExp)[];
    /** Most events sent per page load or process run. Defaults to 200. */
    maxEventsPerSession?: number;
}

/** The part of Node's `process` the reporter needs; pass `process` itself. */
export interface NodeProcessLike {
    on(event: 'uncaughtException', listener: (error: Error) => void): unknown;
    listenerCount(event: 'uncaughtException'): number;
    exit(code?: number): void;
}

export interface CapturedEvent {
    level: ErrorReportLevel;
    message: string;
    stack?: string;
    context?: ErrorReportContext;
    /** The original thrown value, so the same error is never reported twice. */
    error?: unknown;
}

type ConsoleMethodName = 'debug' | 'info' | 'warn' | 'error';

type ConsoleMethod = (...args: unknown[]) => void;

interface QueuedEvent {
    level: ErrorReportLevel;
    message: string;
    stack?: string;
    url?: string;
    context?: ErrorReportContext;
    count: number;
}

interface ReporterState {
    appId: string;
    endpoint: string;
    source: 'client' | 'server';
    environment: string;
    release?: string;
    ignore: (string | RegExp)[];
    maxEvents: number;
    queue: Map<string, QueuedEvent>;
    sent: number;
    pausedUntil: number;
    capReached: boolean;
    timer: ReturnType<typeof setTimeout> | null;
}

interface IngestResponse {
    enabled?: boolean;
    retryAfter?: number;
}

const FLUSH_DELAY_MS = 5000;
const FLUSH_AT_SIZE = 10;
const MAX_BATCH = 25;
const MAX_MESSAGE = 1000;
const MAX_CONTEXT = 4000;
const NETWORK_FAILURE_PAUSE_SEC = 60;
const NODE_EXIT_FLUSH_MS = 3000;

const DEFAULT_IGNORE: (string | RegExp)[] = [/ResizeObserver loop/, /^Script error\.?$/];

let state: ReporterState | null = null;
let isCapturing = false;
const reportedErrors = new WeakSet<object>();
const nativeConsole: Partial<Record<ConsoleMethodName, ConsoleMethod>> = {};

const clip = (value: string, max: number): string => (value.length > max ? `${value.slice(0, max)}…` : value);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isIngestResponse = (value: unknown): value is IngestResponse => isRecord(value) && (value.enabled === undefined || typeof value.enabled === 'boolean');

export const describeValue = (value: unknown): string => {
    if (value instanceof Error) {
        return value.message ? `${value.name}: ${value.message}` : value.name;
    }

    if (typeof value === 'string') {
        return value;
    }

    try {
        return clip(JSON.stringify(value) ?? String(value), 500);
    } catch {
        return String(value);
    }
};

/** Console-style formatting: `%s`/`%d`/`%o` substitutions, `%c` styling dropped. */
const formatConsoleArgs = (args: unknown[]): string => {
    const [first, ...rest] = args;

    if (typeof first !== 'string' || !/%[sdifoOc]/.test(first)) {
        return args.map(describeValue).join(' ');
    }

    const formatted = first.replace(/%([sdifoOc%])/g, (match: string, specifier: string) => {
        if (specifier === '%') {
            return '%';
        }
        if (rest.length === 0) {
            return match;
        }
        const value = rest.shift();

        return specifier === 'c' ? '' : describeValue(value);
    });

    return [formatted, ...rest.map(describeValue)].join(' ');
};

const toJsonSafe = (context: ErrorReportContext | undefined): ErrorReportContext | undefined => {
    if (!context) {
        return undefined;
    }

    try {
        const json = JSON.stringify(context);

        if (json.length > MAX_CONTEXT) {
            return { truncated: clip(json, MAX_CONTEXT) };
        }
        const parsed: unknown = JSON.parse(json);

        return isRecord(parsed) ? parsed : undefined;
    } catch {
        return { unserializable: describeValue(context) };
    }
};

const currentUrl = (): string | undefined => (typeof location === 'undefined' ? undefined : location.origin + location.pathname);

const isIgnored = (reporter: ReporterState, message: string, stack: string | undefined): boolean => {
    // Errors thrown by browser extensions are not the app's.
    if (stack?.includes('-extension://')) {
        return true;
    }

    return reporter.ignore.some(rule => (typeof rule === 'string' ? message.includes(rule) : rule.test(message)));
};

const pause = (reporter: ReporterState, seconds: number): void => {
    reporter.pausedUntil = Date.now() + Math.max(30, seconds) * 1000;
    reporter.queue.clear();
};

const scheduleFlush = (reporter: ReporterState): void => {
    if (reporter.timer === null) {
        reporter.timer = setTimeout(() => {
            void flushErrorReports();
        }, FLUSH_DELAY_MS);
    }
};

/** Writes to the console without the write being reported again. */
export const writeNativeConsole = (method: ConsoleMethodName, args: unknown[]): void => {
    const write = nativeConsole[method] ?? console[method];

    write.apply(console, args);
};

/** Queues one event. A no-op until reporting is installed, or while the hub has it paused. */
export const captureEvent = (event: CapturedEvent): void => {
    const reporter = state;

    if (!reporter || isCapturing) {
        return;
    }

    if (typeof event.error === 'object' && event.error !== null) {
        if (reportedErrors.has(event.error)) {
            return;
        }
        reportedErrors.add(event.error);
    }

    if (Date.now() < reporter.pausedUntil || isIgnored(reporter, event.message, event.stack)) {
        return;
    }

    isCapturing = true;

    try {
        const message = clip(event.message, MAX_MESSAGE);
        const key = `${event.level}|${message}|${event.stack?.split('\n', 2).join('|') ?? ''}`;
        const queued = reporter.queue.get(key);

        if (queued) {
            queued.count += 1;

            return;
        }

        if (reporter.sent + reporter.queue.size >= reporter.maxEvents) {
            if (!reporter.capReached) {
                reporter.capReached = true;
                writeNativeConsole('warn', [`[memobit] Error reporting stopped for this session after ${reporter.maxEvents} events.`]);
            }

            return;
        }

        reporter.queue.set(key, {
            level: event.level,
            message,
            stack: event.stack,
            url: currentUrl(),
            context: toJsonSafe(event.context),
            count: 1,
        });

        if (reporter.queue.size >= FLUSH_AT_SIZE) {
            void flushErrorReports();
        } else {
            scheduleFlush(reporter);
        }
    } finally {
        isCapturing = false;
    }
};

/** Reports a caught error you handled but still want to know about. */
export const reportError = (error: unknown, context?: ErrorReportContext): void => {
    captureEvent({
        level: 'error',
        message: describeValue(error),
        stack: error instanceof Error ? error.stack : undefined,
        context,
        error,
    });
};

/** Sends whatever is queued now instead of waiting for the next batch. */
export const flushErrorReports = async (): Promise<void> => {
    const reporter = state;

    if (!reporter) {
        return;
    }

    if (reporter.timer !== null) {
        clearTimeout(reporter.timer);
        reporter.timer = null;
    }

    const batch = [...reporter.queue.entries()].slice(0, MAX_BATCH);

    if (batch.length === 0) {
        return;
    }

    batch.forEach(([key]) => reporter.queue.delete(key));
    reporter.sent += batch.length;

    const body = JSON.stringify({
        app: reporter.appId,
        source: reporter.source,
        environment: reporter.environment,
        release: reporter.release,
        events: batch.map(([, event]) => event),
    });

    try {
        // text/plain keeps this a "simple" cross-origin request: no CORS preflight.
        const response = await fetch(reporter.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
            body,
            credentials: 'omit',
            // Lets the last batch survive the page closing; browsers cap keepalive bodies at 64KB.
            keepalive: body.length < 60000,
        });
        const data: unknown = await response.json().catch(() => null);

        if (isIngestResponse(data) && data.enabled === false) {
            pause(reporter, data.retryAfter ?? NETWORK_FAILURE_PAUSE_SEC);
        }
    } catch {
        pause(reporter, NETWORK_FAILURE_PAUSE_SEC);
    }

    if (reporter.queue.size > 0) {
        scheduleFlush(reporter);
    }
};

const startReporter = (config: ErrorReportingConfig, source: ReporterState['source']): boolean => {
    if (state || config.enabled === false || !config.appId || !config.endpoint) {
        return false;
    }

    state = {
        appId: config.appId,
        endpoint: config.endpoint,
        source,
        environment: config.environment ?? 'production',
        release: config.release,
        ignore: [...DEFAULT_IGNORE, ...(config.ignore ?? [])],
        maxEvents: config.maxEventsPerSession ?? 200,
        queue: new Map(),
        sent: 0,
        pausedUntil: 0,
        capReached: false,
        timer: null,
    };

    return true;
};

const patchConsole = (): void => {
    const originalError = console.error;
    const originalWarn = console.warn;

    nativeConsole.error = originalError;
    nativeConsole.warn = originalWarn;

    const capture = (level: ErrorReportLevel, args: unknown[]): void => {
        const error = args.find(arg => arg instanceof Error);

        captureEvent({
            level,
            message: formatConsoleArgs(args),
            stack: error instanceof Error ? error.stack : undefined,
            error,
        });
    };

    console.error = (...args: unknown[]): void => {
        originalError.apply(console, args);
        capture('error', args);
    };
    console.warn = (...args: unknown[]): void => {
        originalWarn.apply(console, args);
        capture('warning', args);
    };
};

/** Browser apps: call once, before rendering. */
export const installErrorReporting = (config: ErrorReportingConfig): void => {
    if (typeof window === 'undefined' || !startReporter(config, 'client')) {
        return;
    }

    window.addEventListener('error', (event: ErrorEvent) => {
        const error: unknown = event.error;

        captureEvent({
            level: 'error',
            message: error instanceof Error ? describeValue(error) : event.message || 'Unknown error',
            stack: error instanceof Error ? error.stack : `at ${event.filename}:${event.lineno}:${event.colno}`,
            error,
        });
    });

    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        const reason: unknown = event.reason;

        captureEvent({
            level: 'error',
            message: `Unhandled rejection: ${describeValue(reason)}`,
            stack: reason instanceof Error ? reason.stack : undefined,
            error: reason,
        });
    });

    const flushNow = (): void => {
        void flushErrorReports();
    };

    window.addEventListener('pagehide', flushNow);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            flushNow();
        }
    });

    if (config.captureConsole !== false) {
        patchConsole();
    }
};

/**
 * Node servers: call once at startup, passing `process`. Unhandled rejections reach
 * Node's uncaught-exception path, so both are covered. Listening there would stop the
 * crash Node normally does, so — unless the server has its own handler — the process
 * still exits with code 1, once the report is sent (or after 3s).
 */
export const installNodeErrorReporting = (nodeProcess: NodeProcessLike, config: ErrorReportingConfig): void => {
    if (!startReporter(config, 'server')) {
        return;
    }

    nodeProcess.on('uncaughtException', (error: Error) => {
        captureEvent({ level: 'error', message: `Uncaught ${describeValue(error)}`, stack: error.stack, error });

        if (nodeProcess.listenerCount('uncaughtException') > 1) {
            return;
        }

        writeNativeConsole('error', [error]);

        const timeout = new Promise<void>(resolve => setTimeout(resolve, NODE_EXIT_FLUSH_MS));

        void Promise.race([flushErrorReports(), timeout]).finally(() => nodeProcess.exit(1));
    });

    if (config.captureConsole !== false) {
        patchConsole();
    }
};
