import React, { useEffect,useRef, useState } from 'react';

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

export const Tooltip: React.FC<TooltipProps> = ({ title, position = 'top', delay = 200, children, disabled = false, className = '', maxWidth, maxHeight }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const triggerRef = useRef<HTMLSpanElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const isTouchInteractionRef = useRef(false);
    const isInteractive = maxHeight !== undefined;
    const closeDelay = isInteractive ? 150 : 0;

    const calculatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        // The inline-flex `.tooltip-trigger` span collapses to zero size
        // when its child is absolutely-positioned (taken out of flow),
        // which would place the tooltip at the parent's inline insertion
        // point instead of over the actual content. Prefer the first
        // element child's rect — for normal inline content it matches the
        // span; for absolute/fixed children it gives the real on-screen
        // bounds we want to anchor against.
        const childEl = triggerRef.current.firstElementChild as HTMLElement | null;
        const triggerRect =
            childEl && childEl.getBoundingClientRect().width > 0
                ? childEl.getBoundingClientRect()
                : triggerRef.current.getBoundingClientRect();
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
    };

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
        if (isVisible) {
            calculatePosition();
            window.addEventListener('scroll', calculatePosition, true);
            window.addEventListener('resize', calculatePosition);
        }

        return () => {
            window.removeEventListener('scroll', calculatePosition, true);
            window.removeEventListener('resize', calculatePosition);
        };
    }, [isVisible]);

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
                {children}
            </span>
            {isVisible &&
                title &&
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
