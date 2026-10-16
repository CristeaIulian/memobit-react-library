import React, { useCallback, useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

import { ControlPanelContext } from './useControlPanel';

interface ControlPanelProviderProps {
    children: React.ReactNode;
}

export const ControlPanelProvider: React.FC<ControlPanelProviderProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isOpen, setIsOpen] = useState(false);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);

    const value = useMemo(() => ({ isMobile, isOpen, toggle, open, close }), [isMobile, isOpen, toggle, open, close]);

    return <ControlPanelContext.Provider value={value}>{children}</ControlPanelContext.Provider>;
};
