import { FC, useEffect } from 'react';

import './Toast.scss';

export interface ToastDetails {
    message: string;
    type?: 'success' | 'error' | 'warning';
}

interface ToastProps extends ToastDetails {
    onClose: () => void;
    timeout?: number;
}

export const Toast: FC<ToastProps> = ({ message, type = 'success', onClose, timeout = 3000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, timeout);

        return () => clearTimeout(timer);
    }, [onClose, timeout]);

    return <div className={`toast toast-${type}`}>{message}</div>;
};
