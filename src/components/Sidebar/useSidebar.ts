import { createContext, useContext } from 'react';

export interface SidebarContextValue {
    isMobile: boolean;
    isOpen: boolean;
    toggle: () => void;
    open: () => void;
    close: () => void;
}
export const SidebarContext = createContext<SidebarContextValue | null>(null);
export const useSidebarContext = (): SidebarContextValue | null => useContext(SidebarContext);
export const useSidebar = (): SidebarContextValue => {
    const context = useSidebarContext();

    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }

    return context;
};
