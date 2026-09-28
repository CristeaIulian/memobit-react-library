import { TouchEvent, useCallback, useRef } from 'react';

export interface UseSwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    /** Distance along the swipe axis, in px, before it counts as one. */
    threshold?: number;
    /**
     * Allowed drift across the swipe axis, in px. This is what keeps a vertical scroll
     * inside a calendar grid from registering as a horizontal page turn, so it matters
     * most when the swiped element scrolls the other way.
     */
    restraint?: number;
    /** A drag slower than this is someone reading, not swiping. */
    maxDurationMs?: number;
    /** Set false to detach without changing where the hook is called. */
    enabled?: boolean;
}

export interface SwipeHandlers {
    onTouchStart: (event: TouchEvent) => void;
    onTouchEnd: (event: TouchEvent) => void;
    onTouchCancel: () => void;
}

interface TouchOrigin {
    x: number;
    y: number;
    time: number;
}

/**
 * Turns a touch drag into a direction.
 *
 * Touch only, deliberately: a mouse drag on the same element usually already means
 * something (selecting text, dragging an item), and a phone is where a swipe is the
 * natural gesture. Nothing is ever `preventDefault`ed, so the element keeps scrolling
 * normally and a swipe that fails the threshold costs the user nothing.
 *
 * Spread the returned handlers onto the element that should respond:
 *
 *     const swipe = useSwipe({ onSwipeLeft: next, onSwipeRight: previous });
 *     return <div {...swipe}>…</div>;
 */
export const useSwipe = ({
    enabled = true,
    maxDurationMs = 800,
    onSwipeDown,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    restraint = 80,
    threshold = 60,
}: UseSwipeOptions): SwipeHandlers => {
    const origin = useRef<TouchOrigin | null>(null);

    const handleTouchStart = useCallback(
        (event: TouchEvent) => {
            // A second finger means a pinch or a two-finger scroll, neither of which is this.
            if (!enabled || event.touches.length !== 1) {
                origin.current = null;
                return;
            }

            const touch = event.touches[0];
            origin.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
        },
        [enabled]
    );

    const handleTouchEnd = useCallback(
        (event: TouchEvent) => {
            const start = origin.current;
            origin.current = null;

            if (!enabled || !start || event.changedTouches.length !== 1) {
                return;
            }

            const touch = event.changedTouches[0];
            const deltaX = touch.clientX - start.x;
            const deltaY = touch.clientY - start.y;

            if (Date.now() - start.time > maxDurationMs) {
                return;
            }

            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);

            if (absX >= threshold && absY <= restraint) {
                if (deltaX < 0) {
                    onSwipeLeft?.();
                } else {
                    onSwipeRight?.();
                }
                return;
            }

            if (absY >= threshold && absX <= restraint) {
                if (deltaY < 0) {
                    onSwipeUp?.();
                } else {
                    onSwipeDown?.();
                }
            }
        },
        [enabled, maxDurationMs, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp, restraint, threshold]
    );

    const handleTouchCancel = useCallback(() => {
        origin.current = null;
    }, []);

    return {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchCancel,
    };
};
