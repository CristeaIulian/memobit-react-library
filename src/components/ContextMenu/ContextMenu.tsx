import { type ReactElement, type CSSProperties, type MouseEvent, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import './ContextMenu.scss';

interface ContextMenuProps {
    autoClose?: boolean;
    children: ReactElement;
    onClose?: () => void;
    target: EventTarget;
}

export const ContextMenu = ({ target, onClose, children, autoClose = false }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [menuStyle, setMenuStyle] = useState<CSSProperties>(() => {
        if (!target) {
            return { opacity: 0 };
        }

        const rect = (target as Element).getBoundingClientRect();
        return {
            top: `${rect.bottom}px`,
            left: `${rect.left}px`,
            opacity: 0,
        };
    });

    useEffect(() => {
        if (!target || !menuRef.current) {
            return;
        }

        // Use requestAnimationFrame to ensure layout is complete before measuring
        const frameId = requestAnimationFrame(() => {
            if (!menuRef.current) {
                return;
            }

            const rect = (target as Element).getBoundingClientRect();
            const menuRect = menuRef.current.getBoundingClientRect();

            // Use document.documentElement for more accurate viewport dimensions on mobile
            const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
            const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
            const padding = 8; // Small padding from viewport edges

            let top = rect.bottom;
            let left = rect.left;

            // Check if menu overflows right edge
            if (left + menuRect.width > viewportWidth - padding) {
                // Position menu so it stays within viewport, aligned to the right edge with padding
                left = Math.max(padding, viewportWidth - menuRect.width - padding);
            }

            // Ensure menu doesn't overflow left edge
            if (left < padding) {
                left = padding;
            }

            // Check if menu overflows bottom edge
            if (top + menuRect.height > viewportHeight - padding) {
                // Position menu above the target
                top = Math.max(padding, rect.top - menuRect.height);
            }

            // Ensure menu doesn't overflow top edge
            if (top < padding) {
                top = padding;
            }

            setMenuStyle({
                top: `${top}px`,
                left: `${left}px`,
                opacity: 1,
            });

            // Trigger animation after positioning
            setIsVisible(true);
        });

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, [target]);

    const handleMenuClick = (_event: MouseEvent<HTMLDivElement>) => {
        if (autoClose) {
            // Close menu when any descendant is clicked
            onClose?.();
        }
    };

    if (!target) {
        return null;
    }

    return createPortal(
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 999,
                }}
                className="memobit-context-menu-back-drop"
                onClick={onClose}
            />
            <div
                ref={menuRef}
                className={`memobit-context-menu ${isVisible ? 'memobit-context-menu--visible' : ''}`}
                style={menuStyle}
                onClick={handleMenuClick}
            >
                {children}
            </div>
        </>,
        document.body
    );
};
