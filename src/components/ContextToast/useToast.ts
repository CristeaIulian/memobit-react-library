import { createContext, useContext } from 'react';

import './ContextToast.scss';

export type ToastType = 'info' | 'success' | 'warning' | 'danger';
export interface ContextToastAction {
    label: string;
    onClick: () => void;
}
export interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
    timeout: number;
    action?: ContextToastAction;
}
export interface ToastContextValue {
    toasts: ToastItem[];
    addToast: (message: string, type?: ToastType, timeout?: number, action?: ContextToastAction) => string;
    removeToast: (id: string) => void;
}
// Create a context for the toast functionality
export const ToastContext = createContext<ToastContextValue | null>(null);
// Custom hook to use the toast service
export const useToast = (): ToastContextValue => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
};
