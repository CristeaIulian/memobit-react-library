import { captureEvent, describeValue, type ErrorReportContext, writeNativeConsole } from './ErrorReporting';

const withContext = (message: string, context: ErrorReportContext | undefined, extra?: unknown): unknown[] => {
    const args: unknown[] = [message];

    if (extra !== undefined) {
        args.push(extra);
    }
    if (context !== undefined) {
        args.push(context);
    }

    return args;
};

/**
 * Use in place of `console.*` in app code. `debug` and `info` only write to the console;
 * `warn` and `error` also report to the hub once error reporting is installed — and only
 * once, even though the console capture is on.
 */
export const logger = {
    debug: (message: string, context?: ErrorReportContext): void => {
        writeNativeConsole('debug', withContext(message, context));
    },

    info: (message: string, context?: ErrorReportContext): void => {
        writeNativeConsole('info', withContext(message, context));
    },

    warn: (message: string, context?: ErrorReportContext): void => {
        writeNativeConsole('warn', withContext(message, context));
        captureEvent({ level: 'warning', message, context });
    },

    /** `error` is the caught value, if there is one; its stack is kept. */
    error: (message: string, error?: unknown, context?: ErrorReportContext): void => {
        writeNativeConsole('error', withContext(message, context, error));
        captureEvent({
            level: 'error',
            message: error === undefined ? message : `${message}: ${describeValue(error)}`,
            stack: error instanceof Error ? error.stack : undefined,
            context,
            error,
        });
    },
};
