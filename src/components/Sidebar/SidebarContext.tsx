import React, { useCallback, useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

import { SidebarContext } from './useSidebar';

interface SidebarProviderProps {
    children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => ({ isMobile, isOpen, toggle, open, close }), [isMobile, isOpen, toggle, open, close]);

    return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};
