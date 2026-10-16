import { createContext, useContext } from 'react';

export interface ControlPanelContextValue {
    isMobile: boolean;
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}
export const ControlPanelContext = createContext<ControlPanelContextValue | null>(null);
export const useControlPanelContext = (): ControlPanelContextValue | null => useContext(ControlPanelContext);
export const useControlPanel = (): ControlPanelContextValue => {
    const context = useControlPanelContext();

    if (!context) {
        throw new Error('useControlPanel must be used within a ControlPanelProvider');
    }

    return context;
};
