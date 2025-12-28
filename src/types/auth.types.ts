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
    token: string;
    expiresAt: string;
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
    storageKey?: string;
}

export interface AuthContextValue {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    config: AuthConfig;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
}
