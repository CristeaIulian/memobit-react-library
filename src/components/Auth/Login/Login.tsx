import React, { type ReactElement, useEffect, useState } from 'react';

import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox';
import { InputPassword } from '../../InputPassword';
import { InputText } from '../../InputText';
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

    useEffect(() => {
        if (isAuthenticated) {
            window.location.href = redirectPath;
        }
    }, [isAuthenticated, redirectPath]);

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
    );
}
