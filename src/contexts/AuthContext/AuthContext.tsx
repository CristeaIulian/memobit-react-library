import React, { useCallback, useEffect, useState } from 'react';

import { logger } from '@memobit/core';

import { buildRequestHeaders, HttpMethod } from '../../helpers/Http';
import type { AuthConfig, LoginCredentials, LoginOutcome, LoginResponse, User, VerifyResponse } from '../../types/auth.types';

import { AuthContext } from './AuthContext.context';

interface AuthProviderProps {
    children: React.ReactNode;
    config: AuthConfig;
}

// Auth uses an httpOnly cookie set by the backend on login. The token never enters JS,
// so this provider never reads or writes localStorage/sessionStorage. All authenticated
// requests must send `credentials: 'include'` so the browser attaches the cookie.
export function AuthProvider({ children, config }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restoreAuth = async () => {
            try {
                const response = await fetch(`${config.apiBaseUrl}/auth/verify`, {
                    method: HttpMethod.Get,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (response.ok) {
                    const data: VerifyResponse = await response.json();
                    setUser({
                        id: data.user.id,
                        username: data.user.username,
                        createdAt: new Date(data.user.createdAt),
                    });
                }
            } catch (error) {
                // Only a network failure lands here; a missing session is a non-ok response.
                logger.warn('Auth check could not reach the server', { error: String(error) });
            } finally {
                setIsLoading(false);
            }
        };

        restoreAuth();
    }, [config.apiBaseUrl]);

    const applyUser = useCallback((data: LoginResponse | VerifyResponse) => {
        if (!data.user) {
            return;
        }
        setUser({
            id: data.user.id,
            username: data.user.username,
            createdAt: new Date(data.user.createdAt),
        });
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<LoginOutcome> => {
            setIsLoading(true);
            try {
                const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
                    method: HttpMethod.Post,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
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

                // Password accepted but a second factor is still needed — do NOT set the
                // user; the UI collects a code and calls verifyMfa to finish.
                if (data.mfaRequired) {
                    return { mfaRequired: true, method: data.method };
                }

                applyUser(data);
                return { mfaRequired: false };
            } finally {
                setIsLoading(false);
            }
        },
        [config.apiBaseUrl, applyUser]
    );

    const verifyMfa = useCallback(
        async (code: string, trustDevice: boolean): Promise<void> => {
            setIsLoading(true);
            try {
                // Public route: protected by the httpOnly mfa_pending cookie (SameSite=Strict)
                // + the server-side Origin check, so no CSRF token is required here.
                const response = await fetch(`${config.apiBaseUrl}/auth/verifyMfa`, {
                    method: HttpMethod.Post,
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, trustDevice }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error || 'Verification failed');
                }

                applyUser(await response.json());
            } finally {
                setIsLoading(false);
            }
        },
        [config.apiBaseUrl, applyUser]
    );

    const logout = useCallback(async () => {
        try {
            await fetch(`${config.apiBaseUrl}/auth/logout`, {
                method: HttpMethod.Post,
                credentials: 'include',
                headers: buildRequestHeaders(HttpMethod.Post),
            });
        } catch (error) {
            logger.warn('Logout request failed', { error: String(error) });
        } finally {
            setUser(null);
        }
    }, [config.apiBaseUrl]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                config,
                login,
                verifyMfa,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
