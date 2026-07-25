import React, { type ReactElement, useEffect, useState } from 'react';

import { useAuth } from '../../../hooks/useAuth';
import type { MfaMethod } from '../../../types/auth.types';
import { Button } from '../../Button';
import { Checkbox } from '../../Checkbox';
import { InputPassword } from '../../InputPassword';
import { InputText } from '../../InputText';
import { Toast } from '../../Toast';

import './Login.scss';

export interface LoginProps {
    redirectPath?: string;
}

export function Login({ redirectPath = '/' }: LoginProps): ReactElement {
    const { login, verifyMfa, config, isAuthenticated } = useAuth();
    const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [mfaMethod, setMfaMethod] = useState<MfaMethod>('totp');
    const [mfaCode, setMfaCode] = useState('');
    const [trustDevice, setTrustDevice] = useState(false);
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
            const outcome = await login({ username, password, rememberMe });
            if (outcome.mfaRequired) {
                setMfaMethod(outcome.method ?? 'totp');
                setMfaCode('');
                setStep('mfa');
            }
            // Otherwise the isAuthenticated effect redirects.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!mfaCode.trim()) {
            setError('Enter the verification code');
            return;
        }

        setIsLoading(true);
        try {
            await verifyMfa(mfaCode.trim(), trustDevice);
            // Success → isAuthenticated effect redirects.
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const backToCredentials = () => {
        setStep('credentials');
        setMfaCode('');
        setError('');
    };

    const mfaHint =
        mfaMethod === 'email'
            ? 'Enter the code we emailed you. You can also use a recovery code.'
            : 'Enter the code from your authenticator app. You can also use a recovery code.';

    return (
        <>
            <div className="LoginPage">
                <div className="LoginPage__card">
                    <h1 className="LoginPage__title">{config.appName || 'Login'}</h1>

                    {step === 'credentials' ? (
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

                            <Button type="submit" variant="info" icon="key" loading={isLoading} fullWidth>
                                Sign In
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerifyMfa} className="LoginPage__form">
                            <p className="LoginPage__hint">{mfaHint}</p>

                            <InputText
                                placeholder="Verification code"
                                value={mfaCode}
                                onChange={value => setMfaCode(value)}
                                required
                                autoFocus
                                disabled={isLoading}
                            />

                            <Checkbox
                                checked={trustDevice}
                                onChange={checked => setTrustDevice(checked)}
                                label="Trust this device for 90 days"
                                disabled={isLoading}
                            />

                            {error && <div className="LoginPage__error">{error}</div>}

                            <Button type="submit" variant="info" icon="key" loading={isLoading} fullWidth>
                                Verify
                            </Button>

                            <Button type="button" variant="default" icon="clear" disabled={isLoading} fullWidth onClick={backToCredentials}>
                                Back
                            </Button>
                        </form>
                    )}
                </div>
            </div>
            {showSessionExpiredToast && (
                <Toast message="Your session has expired. Please log in again." type="warning" onClose={() => setShowSessionExpiredToast(false)} />
            )}
        </>
    );
}
