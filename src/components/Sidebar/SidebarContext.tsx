import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

interface SidebarContextValue {
    isMobile: boolean;
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}

interface SidebarProviderProps {
    children: React.ReactNode;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebar = (): SidebarContextValue => {
    const context = useContext(SidebarContext);

    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }

    return context;
};

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(
        () => ({ isMobile, isOpen, toggle, open, close }),
        [isMobile, isOpen, toggle, open, close],
    );

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
