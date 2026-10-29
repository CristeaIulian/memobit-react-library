import { createContext, useContext } from 'react';

export interface ControlPanelContextValue {
    isMobile: boolean;
    /** The panel opens over the page from the toolbar: always on mobile, and on desktop once undocked. */
    isDrawer: boolean;
    /** The panel can be undocked here: the provider allows it and the screen isn't mobile. */
    undockable: boolean;
    setUndocked: (undocked: boolean) => void;
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
