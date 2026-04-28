import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ControlPanelContextValue {
    isMobile: boolean;
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

interface ControlPanelProviderProps {
    children: React.ReactNode;
}

const ControlPanelContext = createContext<ControlPanelContextValue | null>(null);

export const useControlPanelContext = (): ControlPanelContextValue | null => useContext(ControlPanelContext);

export const useControlPanel = (): ControlPanelContextValue => {
    const context = useControlPanelContext();

    if (!context) {
        throw new Error('useControlPanel must be used within a ControlPanelProvider');
    }

    return context;
};

export const ControlPanelProvider: React.FC<ControlPanelProviderProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(
        () => ({ isMobile, isOpen, toggle, open, close }),
        [isMobile, isOpen, toggle, open, close],
    );

    return <ControlPanelContext.Provider value={value}>{children}</ControlPanelContext.Provider>;
};
