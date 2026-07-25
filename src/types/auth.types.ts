export interface User {
    id: string;
    username: string;
    createdAt: Date;
}

export interface LoginCredentials {
    username: string;
    password: string;
    rememberMe: boolean;
}

export type MfaMethod = 'totp' | 'email';

export interface LoginResponse {
    // Absent when a second factor is still required (mfaRequired = true).
    user?: {
        id: string;
        username: string;
        createdAt: string;
    };
    // The auth token is now delivered as an httpOnly cookie, not in the response body.
    expiresAt?: string;
    // Set when the password was accepted but a second factor is needed to finish.
    mfaRequired?: boolean;
    method?: MfaMethod;
}

// What login() reports back to the UI: either the session is established, or a
// second factor is now required (the caller should collect a code and call verifyMfa).
export interface LoginOutcome {
    mfaRequired: boolean;
    method?: MfaMethod;
}

export interface VerifyResponse {
    user: {
        id: string;
        username: string;
        createdAt: string;
    };
}

export interface AuthConfig {
    apiBaseUrl: string;
    appName?: string;
}

export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    config: AuthConfig;
    // Resolves with { mfaRequired: true, method } when a second factor is needed —
    // the session is NOT established until verifyMfa succeeds.
    login: (credentials: LoginCredentials) => Promise<LoginOutcome>;
    verifyMfa: (code: string, trustDevice: boolean) => Promise<void>;
    logout: () => Promise<void>;
}
