import { type ReactElement, useEffect, useState } from 'react';

import { InputPassword } from '../../InputPassword';
import { Modal } from '../../Modal';
import { Toast, type ToastDetails } from '../../Toast';
import { useAuth } from '../../../hooks/useAuth';

import './ChangePasswordModal.scss';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps): ReactElement {
    const { config } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<ToastDetails | null>(null);

    const storageKey = config.storageKey || 'auth_token';

    useEffect(() => {
        if (isOpen) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError('');
        }
    }, [isOpen]);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const token = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);

            const response = await fetch(`${config.apiBaseUrl}/auth/changePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to change password');
            }

            setToast({ message: 'Password changed successfully!', type: 'success' });
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseToast = () => {
        setToast(null);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Change Password"
            size="medium"
            primary={{
                text: isLoading ? 'Changing...' : 'Change Password',
                onClick: handleChangePassword,
                icon: 'lock',
                variant: 'success',
                disabled: isLoading,
            }}
            secondary={{
                text: 'Cancel',
                onClick: onClose,
                icon: 'clear',
                variant: 'default',
                disabled: isLoading,
            }}
        >
            <div className="ChangePasswordModal">
                <div className="ChangePasswordModal__field">
                    <label htmlFor="current-password" className="ChangePasswordModal__label">
                        Current Password
                    </label>
                    <InputPassword
                        id="current-password"
                        value={currentPassword}
                        onChange={value => setCurrentPassword(value)}
                        placeholder="Enter current password"
                        disabled={isLoading}
                        autoFocus
                    />
                </div>

                <div className="ChangePasswordModal__field">
                    <label htmlFor="new-password" className="ChangePasswordModal__label">
                        New Password
                    </label>
                    <InputPassword
                        id="new-password"
                        value={newPassword}
                        onChange={value => setNewPassword(value)}
                        placeholder="Enter new password"
                        disabled={isLoading}
                    />
                </div>

                <div className="ChangePasswordModal__field">
                    <label htmlFor="confirm-password" className="ChangePasswordModal__label">
                        Confirm New Password
                    </label>
                    <InputPassword
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={value => setConfirmPassword(value)}
                        placeholder="Confirm new password"
                        disabled={isLoading}
                    />
                </div>

                {error && <div className="ChangePasswordModal__error">{error}</div>}
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={handleCloseToast} />}
        </Modal>
    );
}
