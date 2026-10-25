import { type RefObject, useCallback, useLayoutEffect, useMemo, useRef } from 'react';

import './ListMotion.scss';

/** Set on each element the hook should animate; the value is the item's stable id. */
export const LIST_MOTION_KEY_ATTRIBUTE = 'data-motion-key';

const ROOT_ATTRIBUTE = 'data-motion-root';
const GHOST_CLASS = 'list-motion-ghost';
const FLASH_CLASS = 'list-motion-flash';
const ENTER_SCALE = 'scale(0.97)';
// A highlight asked for before its item renders (a save still waiting on the refetch) is
// kept this long for the item to turn up.
export const HIGHLIGHT_WAIT_MS = 5000;
// Most entering items that also flash. More than this is a batch, not something to point at.
const MAX_FLASHED_ENTRIES = 3;
// Past this many items the per-commit measuring costs more than the motion is worth.
const MAX_TRACKED_ITEMS = 300;

export type ListMotionKey = string | number;

export interface UseListMotionOptions {
    /** Switch the animations off without changing the markup. Default: true. */
    enabled?: boolean;
    /** Flash items that join the list. Default: true. */
    flashEntering?: boolean;
    /** Ids to scroll into view and flash. Passing a new array replays the highlight. */
    highlightKeys?: ReadonlyArray<ListMotionKey>;
    /** Most items that may join or leave in one change and still animate. A bigger change (a filter, a page) just updates. Default: 10. */
    maxMembershipChanges?: number;
    /** Most items that may move in a pure reorder and still animate. A bigger one (a sort) just updates. Default: 40. */
    maxReorderMoves?: number;
}

export interface UseListMotionReturn {
    /** Animate the next change even when it is over the limits, e.g. a group the user opened or closed. */
    forceNext: () => void;
    /** Let the next change through without animating, e.g. a page switch. */
    skipNext: () => void;
}

interface Box {
    height: number;
    left: number;
    top: number;
    width: number;
}

interface ItemSnapshot {
    box: Box;
    element: HTMLElement;
    parent: HTMLElement | null;
}

interface ListSnapshot {
    items: Map<string, ItemSnapshot>;
    order: string[];
}

interface MotionTiming {
    easing: string;
    easingExit: string;
    enter: number;
    exit: number;
    move: number;
}

type NextChangeMode = 'normal' | 'force' | 'skip';

const readMs = (style: CSSStyleDeclaration, name: string, fallback: number): number => {
    const raw = style.getPropertyValue(name).trim();
    const value = parseFloat(raw);

    if (Number.isNaN(value)) return fallback;

    return raw.endsWith('ms') ? value : raw.endsWith('s') ? value * 1000 : value;
};

const readTiming = (container: HTMLElement): MotionTiming => {
    const style = getComputedStyle(container);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
        easing: style.getPropertyValue('--motion-easing').trim() || 'cubic-bezier(0.2, 0, 0, 1)',
        easingExit: style.getPropertyValue('--motion-easing-exit').trim() || 'cubic-bezier(0, 0, 0.2, 1)',
        enter: reduced ? 0 : readMs(style, '--motion-duration-enter', 220),
        exit: reduced ? 0 : readMs(style, '--motion-duration-exit', 180),
        move: reduced ? 0 : readMs(style, '--motion-duration-move', 280),
    };
};

const readFlashDuration = (element: HTMLElement): number => readMs(getComputedStyle(element), '--motion-duration-flash', 1600);

// Items of a list nested inside this one (a DataView in a row detail) belong to that list.
const collectItems = (container: HTMLElement): HTMLElement[] =>
    Array.from(container.querySelectorAll<HTMLElement>(`[${LIST_MOTION_KEY_ATTRIBUTE}]`)).filter(
        element => element.closest(`[${ROOT_ATTRIBUTE}]`) === container && !element.closest(`.${GHOST_CLASS}`)
    );

const keyOf = (element: HTMLElement): string => element.getAttribute(LIST_MOTION_KEY_ATTRIBUTE) ?? '';

// Boxes are kept relative to the container's content, so scrolling the page between two
// changes does not read as every item having moved.
const measure = (container: HTMLElement, elements: HTMLElement[]): ListSnapshot => {
    const containerRect = container.getBoundingClientRect();
    const originTop = containerRect.top - container.scrollTop;
    const originLeft = containerRect.left - container.scrollLeft;
    const items = new Map<string, ItemSnapshot>();
    const order: string[] = [];

    elements.forEach(element => {
        const key = keyOf(element);
        const rect = element.getBoundingClientRect();

        order.push(key);
        items.set(key, {
            box: { height: rect.height, left: rect.left - originLeft, top: rect.top - originTop, width: rect.width },
            element,
            parent: element.parentElement,
        });
    });

    return { items, order };
};

const toViewport = (container: HTMLElement, box: Box): Box => {
    const containerRect = container.getBoundingClientRect();

    return { ...box, left: containerRect.left - container.scrollLeft + box.left, top: containerRect.top - container.scrollTop + box.top };
};

const isOnScreen = (box: Box): boolean => box.top + box.height > 0 && box.top < window.innerHeight;

const sameOrder = (a: string[], b: string[]): boolean => a.length === b.length && a.every((key, index) => key === b[index]);

// A <tr> cannot float on its own, so a removed row is cloned into a one-row table laid over
// the old one, with the header's column widths to keep its cells where they were.
const wrapRowGhost = (row: HTMLTableRowElement, parent: HTMLElement | null): { ghost: HTMLElement; host: HTMLElement } | null => {
    const table = parent?.closest('table');
    const host = table?.parentElement;

    if (!table || !table.isConnected || !host) return null;

    const ghostTable = document.createElement('table');
    const body = document.createElement('tbody');
    const headCells = table.tHead?.rows[0]?.cells;

    ghostTable.className = table.className;
    ghostTable.style.tableLayout = 'fixed';

    if (headCells && headCells.length === row.cells.length) {
        Array.from(row.cells).forEach((cell, index) => {
            // The header widths are measured border to border; the cells' padding sits inside that.
            cell.style.boxSizing = 'border-box';
            cell.style.width = `${headCells[index].getBoundingClientRect().width}px`;
        });
    }

    body.append(row);
    ghostTable.append(body);

    return { ghost: ghostTable, host };
};

/**
 * Animates a keyed list as it changes: items that join fade and grow in, items that leave fade
 * out where they stood, and the rest slide to their new places instead of jumping (FLIP).
 *
 * Put `data-motion-key={id}` on every item element inside the container. Changes larger than
 * the limits (a new filter, another page) are left unanimated, as is the first fill of the list.
 */
export const useListMotion = (containerRef: RefObject<HTMLElement | null>, options: UseListMotionOptions = {}): UseListMotionReturn => {
    const { enabled = true, flashEntering = true, highlightKeys, maxMembershipChanges = 10, maxReorderMoves = 40 } = options;

    const firstRef = useRef<ListSnapshot | null>(null);
    const nextModeRef = useRef<NextChangeMode>('normal');
    const animationsRef = useRef<Set<Animation>>(new Set());
    const ghostsRef = useRef<Set<HTMLElement>>(new Set());
    const flashTimersRef = useRef<Map<HTMLElement, ReturnType<typeof setTimeout>>>(new Map());
    const pendingHighlightRef = useRef<{ keys: Set<string>; until: number } | null>(null);
    // Starts empty, so ids already set when the list mounts count too: a page that swaps the list
    // for a spinner while it refetches remounts it with the highlight already in place.
    const lastHighlightKeysRef = useRef<ReadonlyArray<ListMotionKey> | undefined>(undefined);

    // Measured while rendering, when the DOM still shows the previous commit: these are the
    // "first" positions of the FLIP. Taken from the screen as it is, so a change landing
    // mid-slide carries on from where each item visibly stands.
    const renderedContainer = containerRef.current;
    if (renderedContainer?.hasAttribute(ROOT_ATTRIBUTE)) {
        const elements = collectItems(renderedContainer);
        firstRef.current = elements.length > MAX_TRACKED_ITEMS ? null : measure(renderedContainer, elements);
    }

    const forceNext = useCallback(() => {
        nextModeRef.current = 'force';
    }, []);

    const skipNext = useCallback(() => {
        nextModeRef.current = 'skip';
    }, []);

    const track = useCallback((animation: Animation, onDone?: () => void) => {
        animationsRef.current.add(animation);

        const settle = () => {
            animationsRef.current.delete(animation);
            onDone?.();
        };

        animation.addEventListener('finish', settle);
        animation.addEventListener('cancel', settle);
    }, []);

    // A change landing mid-animation replaces the running slides with its own.
    const stopRunning = useCallback(() => {
        animationsRef.current.forEach(animation => animation.cancel());
        animationsRef.current.clear();
        ghostsRef.current.forEach(ghost => ghost.remove());
        ghostsRef.current.clear();
    }, []);

    const flash = useCallback((element: HTMLElement) => {
        const timers = flashTimersRef.current;
        const running = timers.get(element);

        if (running !== undefined) clearTimeout(running);

        element.classList.remove(FLASH_CLASS);
        // Forces a style flush so re-adding the class restarts the animation.
        void element.offsetWidth;
        element.classList.add(FLASH_CLASS);

        timers.set(
            element,
            setTimeout(() => {
                element.classList.remove(FLASH_CLASS);
                timers.delete(element);
            }, readFlashDuration(element))
        );
    }, []);

    const animateChange = useCallback(
        (container: HTMLElement, previous: ListSnapshot, next: ListSnapshot, force: boolean) => {
            const timing = readTiming(container);

            // An empty list filling up (a load, a cleared filter) has nothing to track yet, so it
            // only fades in, in place of the empty state.
            if (previous.order.length === 0) {
                if (timing.enter === 0) return;
                next.order.forEach(key => {
                    const item = next.items.get(key);
                    if (!item || !isOnScreen(toViewport(container, item.box))) return;
                    track(item.element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: timing.enter, easing: timing.easing }));
                });
                return;
            }

            const entered = next.order.filter(key => !previous.items.has(key));
            const exited = previous.order.filter(key => !next.items.has(key));
            const membershipChanges = entered.length + exited.length;

            if (!force && membershipChanges > maxMembershipChanges) return;

            const moved: Array<{ dx: number; dy: number; item: ItemSnapshot }> = [];

            next.order.forEach(key => {
                const before = previous.items.get(key);
                const after = next.items.get(key);

                if (!before || !after) return;

                const dx = before.box.left - after.box.left;
                const dy = before.box.top - after.box.top;

                if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) moved.push({ dx, dy, item: after });
            });

            if (!force && membershipChanges === 0 && moved.length > maxReorderMoves) return;

            if (timing.move > 0) {
                // Neighbours wait for a leaver's clone to mostly fade before sliding over its spot.
                const moveDelay = exited.length > 0 ? timing.exit / 2 : 0;

                moved.forEach(({ dx, dy, item }) => {
                    const end = toViewport(container, item.box);
                    const start = { ...end, left: end.left + dx, top: end.top + dy };

                    // Off-screen both before and after: nobody would see it travel.
                    if (!isOnScreen(start) && !isOnScreen(end)) return;

                    track(
                        item.element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], {
                            delay: moveDelay,
                            duration: timing.move,
                            easing: timing.easing,
                            fill: 'backwards',
                        })
                    );
                });
            }

            if (timing.exit > 0) {
                const exitedItems = exited.map(key => previous.items.get(key)).filter((item): item is ItemSnapshot => item !== undefined);

                exitedItems.forEach(item => {
                    // A removed group takes its rows with it; one clone of the group covers both.
                    if (exitedItems.some(other => other !== item && other.element.contains(item.element))) return;
                    if (item.element.isConnected) return;

                    const box = toViewport(container, item.box);

                    if (!isOnScreen(box)) return;

                    const clone = item.element.cloneNode(true);

                    if (!(clone instanceof HTMLElement)) return;

                    clone.removeAttribute(LIST_MOTION_KEY_ATTRIBUTE);
                    clone.classList.remove(FLASH_CLASS);

                    const wrapped =
                        clone instanceof HTMLTableRowElement
                            ? wrapRowGhost(clone, item.parent)
                            : { ghost: clone, host: item.parent?.isConnected ? item.parent : container };

                    if (!wrapped) return;

                    const { ghost, host } = wrapped;

                    ghost.classList.add(GHOST_CLASS);
                    Object.assign(ghost.style, {
                        boxSizing: 'border-box',
                        height: `${box.height}px`,
                        left: '0px',
                        margin: '0px',
                        position: 'absolute',
                        top: '0px',
                        width: `${box.width}px`,
                    });
                    host.append(ghost);

                    // Placed by where (0, 0) actually landed, which sidesteps borders, scroll
                    // offsets and whichever ancestor turned out to be the positioning one.
                    const origin = ghost.getBoundingClientRect();

                    ghost.style.left = `${box.left - origin.left}px`;
                    ghost.style.top = `${box.top - origin.top}px`;
                    ghostsRef.current.add(ghost);

                    const removeGhost = () => {
                        ghost.remove();
                        ghostsRef.current.delete(ghost);
                    };

                    // Animation events wait for a rendered frame; a background tab may not get
                    // one for a while, and a stray clone must not outlive its fade.
                    setTimeout(removeGhost, timing.exit + 100);
                    track(
                        ghost.animate(
                            [
                                { opacity: 1, transform: 'none' },
                                { opacity: 0, transform: ENTER_SCALE },
                            ],
                            { duration: timing.exit, easing: timing.easingExit, fill: 'forwards' }
                        ),
                        removeGhost
                    );
                });
            }

            entered.forEach(key => {
                const item = next.items.get(key);

                if (!item || !isOnScreen(toViewport(container, item.box))) return;

                if (timing.enter > 0) {
                    track(
                        item.element.animate(
                            [
                                { opacity: 0, transform: ENTER_SCALE },
                                { opacity: 1, transform: 'none' },
                            ],
                            // Waits for the leavers to clear when an item replaces another.
                            { delay: exited.length > 0 ? timing.exit / 2 : 0, duration: timing.enter, easing: timing.easing, fill: 'backwards' }
                        )
                    );
                }

                if (flashEntering && entered.length <= MAX_FLASHED_ENTRIES) flash(item.element);
            });
        },
        [flash, flashEntering, maxMembershipChanges, maxReorderMoves, track]
    );

    const revealHighlights = useCallback(
        (snapshot: ListSnapshot) => {
            const pending = pendingHighlightRef.current;

            if (!pending) return;

            if (Date.now() > pending.until) {
                pendingHighlightRef.current = null;
                return;
            }

            const found = [...pending.keys].map(key => snapshot.items.get(key)).filter((item): item is ItemSnapshot => item !== undefined);

            if (found.length === 0) return;

            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            // Scrolls before any slide starts, so the target is the item's settled position.
            found[0].element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
            found.forEach(item => {
                flash(item.element);
                pending.keys.delete(keyOf(item.element));
            });

            if (pending.keys.size === 0) pendingHighlightRef.current = null;
        },
        [flash]
    );

    // Declared before the main effect so a highlight asked for in this render is seen by it.
    useLayoutEffect(() => {
        if (highlightKeys === lastHighlightKeysRef.current) return;

        lastHighlightKeysRef.current = highlightKeys;

        if (highlightKeys && highlightKeys.length > 0) {
            pendingHighlightRef.current = { keys: new Set(highlightKeys.map(String)), until: Date.now() + HIGHLIGHT_WAIT_MS };
        }
    }, [highlightKeys]);

    // Runs after every commit: the list's order is read from the DOM, so there is nothing
    // narrower to depend on.
    useLayoutEffect(() => {
        const container = containerRef.current;
        const previous = firstRef.current;

        firstRef.current = null;

        if (!container) return;

        container.setAttribute(ROOT_ATTRIBUTE, '');

        const elements = collectItems(container);

        if (elements.length > MAX_TRACKED_ITEMS) {
            stopRunning();
            return;
        }

        if (previous && sameOrder(previous.order, elements.map(keyOf))) {
            if (pendingHighlightRef.current) revealHighlights(measure(container, elements));
            return;
        }

        stopRunning();

        const next = measure(container, elements);
        const mode = nextModeRef.current;

        nextModeRef.current = 'normal';
        revealHighlights(next);

        if (previous && enabled && mode !== 'skip') animateChange(container, previous, next, mode === 'force');
    });

    useLayoutEffect(
        () => () => {
            stopRunning();
            flashTimersRef.current.forEach(timer => clearTimeout(timer));
            flashTimersRef.current.clear();
        },
        [stopRunning]
    );

    return useMemo(() => ({ forceNext, skipNext }), [forceNext, skipNext]);
};
