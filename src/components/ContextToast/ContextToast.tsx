import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import './ContextToast.scss';

export type ToastType = 'info' | 'success' | 'warning' | 'danger';

export interface ContextToastAction {
    label: string;
    onClick: () => void;
}

export type ToastContainerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top' | 'bottom' | 'left' | 'right';

interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    action?: ContextToastAction;
    onClose: (id: string) => void;
    showDismissButton?: boolean;
    timeout: number;
}

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    timeout: number;
    action?: ContextToastAction;
}

interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (message: string, type?: ToastType, timeout?: number, action?: ContextToastAction) => string;
    removeToast: (id: string) => void;
}

interface ToastContainerProps {
    position?: ToastContainerPosition;
    showDismissButton?: boolean;
}

interface ToastProviderProps {
    children: React.ReactNode;
}

// Create a context for the toast functionality
const ToastContext = createContext<ToastContextValue | null>(null);

// Custom hook to use the toast service
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
};

// ContextToast Component for individual notifications
const ContextToast = ({ id, message, type = 'info', action, onClose, showDismissButton = true, timeout = 2000 }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, timeout);

        return () => clearTimeout(timer);
    }, [id, onClose, timeout]);

    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onClose(id), 300); // Match animation duration
    };

    const handleAction = () => {
        action?.onClick();
        handleClose();
    };

    return (
        <div className={`toast toast--${type} ${isExiting ? 'toast--exiting' : ''}`}>
            <div className="toast__message">{message}</div>
            {action && (
                <button onClick={handleAction} className="toast__action-button">
                    {action.label}
                </button>
            )}
            {showDismissButton && (
                <Tooltip title="Close">
                    <button onClick={handleClose} className="toast__close-button">
                        <Icon name="clear" size="sm" />
                    </button>
                </Tooltip>
            )}
        </div>
    );
};

// ContextToast Container (Manages position and multiple toasts)
export const ToastContainer = ({ position = 'bottom-right', showDismissButton = true }: ToastContainerProps) => {
    const { toasts, removeToast } = useToast();

    return (
        <div className={`toast-container toast-container--${position}`}>
            {toasts.map(toast => (
                <ContextToast
                    key={toast.id}
                    id={toast.id}
                    message={toast.message}
                    type={toast.type}
                    action={toast.action}
                    showDismissButton={showDismissButton}
                    timeout={toast.timeout}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
};

// ContextToast Provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    // `addToast` and `removeToast` are memoised, and the context value with
    // them, because consumers routinely list addToast in useCallback/useEffect
    // dependency arrays. Recreating them on every render gave every one of
    // those a new identity each time the provider re-rendered — which a toast
    // itself causes — so data-loading effects re-fired in a loop and pages
    // silently refetched everything after every mutation.
    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType = 'info', timeout = 1500, action?: ContextToastAction) => {
            // Date.now() alone collides when two toasts are raised in the same
            // millisecond, which a bulk action does routinely.
            const id = `${Date.now().toString()}-${Math.random().toString(36).slice(2, 8)}`;
            setToasts(prev => [...prev, { id, message, type, timeout, action }]);
            return id;
        },
        []
    );

    const value = useMemo(
        () => ({ toasts, addToast, removeToast }),
        [toasts, addToast, removeToast]
    );

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
