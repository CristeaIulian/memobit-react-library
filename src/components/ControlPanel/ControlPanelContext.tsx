import React, { useCallback, useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';

import { ControlPanelContext } from './useControlPanel';

interface ControlPanelProviderProps {
    children: React.ReactNode;
    /**
     * Lets the user undock the panel on desktop: it then opens over the page from the toolbar, like the
     * mobile drawer, and the page gets the full width. The choice is remembered (per app, as each app
     * has its own origin).
     */
    undockable?: boolean;
}

const UNDOCKED_STORAGE_KEY = 'memobit-control-panel-undocked';

const readUndocked = (): boolean => {
    try {
        return localStorage.getItem(UNDOCKED_STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
};

export const ControlPanelProvider: React.FC<ControlPanelProviderProps> = ({ children, undockable = false }) => {
    const { isMobile } = useBreakpoint();
    const [isOpen, setIsOpen] = useState(false);
    const [isUndocked, setIsUndocked] = useState(readUndocked);

    const toggle = useCallback(() => setIsOpen(prev => !prev), []);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const setUndocked = useCallback((undocked: boolean) => {
        setIsUndocked(undocked);
        setIsOpen(false);
        try {
            localStorage.setItem(UNDOCKED_STORAGE_KEY, String(undocked));
        } catch {
            // Storage unavailable (private mode): the choice lasts until reload.
        }
    }, []);

    const canUndock = undockable && !isMobile;
    const isDrawer = isMobile || (canUndock && isUndocked);

    const value = useMemo(
        () => ({ isMobile, isDrawer, undockable: canUndock, setUndocked, isOpen, toggle, open, close }),
        [isMobile, isDrawer, canUndock, setUndocked, isOpen, toggle, open, close]
    );

    return <ControlPanelContext.Provider value={value}>{children}</ControlPanelContext.Provider>;
};
