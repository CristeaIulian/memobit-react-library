import React, { createContext, useCallback, useEffect, useState } from 'react';

import type { AuthConfig, AuthContextValue, LoginCredentials, LoginResponse, User, VerifyResponse } from '../../types/auth.types';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
    children: React.ReactNode;
    config: AuthConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const storageKey = config.storageKey || 'auth_token';

    useEffect(() => {
        const restoreAuth = async () => {
            const token = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

            if (token) {
                try {
                    const response = await fetch(`${config.apiBaseUrl}/auth/verify`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data: VerifyResponse = await response.json();
                        setUser({
                            id: data.user.id,
                            username: data.user.username,
                            createdAt: new Date(data.user.createdAt),
                        });
                    } else {
                        localStorage.removeItem(storageKey);
                        sessionStorage.removeItem(storageKey);
                    }
                } catch (error) {
                    console.error('Failed to restore auth state:', error);
                    localStorage.removeItem(storageKey);
                    sessionStorage.removeItem(storageKey);
                }
            }

            setIsLoading(false);
        };

        restoreAuth();
    }, [config.apiBaseUrl, storageKey]);

    const login = useCallback(
        async (credentials: LoginCredentials) => {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: credentials.username,
                        password: credentials.password,
                        rememberMe: credentials.rememberMe,
                    }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Login failed');
                }

                const data: LoginResponse = await response.json();

                const userData: User = {
                    id: data.user.id,
                    username: data.user.username,
                    createdAt: new Date(data.user.createdAt),
                };

                setUser(userData);

                const storage = credentials.rememberMe ? localStorage : sessionStorage;
                storage.setItem(storageKey, data.token);
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [config.apiBaseUrl, storageKey]
    );

    const logout = useCallback(async () => {
        try {
            const token = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

            if (token) {
                await fetch(`${config.apiBaseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            localStorage.removeItem(storageKey);
            sessionStorage.removeItem(storageKey);
        }
    }, [config.apiBaseUrl, storageKey]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                config,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
