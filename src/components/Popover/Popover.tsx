import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './Popover.scss';

type Placement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface Position {
    top: number;
    left: number;
    placement: Exclude<Placement, 'auto'>;
}

interface PopoverProps {
    /** Popover content */
    children: ReactNode;
    /** Whether the popover is visible */
    visible: boolean;
    /** Function to close the popover */
    onClose: () => void;
    /** Reference to the trigger element */
    anchorEl: HTMLElement | null;
    /** Offset from the anchor element */
    offset?: number;
    /** Preferred placement of the popover (defaults to 'auto' which picks the best position) */
    placement?: Placement;
}

const VIEWPORT_MARGIN = 20;
const DEFAULT_OFFSET = 8;

export const Popover: FC<PopoverProps> = ({ children, visible, onClose, anchorEl, offset = DEFAULT_OFFSET, placement = 'auto' }) => {
    const popoverRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [position, setPosition] = useState<Position>({
        top: 0,
        left: 0,
        placement: 'bottom',
    });

    // Calculate position
    const updatePosition = useCallback(() => {
        if (!anchorEl || !popoverRef.current || !visible) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // Helper to check if a position fits in viewport
        const fitsInViewport = (top: number, left: number): boolean => {
            return (
                top >= VIEWPORT_MARGIN &&
                left >= VIEWPORT_MARGIN &&
                top + popoverRect.height <= viewport.height - VIEWPORT_MARGIN &&
                left + popoverRect.width <= viewport.width - VIEWPORT_MARGIN
            );
        };

        // Calculate positions for each placement
        const positions: Record<Exclude<Placement, 'auto'>, { top: number; left: number }> = {
            bottom: {
                top: anchorRect.bottom + offset,
                left: anchorRect.left + (anchorRect.width - popoverRect.width) / 2,
            },
            top: {
                top: anchorRect.top - popoverRect.height - offset,
                left: anchorRect.left + (anchorRect.width - popoverRect.width) / 2,
            },
            left: {
                top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
                left: anchorRect.left - popoverRect.width - offset,
            },
            right: {
                top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
                left: anchorRect.right + offset,
            },
        };

        // Determine final placement
        let finalPlacement: Exclude<Placement, 'auto'>;
        let { top, left } = positions.bottom;

        if (placement === 'auto') {
            // Try placements in order of preference
            const preferenceOrder: Array<Exclude<Placement, 'auto'>> = ['bottom', 'top', 'right', 'left'];
            finalPlacement = preferenceOrder.find((p) => {
                const pos = positions[p];
                return fitsInViewport(pos.top, pos.left);
            }) || 'bottom';
            ({ top, left } = positions[finalPlacement]);
        } else {
            // Use specified placement, fallback to auto if doesn't fit
            const preferredPos = positions[placement];
            if (fitsInViewport(preferredPos.top, preferredPos.left)) {
                finalPlacement = placement;
                ({ top, left } = preferredPos);
            } else {
                // Fallback to best available position
                const fallbackOrder = (['bottom', 'top', 'right', 'left'] as Array<Exclude<Placement, 'auto'>>).filter((p) => p !== placement);
                finalPlacement = fallbackOrder.find((p) => {
                    const pos = positions[p];
                    return fitsInViewport(pos.top, pos.left);
                }) || placement;
                ({ top, left } = positions[finalPlacement]);
            }
        }

        // Constrain to viewport boundaries for horizontal centering on top/bottom
        if (finalPlacement === 'top' || finalPlacement === 'bottom') {
            if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
            if (left + popoverRect.width > viewport.width - VIEWPORT_MARGIN) {
                left = viewport.width - popoverRect.width - VIEWPORT_MARGIN;
            }
        }

        // Constrain to viewport boundaries for vertical centering on left/right
        if (finalPlacement === 'left' || finalPlacement === 'right') {
            if (top < VIEWPORT_MARGIN) top = VIEWPORT_MARGIN;
            if (top + popoverRect.height > viewport.height - VIEWPORT_MARGIN) {
                top = viewport.height - popoverRect.height - VIEWPORT_MARGIN;
            }
        }

        setPosition({ top, left, placement: finalPlacement });
    }, [anchorEl, visible, offset, placement]);

    useEffect(() => {
        if (visible) {
            animationFrameRef.current = requestAnimationFrame(updatePosition);
        }

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [visible, updatePosition]);

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
    }, [visible, onClose, anchorEl, updatePosition]);

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
