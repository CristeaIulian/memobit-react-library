import { FC, useEffect } from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

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
    showDismissButton = true,
    timeout = 3000,
    action,
}: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, timeout);

        return () => clearTimeout(timer);
    }, [onClose, timeout]);

    return (
        <div className={`toast toast--fixed toast-${type} toast--${position}`}>
            <span className="toast__message">{message}</span>
            {action && (
                <button className="toast__action" onClick={action.onClick}>
                    {action.label}
                </button>
            )}
            {showDismissButton && (
                <Tooltip title="Close">
                    <button className="toast__close" onClick={onClose}>
                        <Icon name="clear" size="sm" />
                    </button>
                </Tooltip>
            )}
        </div>
    );
};
