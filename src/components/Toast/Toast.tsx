import { FC, useEffect } from 'react';

import './Toast.scss';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastDetails {
    message: string;
    type?: 'success' | 'danger' | 'warning' | 'info';
    action?: ToastAction;
}

interface ToastProps extends ToastDetails {
    onClose: () => void;
    timeout?: number;
}

export const Toast: FC<ToastProps> = ({ message, type = 'success', onClose, timeout = 3000, action }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, timeout);

        return () => clearTimeout(timer);
    }, [onClose, timeout]);

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast__message">{message}</span>
            {action && (
                <button className="toast__action" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
            {action && (
                <button className="toast__close" onClick={onClose} aria-label="Close">
                    ×
                </button>
            )}
        </div>
    );
};
