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
 */
export const createApiClient = ({ baseUrl, loginPath = '/login' }: ApiClientConfig): ApiClient => {
    // A burst of in-flight requests failing together must trigger a single redirect.
    let isRedirectingToLogin = false;

    const buildUrl = (path: string): string => `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    const send = async <T>(path: string, method: HttpMethod, body?: BodyInit, json: boolean = true): Promise<T> => {
        const response = await fetch(buildUrl(path), {
            method,
            headers: buildRequestHeaders(method, json),
            credentials: 'include',
            body,
        });

        if (response.status === HttpStatus.Unauthorized && !window.location.pathname.startsWith(loginPath)) {
            if (!isRedirectingToLogin) {
                isRedirectingToLogin = true;
                window.location.href = `${loginPath}?session_expired=true`;
            }
            return new Promise<T>(() => {});
        }

        if (!response.ok) {
            throw new ApiError(await readErrorMessage(response), response.status);
        }

        if (response.status === HttpStatus.NoContent) {
            return undefined as T;
        }

        return (await response.json()) as T;
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
