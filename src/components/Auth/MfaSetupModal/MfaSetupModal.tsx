import { type ReactElement, useCallback, useEffect, useState } from 'react';

import { QRCodeSVG } from 'qrcode.react';

import { useAuth } from '../../../hooks/useAuth';
import type { MfaMethod } from '../../../types/auth.types';
import { Button } from '../../Button';
import { InputPassword } from '../../InputPassword';
import { InputText } from '../../InputText';
import { Modal } from '../../Modal';
import { Toast, type ToastDetails } from '../../Toast';

import './MfaSetupModal.scss';

interface MfaSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type View = 'loading' | 'overview' | 'totp-setup' | 'email-setup' | 'recovery' | 'disable' | 'regen';

export function MfaSetupModal({ isOpen, onClose }: MfaSetupModalProps): ReactElement {
    const { config } = useAuth();
    const [view, setView] = useState<View>('loading');
    const [enabled, setEnabled] = useState(false);
    const [method, setMethod] = useState<MfaMethod | null>(null);
    const [secret, setSecret] = useState('');
    const [otpauthUri, setOtpauthUri] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState<ToastDetails | null>(null);

    // Authenticated POST with the double-submit CSRF token (cookie → header),
    // mirroring ChangePasswordModal. GET status has no CSRF requirement.
    const post = useCallback(
        async (path: string, body?: Record<string, unknown>): Promise<Record<string, unknown>> => {
            const csrfMatch = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]+)/);
            const csrfToken = csrfMatch ? decodeURIComponent(csrfMatch[1]) : null;
            const headers: Record<string, string> = { 'Content-Type': 'application/json' };
            if (csrfToken) headers['X-CSRF-Token'] = csrfToken;

            const response = await fetch(`${config.apiBaseUrl}${path}`, {
                method: 'POST',
                credentials: 'include',
                headers,
                body: body ? JSON.stringify(body) : undefined,
            });
            const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
            if (!response.ok) {
                throw new Error((data.error as string) || 'Request failed');
            }
            return data;
        },
        [config.apiBaseUrl]
    );

    const loadStatus = useCallback(async () => {
        setView('loading');
        setError('');
        try {
            const response = await fetch(`${config.apiBaseUrl}/auth/mfaStatus`, { credentials: 'include' });
            const data = await response.json();
            setEnabled(Boolean(data.enabled));
            setMethod((data.method as MfaMethod) ?? null);
            setView('overview');
        } catch {
            setError('Could not load MFA status.');
            setView('overview');
        }
    }, [config.apiBaseUrl]);

    useEffect(() => {
        if (isOpen) {
            setCode('');
            setPassword('');
            setError('');
            setRecoveryCodes([]);
            loadStatus();
        }
    }, [isOpen, loadStatus]);

    const run = async (fn: () => Promise<void>) => {
        setBusy(true);
        setError('');
        try {
            await fn();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
        } finally {
            setBusy(false);
        }
    };

    const startTotp = () =>
        run(async () => {
            const data = await post('/auth/mfaSetupTotp');
            setSecret((data.secret as string) || '');
            setOtpauthUri((data.otpauthUri as string) || '');
            setCode('');
            setView('totp-setup');
        });

    const confirmTotp = () =>
        run(async () => {
            const data = await post('/auth/mfaConfirmTotp', { code: code.trim() });
            setRecoveryCodes((data.recoveryCodes as string[]) || []);
            setView('recovery');
        });

    const startEmail = () =>
        run(async () => {
            await post('/auth/mfaEnableEmail');
            setCode('');
            setView('email-setup');
        });

    const confirmEmail = () =>
        run(async () => {
            const data = await post('/auth/mfaConfirmEmail', { code: code.trim() });
            setRecoveryCodes((data.recoveryCodes as string[]) || []);
            setView('recovery');
        });

    const doDisable = () =>
        run(async () => {
            await post('/auth/mfaDisable', { password });
            setToast({ message: 'Two-factor authentication disabled.', type: 'success' });
            setPassword('');
            await loadStatus();
        });

    const doRegen = () =>
        run(async () => {
            const data = await post('/auth/mfaRegenRecovery', { password });
            setRecoveryCodes((data.recoveryCodes as string[]) || []);
            setPassword('');
            setView('recovery');
        });

    const doForget = () =>
        run(async () => {
            await post('/auth/mfaForgetDevices');
            setToast({ message: 'All trusted devices have been signed out.', type: 'success' });
        });

    const copyRecovery = () => {
        void navigator.clipboard?.writeText(recoveryCodes.join('\n'));
        setToast({ message: 'Recovery codes copied.', type: 'success' });
    };

    const formattedSecret = secret.replace(/(.{4})/g, '$1 ').trim();

    const renderBody = () => {
        switch (view) {
            case 'loading':
                return <p className="MfaSetupModal__hint">Loading…</p>;

            case 'overview':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__status">
                            Status: <strong>{enabled ? `Enabled (${method === 'email' ? 'email codes' : 'authenticator app'})` : 'Disabled'}</strong>
                        </p>
                        {!enabled ? (
                            <>
                                <p className="MfaSetupModal__hint">Add a second step at sign-in. Choose a method:</p>
                                <Button variant="info" fullWidth disabled={busy} onClick={startTotp}>
                                    Set up authenticator app
                                </Button>
                                <Button variant="default" fullWidth disabled={busy} onClick={startEmail}>
                                    Set up email codes
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="default" fullWidth disabled={busy} onClick={() => setView('regen')}>
                                    Regenerate recovery codes
                                </Button>
                                <Button variant="default" fullWidth disabled={busy} onClick={() => run(doForget)}>
                                    Sign out trusted devices
                                </Button>
                                <Button variant="danger" icon="lock" fullWidth disabled={busy} onClick={() => setView('disable')}>
                                    Disable two-factor
                                </Button>
                            </>
                        )}
                    </div>
                );

            case 'totp-setup':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__hint">Scan this with your authenticator app (Google Authenticator, Aegis, 1Password…).</p>
                        {otpauthUri && (
                            <div className="MfaSetupModal__qr">
                                <QRCodeSVG value={otpauthUri} size={192} marginSize={2} />
                            </div>
                        )}
                        <p className="MfaSetupModal__hint MfaSetupModal__hint--muted">Can’t scan? Choose “Enter a setup key” and type this key (time-based):</p>
                        <div className="MfaSetupModal__secret">{formattedSecret}</div>
                        <InputText placeholder="6-digit code from the app" value={code} onChange={setCode} autoFocus disabled={busy} />
                        <Button variant="info" icon="key" fullWidth loading={busy} onClick={confirmTotp}>
                            Verify &amp; enable
                        </Button>
                    </div>
                );

            case 'email-setup':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__hint">We emailed you a 6-digit code. Enter it below to enable email verification.</p>
                        <InputText placeholder="6-digit code" value={code} onChange={setCode} autoFocus disabled={busy} />
                        <Button variant="info" icon="key" fullWidth loading={busy} onClick={confirmEmail}>
                            Verify &amp; enable
                        </Button>
                        <Button variant="default" fullWidth disabled={busy} onClick={startEmail}>
                            Resend code
                        </Button>
                    </div>
                );

            case 'recovery':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__hint">
                            Save these one-time recovery codes somewhere safe. Each works once if you lose access to your{' '}
                            {method === 'email' ? 'email' : 'authenticator'}. They are shown only now.
                        </p>
                        <ul className="MfaSetupModal__codes">
                            {recoveryCodes.map(c => (
                                <li key={c}>{c}</li>
                            ))}
                        </ul>
                        <Button variant="default" fullWidth disabled={busy} onClick={copyRecovery}>
                            Copy codes
                        </Button>
                        <Button variant="success" fullWidth disabled={busy} onClick={loadStatus}>
                            I&apos;ve saved them
                        </Button>
                    </div>
                );

            case 'disable':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__hint">Confirm your password to disable two-factor authentication.</p>
                        <InputPassword placeholder="Current password" value={password} onChange={setPassword} autoFocus disabled={busy} />
                        <Button variant="danger" icon="lock" fullWidth loading={busy} onClick={doDisable}>
                            Disable two-factor
                        </Button>
                        <Button variant="default" icon="clear" fullWidth disabled={busy} onClick={() => setView('overview')}>
                            Cancel
                        </Button>
                    </div>
                );

            case 'regen':
                return (
                    <div className="MfaSetupModal__section">
                        <p className="MfaSetupModal__hint">Confirm your password to generate a new set of recovery codes. The old codes stop working.</p>
                        <InputPassword placeholder="Current password" value={password} onChange={setPassword} autoFocus disabled={busy} />
                        <Button variant="info" icon="key" fullWidth loading={busy} onClick={doRegen}>
                            Generate new codes
                        </Button>
                        <Button variant="default" icon="clear" fullWidth disabled={busy} onClick={() => setView('overview')}>
                            Cancel
                        </Button>
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Two-factor authentication" titleIcon="key" size="medium">
            <div className="MfaSetupModal">
                {renderBody()}
                {error && <div className="MfaSetupModal__error">{error}</div>}
            </div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </Modal>
    );
}
