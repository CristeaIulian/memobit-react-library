import { CSSProperties, FC, ReactElement, ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import './Transition.scss';

export type TransitionType = 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'collapse';
export type TransitionStatus = 'unmounted' | 'entering' | 'entered' | 'exiting';
export type TransitionTag = 'div' | 'span' | 'section' | 'li';

export interface TransitionProps {
    /** Play the enter animation on the very first render too. */
    appear?: boolean;
    /** Element rendered around the children. */
    as?: TransitionTag;
    children: ReactNode;
    className?: string;
    /** Delay before the enter animation starts, in milliseconds. */
    delay?: number;
    /** Animation length in milliseconds. Also how long the exit is held before unmounting. */
    duration?: number;
    easing?: string;
    /** Keep the element mounted but hidden instead of removing it once the exit finishes. */
    keepMounted?: boolean;
    onEntered?: () => void;
    onExited?: () => void;
    /** `true` plays the enter animation; `false` plays the exit animation, then unmounts. */
    show: boolean;
    type?: TransitionType;
}

// `collapse` animates a measured pixel height: `auto` is not an animatable value, so the
// open height is taken from the element and only released back to `auto` once it has settled.
type CollapseHeight = number | 'auto';

export const Transition: FC<TransitionProps> = ({
    appear = false,
    as: Tag = 'div',
    children,
    className = '',
    delay = 0,
    duration = 250,
    easing = 'ease',
    keepMounted = false,
    onEntered,
    onExited,
    show,
    type = 'fade',
}: TransitionProps): ReactElement | null => {
    const initialStatus: TransitionStatus = show ? (appear ? 'entering' : 'entered') : 'unmounted';

    const [status, setStatus] = useState<TransitionStatus>(initialStatus);
    const [collapseHeight, setCollapseHeight] = useState<CollapseHeight>('auto');
    const elementRef = useRef<HTMLElement | null>(null);
    // Mirrors `status` so the driving effect can read the current phase without depending on
    // it — depending on it would restart the machine on every step it takes.
    const statusRef = useRef<TransitionStatus>(initialStatus);
    // Callbacks are held in refs so an inline arrow in the parent cannot replay the animation.
    const onEnteredRef = useRef(onEntered);
    const onExitedRef = useRef(onExited);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        onEnteredRef.current = onEntered;
        onExitedRef.current = onExited;
    }, [onEntered, onExited]);

    const applyStatus = useCallback((next: TransitionStatus) => {
        statusRef.current = next;
        setStatus(next);
    }, []);

    const clearPending = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
        }
    }, []);

    // Two frames, not one: the browser has to paint the "from" styles before the class flip,
    // or it jumps straight to the end state with no transition at all.
    const afterTwoFrames = useCallback((action: () => void) => {
        frameRef.current = requestAnimationFrame(() => {
            frameRef.current = requestAnimationFrame(action);
        });
    }, []);

    useEffect(() => clearPending, [clearPending]);

    useEffect(() => {
        clearPending();

        const isCollapse = type === 'collapse';

        if (show) {
            if (statusRef.current === 'entered') return;

            applyStatus('entering');
            if (isCollapse) setCollapseHeight(0);

            afterTwoFrames(() => {
                applyStatus('entered');
                if (isCollapse && elementRef.current) setCollapseHeight(elementRef.current.scrollHeight);
            });

            timerRef.current = setTimeout(() => {
                // Released to `auto` only after the roll-down finished, so the section can
                // then follow content that grows or shrinks later on.
                if (isCollapse) setCollapseHeight('auto');
                onEnteredRef.current?.();
            }, duration + delay);

            return;
        }

        if (statusRef.current === 'unmounted') return;

        if (isCollapse && elementRef.current) {
            setCollapseHeight(elementRef.current.scrollHeight);
            afterTwoFrames(() => setCollapseHeight(0));
        }

        applyStatus('exiting');

        timerRef.current = setTimeout(() => {
            applyStatus('unmounted');
            setCollapseHeight('auto');
            onExitedRef.current?.();
        }, duration);
    }, [afterTwoFrames, applyStatus, clearPending, delay, duration, show, type]);

    const setElement = useCallback((node: HTMLElement | null) => {
        elementRef.current = node;
    }, []);

    if (status === 'unmounted' && !keepMounted) return null;

    const style: CSSProperties = {
        transitionDelay: status === 'entering' || status === 'entered' ? `${delay}ms` : undefined,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: easing,
        ...(type === 'collapse' && collapseHeight !== 'auto' ? { height: collapseHeight } : {}),
    };

    const classes = [
        'transition',
        `transition--${type}`,
        `transition--${status}`,
        keepMounted && status === 'unmounted' ? 'transition--hidden' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <Tag className={classes} ref={setElement} style={style}>
            {children}
        </Tag>
    );
};
