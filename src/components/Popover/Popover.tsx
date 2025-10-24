import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './Popover.scss';

interface PopoverProps {
    /** Conținutul popover-ului */
    children: ReactNode;
    /** Dacă popover-ul este vizibil */
    visible: boolean;
    /** Funcție pentru închiderea popover-ului */
    onClose: () => void;
    /** Referința la elementul trigger */
    anchorEl: HTMLElement | null;
    /** Offset față de elementul anchor */
    offset?: number;
}

export const Popover: FC<PopoverProps> = ({ children, visible, onClose, anchorEl, offset = 8 }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number; placement: string }>({
        top: 0,
        left: 0,
        placement: 'bottom',
    });

    // Calculează poziția
    const updatePosition = () => {
        if (!anchorEl || !popoverRef.current || !visible) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        let top = anchorRect.bottom + offset;
        let left = anchorRect.left + (anchorRect.width - popoverRect.width) / 2;
        let placement = 'bottom';

        // Verifică dacă încape jos
        if (top + popoverRect.height > viewport.height - 20) {
            // Încearcă sus
            top = anchorRect.top - popoverRect.height - offset;
            placement = 'top';
        }

        // Verifică limitele orizontale
        if (left < 20) left = 20;
        if (left + popoverRect.width > viewport.width - 20) {
            left = viewport.width - popoverRect.width - 20;
        }

        setPosition({ top, left, placement });
    };

    useEffect(() => {
        if (visible) {
            requestAnimationFrame(updatePosition);
        }
    }, [visible, anchorEl]);

    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && anchorEl && !popoverRef.current.contains(event.target as Node) && !anchorEl.contains(event.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        window.addEventListener('resize', updatePosition);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('resize', updatePosition);
        };
    }, [visible, onClose, anchorEl]);

    if (!visible || !anchorEl) return null;

    const content = (
        <div
            ref={popoverRef}
            className={`simple-popover simple-popover--${position.placement}`}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 9999,
            }}
        >
            <div className="simple-popover__arrow" />
            <div className="simple-popover__content">{children}</div>
        </div>
    );

    return createPortal(content, document.body);
};
