import { type CSSProperties, type MouseEvent, type ReactElement, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import './ContextMenu.scss';

interface ContextMenuProps {
    autoClose?: boolean;
    children: ReactElement;
    onClose?: () => void;
    /** The element the menu opens below. Not needed when `position` is given. */
    target?: EventTarget | null;
    /**
     * Opens the menu at a point in the viewport instead of below an element: pass a right-click's `clientX` and
     * `clientY` for a menu at the cursor. Wins over `target` when both are given.
     */
    position?: { x: number; y: number } | null;
}

/** The box the menu opens from: the point, or the target element's box. */
const anchorRect = (target: EventTarget | null | undefined, position: { x: number; y: number } | null | undefined) => {
    if (position) return { top: position.y, bottom: position.y, left: position.x };
    return target ? (target as Element).getBoundingClientRect() : null;
};

export const ContextMenu = ({ target, position, onClose, children, autoClose = false }: ContextMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [menuStyle, setMenuStyle] = useState<CSSProperties>(() => {
        const rect = anchorRect(target, position);
        if (!rect) {
            return { opacity: 0 };
        }

        return {
            top: `${rect.bottom}px`,
            left: `${rect.left}px`,
            opacity: 0,
        };
    });

    // The point's coordinates, not the object: callers pass a fresh { x, y } on every render.
    const pointX = position?.x;
    const pointY = position?.y;

    useEffect(() => {
        const point = pointX === undefined || pointY === undefined ? null : { x: pointX, y: pointY };
        if (!anchorRect(target, point) || !menuRef.current) {
            return;
        }

        // Use requestAnimationFrame to ensure layout is complete before measuring
        const frameId = requestAnimationFrame(() => {
            if (!menuRef.current) {
                return;
            }

            const rect = anchorRect(target, point);
            if (!rect) {
                return;
            }
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
    }, [target, pointX, pointY]);

    const handleMenuClick = (_event: MouseEvent<HTMLDivElement>) => {
        if (autoClose) {
            // Close menu when any descendant is clicked
            onClose?.();
        }
    };

    if (!target && !position) {
        return null;
    }

    return createPortal(
        <>
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1190,
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
