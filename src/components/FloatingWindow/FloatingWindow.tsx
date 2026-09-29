import { CSSProperties, FC, PointerEvent as ReactPointerEvent, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { Icon, IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

import './FloatingWindow.scss';

export type FloatingWindowResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

export interface FloatingWindowPosition {
    x: number;
    y: number;
}

export interface FloatingWindowSize {
    height: number;
    width: number;
}

export interface FloatingWindowProps {
    children: ReactNode;
    className?: string;
    /** Escape closes the window. Off by default — a floating window is not modal. */
    closeOnEscape?: boolean;
    /** Opening position in viewport pixels. Centred on the viewport when omitted. */
    defaultPosition?: FloatingWindowPosition;
    defaultSize?: FloatingWindowSize;
    /** Pinned strip along the bottom of the window. */
    footer?: ReactNode;
    isOpen: boolean;
    /** Shows the collapse control. */
    minimizable?: boolean;
    minHeight?: number;
    minWidth?: number;
    onClose: () => void;
    /** Reports every settled move and resize, for callers that persist the geometry. */
    onGeometryChange?: (geometry: FloatingWindowPosition & FloatingWindowSize) => void;
    /** Shows the maximize control and the edge handles. */
    resizable?: boolean;
    title?: string;
    titleIcon?: IconName;
    usePortal?: boolean;
    zIndex?: number;
}

const RESIZE_DIRECTIONS: FloatingWindowResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

// How much of the window must stay on screen, so a window dragged to an edge can always be
// grabbed again by its header.
const VISIBLE_MARGIN = 48;
const MAXIMIZED_INSET = 16;

interface DragState {
    pointerId: number;
    startPointer: FloatingWindowPosition;
    startRect: FloatingWindowPosition & FloatingWindowSize;
    /** Absent for a header drag; set for a resize. */
    direction?: FloatingWindowResizeDirection;
}

interface FloatingWindowCustomProperties extends CSSProperties {
    '--_window-z': number;
}

export const FloatingWindow: FC<FloatingWindowProps> = ({
    children,
    className = '',
    closeOnEscape = false,
    defaultPosition,
    defaultSize = { height: 360, width: 480 },
    footer,
    isOpen,
    minimizable = true,
    minHeight = 140,
    minWidth = 260,
    onClose,
    onGeometryChange,
    resizable = true,
    title,
    titleIcon,
    usePortal = true,
    zIndex = 900,
}: FloatingWindowProps): ReactElement | null => {
    const [size, setSize] = useState<FloatingWindowSize>(defaultSize);
    const [position, setPosition] = useState<FloatingWindowPosition>(
        () =>
            defaultPosition ?? {
                x: Math.max(0, (window.innerWidth - defaultSize.width) / 2),
                y: Math.max(0, (window.innerHeight - defaultSize.height) / 3),
            }
    );
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    // The geometry to restore when un-maximizing.
    const restoreRef = useRef<(FloatingWindowPosition & FloatingWindowSize) | null>(null);
    const dragRef = useRef<DragState | null>(null);

    const clampPosition = useCallback(
        (next: FloatingWindowPosition, forSize: FloatingWindowSize): FloatingWindowPosition => ({
            x: Math.min(Math.max(next.x, VISIBLE_MARGIN - forSize.width), window.innerWidth - VISIBLE_MARGIN),
            y: Math.min(Math.max(next.y, 0), window.innerHeight - VISIBLE_MARGIN),
        }),
        []
    );

    const reportGeometry = useCallback(() => {
        onGeometryChange?.({ ...position, ...size });
    }, [onGeometryChange, position, size]);

    const beginDrag = useCallback(
        (event: ReactPointerEvent<HTMLElement>, direction?: FloatingWindowResizeDirection) => {
            if (isMaximized) return;

            event.preventDefault();
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);

            dragRef.current = {
                direction,
                pointerId: event.pointerId,
                startPointer: { x: event.clientX, y: event.clientY },
                startRect: { ...position, ...size },
            };
        },
        [isMaximized, position, size]
    );

    // One handler drives both moving and resizing: a header drag shifts the rect, an edge
    // drag grows it from the side being pulled, with the opposite side staying put.
    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLElement>) => {
            const drag = dragRef.current;
            if (!drag || drag.pointerId !== event.pointerId) return;

            const dx = event.clientX - drag.startPointer.x;
            const dy = event.clientY - drag.startPointer.y;
            const { startRect, direction } = drag;

            if (!direction) {
                setPosition(clampPosition({ x: startRect.x + dx, y: startRect.y + dy }, startRect));
                return;
            }

            let { height, width, x, y } = startRect;

            if (direction.includes('e')) {
                width = Math.max(minWidth, startRect.width + dx);
            }

            if (direction.includes('w')) {
                width = Math.max(minWidth, startRect.width - dx);
                // Only travel as far as the width actually gave way, so the right edge is fixed.
                x = startRect.x + (startRect.width - width);
            }

            if (direction.includes('s')) {
                height = Math.max(minHeight, startRect.height + dy);
            }

            if (direction.includes('n')) {
                height = Math.max(minHeight, startRect.height - dy);
                y = startRect.y + (startRect.height - height);
            }

            setSize({ height, width });
            setPosition({ x, y });
        },
        [clampPosition, minHeight, minWidth]
    );

    const handlePointerUp = useCallback(
        (event: ReactPointerEvent<HTMLElement>) => {
            if (!dragRef.current) return;

            event.currentTarget.releasePointerCapture(event.pointerId);
            dragRef.current = null;
            reportGeometry();
        },
        [reportGeometry]
    );

    const toggleMaximized = useCallback(() => {
        setIsMaximized(current => {
            if (current) {
                const restore = restoreRef.current;
                if (restore) {
                    setPosition({ x: restore.x, y: restore.y });
                    setSize({ height: restore.height, width: restore.width });
                }

                return false;
            }

            restoreRef.current = { ...position, ...size };
            setIsMinimized(false);

            return true;
        });
    }, [position, size]);

    useEffect(() => {
        if (!isOpen || !closeOnEscape) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleEscape);

        return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, onClose]);

    // A window left near the right or bottom edge must not end up unreachable when the
    // viewport shrinks.
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => setPosition(current => clampPosition(current, size));

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [clampPosition, isOpen, size]);

    if (!isOpen) return null;

    const windowStyle: FloatingWindowCustomProperties = isMaximized
        ? {
              '--_window-z': zIndex,
              height: `calc(100vh - ${MAXIMIZED_INSET * 2}px)`,
              left: MAXIMIZED_INSET,
              top: MAXIMIZED_INSET,
              width: `calc(100vw - ${MAXIMIZED_INSET * 2}px)`,
          }
        : {
              '--_window-z': zIndex,
              height: isMinimized ? undefined : size.height,
              left: position.x,
              top: position.y,
              width: size.width,
          };

    const classes = [
        'floating-window',
        isMaximized ? 'floating-window--maximized' : '',
        isMinimized ? 'floating-window--minimized' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <div className={classes} style={windowStyle}>
            <div
                className="floating-window__header"
                onDoubleClick={resizable ? toggleMaximized : undefined}
                onPointerDown={beginDrag}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <span className="floating-window__title">
                    {titleIcon && <Icon name={titleIcon} size="sm" />}
                    {title}
                </span>

                <span className="floating-window__actions">
                    {minimizable && (
                        <Tooltip title={isMinimized ? 'Expand' : 'Collapse'}>
                            <button
                                className="floating-window__action"
                                onClick={() => setIsMinimized(current => !current)}
                                onPointerDown={event => event.stopPropagation()}
                                type="button"
                            >
                                {isMinimized ? '▢' : '—'}
                            </button>
                        </Tooltip>
                    )}

                    {resizable && (
                        <Tooltip title={isMaximized ? 'Restore' : 'Maximize'}>
                            <button
                                className="floating-window__action"
                                onClick={toggleMaximized}
                                onPointerDown={event => event.stopPropagation()}
                                type="button"
                            >
                                {isMaximized ? '❐' : '□'}
                            </button>
                        </Tooltip>
                    )}

                    <Tooltip title="Close">
                        <button
                            className="floating-window__action floating-window__action--close"
                            onClick={onClose}
                            onPointerDown={event => event.stopPropagation()}
                            type="button"
                        >
                            ✕
                        </button>
                    </Tooltip>
                </span>
            </div>

            {!isMinimized && (
                <>
                    <div className="floating-window__body">{children}</div>
                    {footer && <div className="floating-window__footer">{footer}</div>}
                </>
            )}

            {resizable &&
                !isMaximized &&
                !isMinimized &&
                RESIZE_DIRECTIONS.map(direction => (
                    <span
                        className={`floating-window__handle floating-window__handle--${direction}`}
                        key={direction}
                        onPointerDown={event => beginDrag(event, direction)}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                    />
                ))}
        </div>
    );

    return usePortal ? createPortal(content, document.body) : content;
};
