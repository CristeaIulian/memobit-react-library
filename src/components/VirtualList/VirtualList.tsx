import { ReactNode, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import './VirtualList.scss';

const ESTIMATED_ROW_HEIGHT = 96;
const DEFAULT_OVERSCAN = 6;

export interface VirtualListProps<T> {
    items: T[];
    /** Content of a single row. The row element itself is provided by the list. */
    renderItem: (item: T, index: number) => ReactNode;
    getKey: (item: T, index: number) => string | number;
    /**
     * Row stride in pixels (row height plus the gap below it). Leave unset to
     * measure it from the first rendered rows, which keeps it in step with the
     * active theme's font sizes.
     */
    rowHeight?: number;
    /** Rows kept mounted above and below the viewport. Defaults to 6. */
    overscan?: number;
    /** Height cap for the scroller. Defaults to the value in the stylesheet. */
    maxHeight?: number | string;
    /** Rendered in place of the list when `items` is empty. */
    empty?: ReactNode;
    className?: string;
    rowClassName?: string;
}

/**
 * Renders only the rows in view, so a list of tens of thousands of items costs
 * the same handful of DOM nodes and React fibers as a short one. The rows that
 * are not mounted are held open by spacer elements, which keeps the scrollbar,
 * scroll offsets and wheel behaviour identical to a fully rendered list.
 *
 * Rows must all be the SAME HEIGHT — the list measures one and multiplies. Give
 * variable-length content a fixed height in CSS (a line clamp on text, a fixed
 * thumbnail size) or rows will drift out of step with the spacers.
 */
export function VirtualList<T>({
    items,
    renderItem,
    getKey,
    rowHeight,
    overscan = DEFAULT_OVERSCAN,
    maxHeight,
    empty,
    className = '',
    rowClassName = '',
}: VirtualListProps<T>) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);
    const [viewportHeight, setViewportHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(() => window.innerHeight);
    const [measuredRowHeight, setMeasuredRowHeight] = useState(ESTIMATED_ROW_HEIGHT);

    const stride = rowHeight && rowHeight > 0 ? rowHeight : measuredRowHeight;

    // The browser already coalesces scroll events to one per frame, and the
    // rendered window is a few rows, so React's batching is throttle enough.
    const handleScroll = useCallback((event: UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    useEffect(() => {
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const observer = new ResizeObserver(entries => {
            const height = entries[0]?.contentRect.height ?? 0;
            setViewportHeight(previous => (Math.abs(previous - height) > 0.5 ? height : previous));
        });
        observer.observe(scroller);
        setViewportHeight(scroller.clientHeight);

        return () => observer.disconnect();
    }, []);

    // A different list starts at the top; a retained offset would point into rows
    // that no longer exist.
    useLayoutEffect(() => {
        if (scrollerRef.current) scrollerRef.current.scrollTop = 0;
        setScrollTop(0);
    }, [items]);

    const rowCount = items.length;
    // The scroller's own height would be self-reinforcing if it ever grew with
    // its content (more rows mounted -> taller scroller -> more rows mounted), so
    // the window is the hard ceiling: no more rows fit on screen than that.
    const rowsOnScreen = Math.ceil(Math.min(viewportHeight || windowHeight, windowHeight) / stride);
    const visibleCount = Math.max(1, rowsOnScreen + overscan * 2);
    const maxStart = Math.max(0, rowCount - visibleCount);
    const startIndex = Math.min(maxStart, Math.max(0, Math.floor(scrollTop / stride) - overscan));
    const endIndex = Math.min(rowCount, startIndex + visibleCount);
    const rowsBelow = Math.max(0, rowCount - endIndex);

    // Two consecutive rows, so the gap between them lands in the stride.
    useLayoutEffect(() => {
        if (rowHeight) return;

        const scroller = scrollerRef.current;
        if (!scroller) return;

        const rows = scroller.querySelectorAll<HTMLElement>('[data-virtual-row]');
        const first = rows[0];
        if (!first) return;

        const measured = rows[1] ? rows[1].offsetTop - first.offsetTop : first.offsetHeight;
        if (measured > 0) {
            setMeasuredRowHeight(previous => (Math.abs(previous - measured) > 0.5 ? measured : previous));
        }
    }, [items, rowHeight, viewportHeight]);

    if (rowCount === 0) {
        return empty ? <>{empty}</> : null;
    }

    return (
        <div className={`virtual-list ${className}`.trim()} ref={scrollerRef} onScroll={handleScroll} style={maxHeight === undefined ? undefined : { maxHeight }}>
            {startIndex > 0 && <div className="virtual-list__spacer" style={{ height: startIndex * stride }} />}
            {items.slice(startIndex, endIndex).map((item, offset) => {
                const index = startIndex + offset;
                return (
                    <div className={`virtual-list__row ${rowClassName}`.trim()} data-virtual-row="" key={getKey(item, index)}>
                        {renderItem(item, index)}
                    </div>
                );
            })}
            {rowsBelow > 0 && <div className="virtual-list__spacer" style={{ height: rowsBelow * stride }} />}
        </div>
    );
}
