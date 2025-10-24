import { useState } from 'react';

/**
 * Hook pentru multiple popover-uri cu ID-uri
 * Util când ai multe popover-uri și vrei să le controlezi individual
 */
export const usePopover = () => {
    const [state, setState] = useState<{
        [id: string]: { visible: boolean; anchorEl: HTMLElement | null };
    }>({});

    const show = (id: string, element: HTMLElement | React.MouseEvent) => {
        const targetElement = element instanceof HTMLElement ? element : (element.currentTarget as HTMLElement);

        setState(prev => ({
            ...prev,
            [id]: { visible: true, anchorEl: targetElement },
        }));
    };

    const hide = (id: string) => {
        setState(prev => ({
            ...prev,
            [id]: { visible: false, anchorEl: null },
        }));
    };

    const toggle = (id: string, element: HTMLElement | React.MouseEvent) => {
        const current = state[id];
        if (current?.visible) {
            hide(id);
        } else {
            show(id, element);
        }
    };

    const isVisible = (id: string) => state[id]?.visible || false;
    const getAnchorEl = (id: string) => state[id]?.anchorEl || null;

    return {
        show,
        hide,
        toggle,
        isVisible,
        getAnchorEl,
    };
};
