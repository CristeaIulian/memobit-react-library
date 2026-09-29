import {
    CSSProperties,
    FC,
    Fragment,
    KeyboardEvent,
    PointerEvent as ReactPointerEvent,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import './Splitter.scss';

export type SplitterOrientation = 'horizontal' | 'vertical';

export interface SplitterPane {
    content: ReactNode;
    /** Stable identity for the pane — also used as the React key. */
    id: string;
    /** Smallest share this pane may be dragged to, in percent. Defaults to 10. */
    minSize?: number;
    /** Starting share of the container, in percent. Omitted panes split what is left evenly. */
    size?: number;
}

export interface SplitterProps {
    className?: string;
    /** Dragging a pane below half its minimum snaps it shut instead of stopping at the minimum. */
    collapsible?: boolean;
    /** Thickness of the drag handles in pixels. */
    gutterSize?: number;
    /** Percent moved per arrow key press on a focused gutter. */
    keyboardStep?: number;
    /** Fired with the full list of pane sizes (percent) whenever a drag or key press settles. */
    onResize?: (sizes: number[]) => void;
    /** `horizontal` lays the panes out side by side; `vertical` stacks them. */
    orientation?: SplitterOrientation;
    panes: SplitterPane[];
    /** Double-clicking a gutter restores the sizes the Splitter started with. */
    resetOnDoubleClick?: boolean;
}

interface DragState {
    index: number;
    startA: number;
    startB: number;
    startPosition: number;
}

interface SplitterCustomProperties extends CSSProperties {
    '--_splitter-gutter': string;
}

const DEFAULT_MIN_SIZE = 10;

// Turns the (partly optional) `size` props into a complete percentage list adding up to 100:
// explicit sizes are honoured first, whatever is left over is shared by the rest. When every
// pane is explicit the values are normalised, so callers may pass ratios (2/1/1) instead.
const resolveInitialSizes = (panes: SplitterPane[]): number[] => {
    const explicitTotal = panes.reduce((total, pane) => total + (pane.size ?? 0), 0);
    const autoCount = panes.filter(pane => pane.size === undefined).length;

    if (autoCount === 0) {
        return explicitTotal === 0 ? panes.map(() => 100 / panes.length) : panes.map(pane => ((pane.size ?? 0) / explicitTotal) * 100);
    }

    const autoShare = Math.max(0, 100 - explicitTotal) / autoCount;

    return panes.map(pane => pane.size ?? autoShare);
};

export const Splitter: FC<SplitterProps> = ({
    className = '',
    collapsible = false,
    gutterSize = 6,
    keyboardStep = 2,
    onResize,
    orientation = 'horizontal',
    panes,
    resetOnDoubleClick = true,
}: SplitterProps): ReactElement => {
    const initialSizes = useMemo(() => resolveInitialSizes(panes), [panes]);
    const [sizes, setSizes] = useState<number[]>(initialSizes);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragState | null>(null);

    // Adding or removing a pane invalidates the stored distribution; a plain resize of the
    // same panes must keep whatever the user dragged.
    useEffect(() => {
        setSizes(current => (current.length === initialSizes.length ? current : initialSizes));
    }, [initialSizes]);

    const getMinSize = useCallback((index: number): number => panes[index]?.minSize ?? DEFAULT_MIN_SIZE, [panes]);

    // Moves the boundary between pane `index` and `index + 1` by `deltaPercent`, keeping the
    // pair's combined size constant so the rest of the layout never shifts.
    const resolvePair = useCallback(
        (index: number, startA: number, startB: number, deltaPercent: number): [number, number] => {
            const minA = getMinSize(index);
            const minB = getMinSize(index + 1);
            const pairTotal = startA + startB;

            let nextA = startA + deltaPercent;

            // Past halfway into the minimum reads as "get rid of it" rather than "stop here",
            // which is the only way to reach zero without a separate collapse control.
            if (nextA < minA) {
                nextA = collapsible && nextA < minA / 2 ? 0 : minA;
            }

            if (pairTotal - nextA < minB) {
                nextA = collapsible && pairTotal - nextA < minB / 2 ? pairTotal : pairTotal - minB;
            }

            return [nextA, pairTotal - nextA];
        },
        [collapsible, getMinSize]
    );

    const commitPair = useCallback((index: number, [nextA, nextB]: [number, number]): number[] => {
        const committed = sizes.map((size, i) => (i === index ? nextA : i === index + 1 ? nextB : size));
        setSizes(committed);

        return committed;
    }, [sizes]);

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>, index: number) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);

            dragRef.current = {
                index,
                startA: sizes[index],
                startB: sizes[index + 1],
                startPosition: orientation === 'horizontal' ? event.clientX : event.clientY,
            };
        },
        [orientation, sizes]
    );

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const drag = dragRef.current;
            const container = containerRef.current;
            if (!drag || !container) return;

            const rect = container.getBoundingClientRect();
            const axisLength = orientation === 'horizontal' ? rect.width : rect.height;
            if (axisLength === 0) return;

            const position = orientation === 'horizontal' ? event.clientX : event.clientY;
            const deltaPercent = ((position - drag.startPosition) / axisLength) * 100;

            commitPair(drag.index, resolvePair(drag.index, drag.startA, drag.startB, deltaPercent));
        },
        [commitPair, orientation, resolvePair]
    );

    const handlePointerUp = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (!dragRef.current) return;

            event.currentTarget.releasePointerCapture(event.pointerId);
            dragRef.current = null;
            onResize?.(sizes);
        },
        [onResize, sizes]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLDivElement>, index: number) => {
            const decreaseKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
            const increaseKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';

            if (event.key !== decreaseKey && event.key !== increaseKey) return;

            event.preventDefault();

            const direction = event.key === increaseKey ? 1 : -1;
            onResize?.(commitPair(index, resolvePair(index, sizes[index], sizes[index + 1], direction * keyboardStep)));
        },
        [commitPair, keyboardStep, onResize, orientation, resolvePair, sizes]
    );

    const handleDoubleClick = useCallback(() => {
        if (!resetOnDoubleClick) return;

        setSizes(initialSizes);
        onResize?.(initialSizes);
    }, [initialSizes, onResize, resetOnDoubleClick]);

    const containerStyle: SplitterCustomProperties = { '--_splitter-gutter': `${gutterSize}px` };
    const classes = ['splitter', `splitter--${orientation}`, className].filter(Boolean).join(' ');

    return (
        <div className={classes} ref={containerRef} style={containerStyle}>
            {panes.map((pane, index) => (
                <Fragment key={pane.id}>
                    <div className={`splitter__pane${sizes[index] === 0 ? ' splitter__pane--collapsed' : ''}`} style={{ flexBasis: `${sizes[index]}%` }}>
                        {pane.content}
                    </div>

                    {index < panes.length - 1 && (
                        <div
                            className="splitter__gutter"
                            onDoubleClick={handleDoubleClick}
                            onKeyDown={event => handleKeyDown(event, index)}
                            onPointerDown={event => handlePointerDown(event, index)}
                            onPointerMove={handlePointerMove}
                            onPointerUp={handlePointerUp}
                            tabIndex={0}
                            title={resetOnDoubleClick ? 'Drag to resize — double-click to reset' : 'Drag to resize'}
                        >
                            <span className="splitter__gutter-grip" />
                        </div>
                    )}
                </Fragment>
            ))}
        </div>
    );
};
