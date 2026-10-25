import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import './Tooltip.scss';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
    title: React.ReactNode;
    position?: TooltipPosition;
    delay?: number;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    maxWidth?: number | string;
    maxHeight?: number | string;
}

/**
 * Lets a tooltip inside another tooltip's trigger tell the outer one it is showing. The innermost
 * tooltip wins: a card-level explanation steps aside while a pill inside the card shows its own,
 * instead of the two stacking on top of each other.
 */
const NestedTooltipContext = createContext<((isShowing: boolean) => void) | null>(null);

export const Tooltip: React.FC<TooltipProps> = ({ title, position = 'top', delay = 200, children, disabled = false, className = '', maxWidth, maxHeight }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showingDescendants, setShowingDescendants] = useState(0);
    const reportToParent = useContext(NestedTooltipContext);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const isTouchInteractionRef = useRef(false);
    const isInteractive = maxHeight !== undefined;
    const closeDelay = isInteractive ? 150 : 0;
    const hasContent = Boolean(title) && !disabled;
    const isShown = isVisible && hasContent && showingDescendants === 0;
    // Claimed while this tooltip or any tooltip inside it is up, so every ancestor stays hidden.
    const isClaiming = (isVisible && hasContent) || showingDescendants > 0;

    const handleDescendantShowing = useCallback((isShowing: boolean) => {
        setShowingDescendants(count => Math.max(0, count + (isShowing ? 1 : -1)));
    }, []);

    useEffect(() => {
        if (!reportToParent || !isClaiming) return;
        reportToParent(true);
        return () => reportToParent(false);
    }, [isClaiming, reportToParent]);

    const calculatePosition = useCallback(() => {
        if (!triggerRef.current || !tooltipRef.current) return;

        // `.tooltip-trigger` is `display: contents`, so the span generates no box of its own and
        // its rect is always zero — the trigger has to be measured through its children.
        //
        // Prefer the first element child: for normal inline content it matches the rendered
        // content, and for an absolutely-positioned child it gives the real on-screen bounds,
        // which a Range would collapse because the child is out of flow.
        //
        // Otherwise measure a Range over the span's contents. That covers a bare text node —
        // `<Tooltip>ⓘ</Tooltip>` has no element child at all, and without this the zero rect
        // pinned the tooltip to the top-left corner of the viewport.
        const childEl = triggerRef.current.firstElementChild as HTMLElement | null;
        const childRect = childEl?.getBoundingClientRect();
        let triggerRect = childRect && childRect.width > 0 ? childRect : triggerRef.current.getBoundingClientRect();

        if (triggerRect.width === 0 && triggerRect.height === 0) {
            const range = document.createRange();
            range.selectNodeContents(triggerRef.current);
            const rangeRect = range.getBoundingClientRect();

            if (rangeRect.width > 0 || rangeRect.height > 0) {
                triggerRect = rangeRect;
            }
        }
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const spacing = 8;

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = triggerRect.top - tooltipRect.height - spacing;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'bottom':
                top = triggerRect.bottom + spacing;
                left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
                break;
            case 'left':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.left - tooltipRect.width - spacing;
                break;
            case 'right':
                top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
                left = triggerRect.right + spacing;
                break;
        }

        // Keep tooltip within viewport
        const margin = 8;
        if (left < margin) left = margin;
        if (left + tooltipRect.width > window.innerWidth - margin) {
            left = window.innerWidth - tooltipRect.width - margin;
        }
        if (top < margin) top = margin;
        if (top + tooltipRect.height > window.innerHeight - margin) {
            top = window.innerHeight - tooltipRect.height - margin;
        }

        setTooltipPosition({ top, left });
    }, [position]);

    const handleMouseEnter = () => {
        if (disabled || isTouchInteractionRef.current) return;

        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (isTouchInteractionRef.current) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (closeDelay > 0) {
            closeTimeoutRef.current = setTimeout(() => setIsVisible(false), closeDelay);
        } else {
            setIsVisible(false);
        }
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLSpanElement>) => {
        if (event.pointerType !== 'touch' && event.pointerType !== 'pen') return;
        if (disabled) return;

        isTouchInteractionRef.current = true;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        event.stopPropagation();
        setIsVisible(prev => !prev);
    };

    useEffect(() => {
        if (!isShown) return;

        // Scrolling moves the trigger out from under the pointer — often behind an `overflow`
        // ancestor that clips it — without a mouseleave, so following it would leave a tooltip
        // pointing at nothing. Close instead; only scrolling inside an interactive tooltip keeps it.
        const handleScroll = (event: Event) => {
            if (event.target instanceof Node && tooltipRef.current?.contains(event.target)) return;
            setIsVisible(false);
        };

        calculatePosition();
        window.addEventListener('scroll', handleScroll, true);
        window.addEventListener('resize', calculatePosition);

        return () => {
            window.removeEventListener('scroll', handleScroll, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isShown, calculatePosition]);

    useEffect(() => {
        if (!isVisible) return;

        const handleOutsidePointerDown = (event: PointerEvent) => {
            if (triggerRef.current?.contains(event.target as Node)) return;
            if (tooltipRef.current?.contains(event.target as Node)) return;
            setIsVisible(false);
        };

        document.addEventListener('pointerdown', handleOutsidePointerDown);
        return () => {
            document.removeEventListener('pointerdown', handleOutsidePointerDown);
            isTouchInteractionRef.current = false;
        };
    }, [isVisible]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const handleTooltipMouseEnter = () => {
        if (!isInteractive) return;
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const handleTooltipMouseLeave = () => {
        if (!isInteractive) return;
        closeTimeoutRef.current = setTimeout(() => setIsVisible(false), closeDelay);
    };

    return (
        <>
            <span
                ref={triggerRef}
                className="tooltip-trigger"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleMouseEnter}
                onBlur={handleMouseLeave}
                onPointerDown={handlePointerDown}
            >
                <NestedTooltipContext.Provider value={handleDescendantShowing}>{children}</NestedTooltipContext.Provider>
            </span>
            {isShown &&
                createPortal(
                    <div
                        ref={tooltipRef}
                        className={`tooltip tooltip--${position} ${isInteractive ? 'tooltip--scrollable' : ''} ${className}`}
                        style={{
                            top: `${tooltipPosition.top}px`,
                            left: `${tooltipPosition.left}px`,
                            ...(maxWidth !== undefined && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
                            ...(maxHeight !== undefined && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
                        }}
                        onMouseEnter={handleTooltipMouseEnter}
                        onMouseLeave={handleTooltipMouseLeave}
                    >
                        {title}
                        <div className={`tooltip__arrow tooltip__arrow--${position}`} />
                    </div>,
                    document.body
                )}
        </>
    );
};
