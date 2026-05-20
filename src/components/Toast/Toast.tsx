import { FC, useEffect } from 'react';

import './Toast.scss';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';

export interface ToastDetails {
    message: string;
    type?: 'success' | 'danger' | 'warning' | 'info';
    action?: ToastAction;
    position?: ToastPosition;
    showDismissButton?: boolean;
    timeout?: number;
}

interface ToastProps extends ToastDetails {
    onClose: () => void;
}

export const Toast: FC<ToastProps> = ({
    message,
    type = 'success',
    onClose,
    position = 'top-right',
    showDismissButton,
    timeout = 3000,
    action,
}: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, timeout);

        return () => clearTimeout(timer);
    }, [onClose, timeout]);

    const canDismiss = showDismissButton ?? Boolean(action);

    return (
        <div className={`toast toast--fixed toast-${type} toast--${position}`}>
            <span className="toast__message">{message}</span>
            {action && (
                <button className="toast__action" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
            {canDismiss && (
                <button className="toast__close" onClick={onClose} aria-label="Close">
                    x
                </button>
            )}
        </div>
    );
};
