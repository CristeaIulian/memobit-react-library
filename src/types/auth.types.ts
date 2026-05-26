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

export interface LoginResponse {
    user: {
        id: string;
        username: string;
        createdAt: string;
    };
    // The auth token is now delivered as an httpOnly cookie, not in the response body.
    expiresAt?: string;
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
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}
