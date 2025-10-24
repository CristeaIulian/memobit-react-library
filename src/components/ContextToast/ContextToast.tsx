import React, { useState, useEffect, createContext, useContext } from 'react';

import './ContextToast.scss';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

interface ToastProps {
    id: string;
    message: string;
    type?: ToastType;
    onClose: (id: string) => void;
    timeout: number;
}

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    timeout: number;
}

interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (message: string, type?: ToastType, timeout?: number) => string;
    removeToast: (id: string) => void;
}

interface ToastContainerProps {
    position: 'bottom-left' | 'bottom-center' | 'bottom-right';
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

const CloseIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

// ContextToast Component for individual notifications
const ContextToast = ({ id, message, type = 'info', onClose, timeout = 2000 }: ToastProps) => {
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

    return (
        <div className={`toast toast--${type} ${isExiting ? 'toast--exiting' : ''}`}>
            <div className="toast__message">{message}</div>
            <button onClick={handleClose} className="toast__close-button">
                <CloseIcon />
            </button>
        </div>
    );
};

// ContextToast Container (Manages position and multiple toasts)
export const ToastContainer = ({ position = 'bottom-right' }: ToastContainerProps) => {
    const { toasts, removeToast } = useToast();

    return (
        <div className={`toast-container toast-container--${position}`}>
            {toasts.map(toast => (
                <ContextToast key={toast.id} id={toast.id} message={toast.message} type={toast.type} timeout={toast.timeout} onClose={removeToast} />
            ))}
        </div>
    );
};

// ContextToast Provider component
export const ToastProvider: React.FC<ToastProviderProps> = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    // Handle removing a toast
    const removeToast = (id: string) => {
        setToasts(toasts.filter(toast => toast.id !== id));
    };

    // Add a new toast
    const addToast = (message: string, type: ToastType = 'info', timeout = 1500) => {
        const id = Date.now().toString();
        setToasts([...toasts, { id, message, type, timeout }]);
        return id;
    };

    const value = {
        toasts,
        addToast,
        removeToast,
    };

    return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
