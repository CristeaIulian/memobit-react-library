import { type ErrorReportContext, logger } from '@memobit/core';

export const HttpStatus = {
    Continue: 100,
    SwitchingProtocols: 101,

    Ok: 200,
    Created: 201,
    Accepted: 202,
    NoContent: 204,
    PartialContent: 206,

    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,

    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    PayloadTooLarge: 413,
    UnsupportedMediaType: 415,
    UnprocessableEntity: 422,
    Locked: 423,
    TooManyRequests: 429,

    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
} as const;

export type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus];

export const HttpMethod = {
    Get: 'GET',
    Post: 'POST',
    Put: 'PUT',
    Patch: 'PATCH',
    Delete: 'DELETE',
} as const;

export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

export const isSuccessStatus = (status: number): boolean => status >= 200 && status < 300;

export const isClientErrorStatus = (status: number): boolean => status >= 400 && status < 500;

export const isServerErrorStatus = (status: number): boolean => status >= 500 && status < 600;

const CSRF_COOKIE = 'csrf_token';
export const CSRF_HEADER = 'X-CSRF-Token';

// The backend issues csrf_token as a non-httpOnly cookie precisely so JS can echo it back
// in a header (double-submit). The auth cookie itself is httpOnly and never readable here.
export const getCsrfToken = (): string | null => {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]+)`));
    return match ? decodeURIComponent(match[1]) : null;
};

export const buildRequestHeaders = (method: HttpMethod, json: boolean = true): Record<string, string> => {
    const headers: Record<string, string> = json ? { 'Content-Type': 'application/json' } : {};

    if (method !== HttpMethod.Get) {
        const csrf = getCsrfToken();
        if (csrf) {
            headers[CSRF_HEADER] = csrf;
        }
    }

    return headers;
};

/** A failed API request. `status` is the HTTP status, or 0 when the server could not be reached. */
export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export const readErrorMessage = async (response: Response): Promise<string> => {
    try {
        const body: unknown = await response.json();
        if (body && typeof body === 'object') {
            if ('error' in body && typeof body.error === 'string') {
                return body.error;
            }
            if ('message' in body && typeof body.message === 'string') {
                return body.message;
            }
        }
    } catch {
        // response body wasn't JSON
    }
    return `Request failed (${response.status}${response.statusText ? ` ${response.statusText}` : ''})`;
};

const isAbortError = (error: unknown): boolean => error instanceof DOMException && error.name === 'AbortError';

// What a bare fetch() throws when the server can't be reached: Chrome, Firefox and Safari.
const NETWORK_FAILURE_MESSAGE = /^(Failed to fetch|NetworkError when attempting to fetch resource\.?|Load failed)$/;

const isNetworkFailure = (error: unknown): boolean => error instanceof TypeError && NETWORK_FAILURE_MESSAGE.test(error.message);

/**
 * For the catch around an API call: reports `error` unless it is an `ApiError` (the client and
 * the backend already report those that matter) or an aborted request. A bare fetch() that could
 * not reach the server is a warning. What is left is a bug in the code around the call, e.g.
 * mapping the response.
 */
export const logUnexpectedError = (message: string, error: unknown, context?: ErrorReportContext): void => {
    if (error instanceof ApiError || isAbortError(error)) {
        return;
    }
    if (isNetworkFailure(error)) {
        logger.warn(message, { ...context, error: String(error) });
        return;
    }
    logger.error(message, error, context);
};

const GATEWAY_FAILURE_STATUSES = new Set<number>([HttpStatus.BadGateway, HttpStatus.ServiceUnavailable, HttpStatus.GatewayTimeout]);

export interface ApiClientConfig {
    baseUrl: string;
    // Where an expired session is sent. Defaults to /login.
    loginPath?: string;
}

export interface ApiClient {
    get: <T>(path: string) => Promise<T>;
    post: <T, P = unknown>(path: string, payload?: P) => Promise<T>;
    put: <T, P = unknown>(path: string, payload?: P) => Promise<T>;
    patch: <T, P = unknown>(path: string, payload?: P) => Promise<T>;
    delete: <T>(path: string) => Promise<T>;
    // Multipart upload — no Content-Type header so the browser sets the boundary.
    upload: <T>(path: string, formData: FormData) => Promise<T>;
}

/**
 * Cookie-session API client shared by the memobit apps: sends credentials, adds the CSRF
 * header on mutating requests, surfaces the server's `error` message, and on 401 navigates
 * to the login page. The 401 path returns a promise that never settles so callers don't
 * flash an error toast while the browser is already leaving the page.
 *
 * It reports unreachable-server, gateway and invalid-JSON failures to the hub, so callers
 * only show a toast for API errors and don't log them again.
 */
export const createApiClient = ({ baseUrl, loginPath = '/login' }: ApiClientConfig): ApiClient => {
    // A burst of in-flight requests failing together must trigger a single redirect.
    let isRedirectingToLogin = false;

    const buildUrl = (path: string): string => `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    const send = async <T>(path: string, method: HttpMethod, body?: BodyInit, json: boolean = true): Promise<T> => {
        // Never the query string: it can carry search terms or tokens.
        const requestContext = { method, path: path.split('?')[0] };

        let response: Response;
        try {
            response = await fetch(buildUrl(path), {
                method,
                headers: buildRequestHeaders(method, json),
                credentials: 'include',
                body,
            });
        } catch (error) {
            if (isAbortError(error)) {
                throw error;
            }
            logger.warn('API request could not reach the server', requestContext);
            throw new ApiError('Could not reach the server', 0);
        }

        if (response.status === HttpStatus.Unauthorized && !window.location.pathname.startsWith(loginPath)) {
            if (!isRedirectingToLogin) {
                isRedirectingToLogin = true;
                window.location.href = `${loginPath}?session_expired=true`;
            }
            return new Promise<T>(() => {});
        }

        if (!response.ok) {
            // The backend reports its own 500s; a 502-504 comes from the host or proxy in
            // front of it, which nothing else sees. 4xx responses are expected outcomes.
            if (GATEWAY_FAILURE_STATUSES.has(response.status)) {
                logger.warn('API gateway failure', { ...requestContext, status: response.status });
            }
            throw new ApiError(await readErrorMessage(response), response.status);
        }

        if (response.status === HttpStatus.NoContent) {
            return undefined as T;
        }

        try {
            return (await response.json()) as T;
        } catch (error) {
            logger.error('API response was not valid JSON', error, { ...requestContext, status: response.status });
            throw error;
        }
    };

    const sendJson = <T>(path: string, method: HttpMethod, payload: unknown): Promise<T> =>
        send<T>(path, method, payload === undefined ? undefined : JSON.stringify(payload));

    return {
        get: <T>(path: string) => send<T>(path, HttpMethod.Get),
        post: <T, P = unknown>(path: string, payload?: P) => sendJson<T>(path, HttpMethod.Post, payload),
        put: <T, P = unknown>(path: string, payload?: P) => sendJson<T>(path, HttpMethod.Put, payload),
        patch: <T, P = unknown>(path: string, payload?: P) => sendJson<T>(path, HttpMethod.Patch, payload),
        delete: <T>(path: string) => send<T>(path, HttpMethod.Delete),
        upload: <T>(path: string, formData: FormData) => send<T>(path, HttpMethod.Post, formData, false),
    };
};
