import React, { type ReactElement, useEffect, useState } from 'react';

import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox';
import { InputPassword } from '../../InputPassword';
import { InputText } from '../../InputText';
import { Toast } from '../../Toast';
import { useAuth } from '../../../hooks/useAuth';

import './Login.scss';

export interface LoginProps {
    redirectPath?: string;
}

export function Login({ redirectPath = '/' }: LoginProps): ReactElement {
    const { login, config, isAuthenticated } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSessionExpiredToast, setShowSessionExpiredToast] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = redirectPath;
        }
    }, [isAuthenticated, redirectPath]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('session_expired') === 'true') {
            setShowSessionExpiredToast(true);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        setIsLoading(true);
        try {
            await login({ username, password, rememberMe });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="LoginPage">
                <div className="LoginPage__card">
                    <h1 className="LoginPage__title">{config.appName || 'Login'}</h1>

                    <form onSubmit={handleSubmit} className="LoginPage__form">
                        <InputText
                            placeholder="Username"
                            value={username}
                            onChange={value => setUsername(value)}
                            required
                            autoFocus
                            disabled={isLoading}
                        />

                        <InputPassword
                            placeholder="Password"
                            value={password}
                            onChange={value => setPassword(value)}
                            required
                            disabled={isLoading}
                        />

                        <Checkbox checked={rememberMe} onChange={checked => setRememberMe(checked)} label="Keep me logged in" disabled={isLoading} />

                        {error && <div className="LoginPage__error">{error}</div>}

                        <Button type="submit" variant="info" loading={isLoading} fullWidth>
                            Sign In
                        </Button>
                    </form>
                </div>
            </div>
            {showSessionExpiredToast && (
                <Toast message="Your session has expired. Please log in again." type="warning" onClose={() => setShowSessionExpiredToast(false)} />
            )}
        </>
    );
}
