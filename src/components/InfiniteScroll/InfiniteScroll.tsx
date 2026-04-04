import { CSSProperties, ReactNode, useCallback, useEffect, useRef } from 'react';

import './InfiniteScroll.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScrollInfo {
    scrollTop: number; // px from top
    scrollHeight: number; // total scrollable height
    clientHeight: number; // visible height of the container
    scrollPercent: number; // 0–100
    isAtTop: boolean;
    isAtBottom: boolean;
}

interface InfiniteScrollProps {
    children: ReactNode;
    onLoadMore: () => void; // called when sentinel is intersected
    hasMore: boolean; // whether more data is available
    isLoading?: boolean; // external loading state
    threshold?: number; // IntersectionObserver threshold (0–1, default: 0)
    rootMargin?: string; // IntersectionObserver rootMargin (default: '0px')
    height?: CSSProperties['height']; // container height. If omitted, the container grows with its parent (use CSS to size it, e.g. via flex).
    onScrollChange?: (info: ScrollInfo) => void; // emits scroll position info
    endMessage?: ReactNode; // shown when !hasMore and !isLoading
    className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const InfiniteScroll = ({
    children,
    onLoadMore,
    hasMore,
    isLoading = false,
    threshold = 0,
    rootMargin = '0px',
    height,
    onScrollChange,
    endMessage,
    className,
}: InfiniteScrollProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    // ── Scroll info tracker ───────────────────────────────────────────────────
    const handleScroll = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;
        const scrollPercent = scrollHeight <= clientHeight ? 100 : Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);

        const info: ScrollInfo = {
            scrollTop,
            scrollHeight,
            clientHeight,
            scrollPercent,
            isAtTop: scrollTop === 0,
            isAtBottom: scrollTop + clientHeight >= scrollHeight - 1,
        };

        onScrollChange?.(info);
    }, [onScrollChange]);

    // ── IntersectionObserver ──────────────────────────────────────────────────
    useEffect(() => {
        const sentinel = sentinelRef.current;
        const container = containerRef.current;
        if (!sentinel || !container) return;

        // Disconnect previous observer before creating a new one
        observerRef.current?.disconnect();

        observerRef.current = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            {
                root: container,
                rootMargin,
                threshold,
            }
        );

        observerRef.current.observe(sentinel);

        return () => observerRef.current?.disconnect();
    }, [hasMore, isLoading, onLoadMore, rootMargin, threshold]);

    // ── Scroll listener ───────────────────────────────────────────────────────
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener('scroll', handleScroll, { passive: true });
        // Fire once on mount to populate initial state
        handleScroll();
        return () => el.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <div ref={containerRef} className={`infinite-scroll${className ? ` ${className}` : ''}`} style={height !== undefined ? { height } : undefined}>
            {/* ── Content ── */}
            {children}

            {/* ── Sentinel — IntersectionObserver target ── */}
            <div ref={sentinelRef} className="infinite-scroll__sentinel" aria-hidden="true" />

            {/* ── Loader ── */}
            {isLoading && (
                <div className="infinite-scroll__loader" role="status" aria-label="Loading more">
                    <div className="infinite-scroll__spinner" />
                    <span className="infinite-scroll__loader-text">Loading...</span>
                </div>
            )}

            {/* ── End of list message ── */}
            {!hasMore && !isLoading && endMessage && <div className="infinite-scroll__end">{endMessage}</div>}
        </div>
    );
};
