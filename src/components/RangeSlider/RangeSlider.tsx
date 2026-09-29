import { FC, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactElement, useCallback, useMemo, useRef } from 'react';

import './RangeSlider.scss';

export type RangeSliderVariant = 'accent' | 'info' | 'success' | 'warning' | 'danger';
export type RangeSliderValue = [number, number];

type Thumb = 'lower' | 'upper';

export interface RangeSliderProps {
    disabled?: boolean;
    /** Renders each readout and tick label — money, units, dates, whatever the range means. */
    formatValue?: (value: number) => string;
    label?: string;
    max?: number;
    min?: number;
    /** Smallest gap the two thumbs may be pushed to. Defaults to one `step`. */
    minDistance?: number;
    onChange: (value: RangeSliderValue) => void;
    /** Fired once when a drag or key press settles — the place to kick off a query. */
    onChangeEnd?: (value: RangeSliderValue) => void;
    showValues?: boolean;
    step?: number;
    /** Renders a thinner track and smaller thumbs. */
    thin?: boolean;
    /** Draws a labelled tick every N units. `0` turns the ticks off. */
    tickStep?: number;
    value: RangeSliderValue;
    variant?: RangeSliderVariant;
}

// Derive decimal places from the step so fractional steps display without float artefacts.
const getDecimalPlaces = (step: number): number => {
    if (!Number.isFinite(step) || step >= 1) return 0;

    return String(step).split('.')[1]?.length ?? 0;
};

export const RangeSlider: FC<RangeSliderProps> = ({
    disabled = false,
    formatValue,
    label,
    max = 100,
    min = 0,
    minDistance,
    onChange,
    onChangeEnd,
    showValues = true,
    step = 1,
    thin = false,
    tickStep = 0,
    value,
    variant = 'accent',
}: RangeSliderProps): ReactElement => {
    const trackRef = useRef<HTMLDivElement>(null);
    const activeThumb = useRef<Thumb | null>(null);

    const span = Math.max(1, max - min);
    const gap = minDistance ?? step;
    const decimals = getDecimalPlaces(step);

    const [lower, upper] = value;

    const display = useCallback(
        (raw: number): string => (formatValue ? formatValue(raw) : decimals > 0 ? raw.toFixed(decimals) : String(raw)),
        [decimals, formatValue]
    );

    const snap = useCallback(
        (raw: number): number => {
            const stepped = step > 0 ? min + Math.round((raw - min) / step) * step : raw;
            const clamped = Math.min(max, Math.max(min, stepped));

            // Re-round after clamping so a step that does not divide the span evenly still
            // lands on a clean value rather than a long float.
            return decimals > 0 ? Number(clamped.toFixed(decimals)) : clamped;
        },
        [decimals, max, min, step]
    );

    // Neither thumb may cross the other; each stops `gap` short of it.
    const applyThumb = useCallback(
        (thumb: Thumb, raw: number): RangeSliderValue => {
            const snapped = snap(raw);

            return thumb === 'lower' ? [Math.min(snapped, upper - gap), upper] : [lower, Math.max(snapped, lower + gap)];
        },
        [gap, lower, snap, upper]
    );

    const valueFromPointer = useCallback(
        (clientX: number): number | null => {
            const track = trackRef.current;
            if (!track) return null;

            const rect = track.getBoundingClientRect();
            if (rect.width === 0) return null;

            const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));

            return min + ratio * span;
        },
        [min, span]
    );

    const handleThumbPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLButtonElement>, thumb: Thumb) => {
            if (disabled) return;

            event.preventDefault();
            // Without this the track's own handler also sees the press and snaps the nearest
            // thumb to the cursor before the drag begins.
            event.stopPropagation();
            event.currentTarget.setPointerCapture(event.pointerId);
            activeThumb.current = thumb;
        },
        [disabled]
    );

    const handleThumbPointerMove = useCallback(
        (event: ReactPointerEvent<HTMLButtonElement>) => {
            const thumb = activeThumb.current;
            if (!thumb || disabled) return;

            const raw = valueFromPointer(event.clientX);
            if (raw === null) return;

            onChange(applyThumb(thumb, raw));
        },
        [applyThumb, disabled, onChange, valueFromPointer]
    );

    const handleThumbPointerUp = useCallback(
        (event: ReactPointerEvent<HTMLButtonElement>) => {
            if (!activeThumb.current) return;

            event.currentTarget.releasePointerCapture(event.pointerId);
            activeThumb.current = null;
            onChangeEnd?.(value);
        },
        [onChangeEnd, value]
    );

    // Clicking the bare track jumps whichever thumb is closer, so a wide range can be
    // narrowed without dragging all the way.
    const handleTrackPointerDown = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            if (disabled) return;

            const raw = valueFromPointer(event.clientX);
            if (raw === null) return;

            const thumb: Thumb = Math.abs(raw - lower) <= Math.abs(raw - upper) ? 'lower' : 'upper';
            const next = applyThumb(thumb, raw);

            onChange(next);
            onChangeEnd?.(next);
        },
        [applyThumb, disabled, lower, onChange, onChangeEnd, upper, valueFromPointer]
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<HTMLButtonElement>, thumb: Thumb) => {
            if (disabled) return;

            const current = thumb === 'lower' ? lower : upper;
            const amount = step > 0 ? step : 1;

            const target =
                event.key === 'ArrowLeft' || event.key === 'ArrowDown'
                    ? current - amount
                    : event.key === 'ArrowRight' || event.key === 'ArrowUp'
                      ? current + amount
                      : event.key === 'PageDown'
                        ? current - amount * 10
                        : event.key === 'PageUp'
                          ? current + amount * 10
                          : event.key === 'Home'
                            ? min
                            : event.key === 'End'
                              ? max
                              : null;

            if (target === null) return;

            event.preventDefault();
            const next = applyThumb(thumb, target);
            onChange(next);
            onChangeEnd?.(next);
        },
        [applyThumb, disabled, lower, max, min, onChange, onChangeEnd, step, upper]
    );

    const ticks = useMemo(() => {
        if (!tickStep || tickStep <= 0) return [];

        const marks: number[] = [];
        for (let mark = min; mark <= max; mark += tickStep) {
            marks.push(snap(mark));
        }

        return marks;
    }, [max, min, snap, tickStep]);

    const toPercent = (raw: number): number => ((Math.min(max, Math.max(min, raw)) - min) / span) * 100;
    const lowerPercent = toPercent(lower);
    const upperPercent = toPercent(upper);

    const classes = [
        'range-slider',
        `range-slider--${variant}`,
        thin ? 'range-slider--thin' : '',
        disabled ? 'range-slider--disabled' : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {(label || showValues) && (
                <div className="range-slider__header">
                    {label && <span className="range-slider__label">{label}</span>}
                    {showValues && (
                        <span className="range-slider__readout">
                            {display(lower)} – {display(upper)}
                        </span>
                    )}
                </div>
            )}

            <div className="range-slider__track" onPointerDown={handleTrackPointerDown} ref={trackRef}>
                <div className="range-slider__selection" style={{ left: `${lowerPercent}%`, width: `${upperPercent - lowerPercent}%` }} />

                <button
                    className="range-slider__thumb range-slider__thumb--lower"
                    disabled={disabled}
                    onKeyDown={event => handleKeyDown(event, 'lower')}
                    onPointerDown={event => handleThumbPointerDown(event, 'lower')}
                    onPointerMove={handleThumbPointerMove}
                    onPointerUp={handleThumbPointerUp}
                    style={{ left: `${lowerPercent}%` }}
                    title={display(lower)}
                    type="button"
                />

                <button
                    className="range-slider__thumb range-slider__thumb--upper"
                    disabled={disabled}
                    onKeyDown={event => handleKeyDown(event, 'upper')}
                    onPointerDown={event => handleThumbPointerDown(event, 'upper')}
                    onPointerMove={handleThumbPointerMove}
                    onPointerUp={handleThumbPointerUp}
                    style={{ left: `${upperPercent}%` }}
                    title={display(upper)}
                    type="button"
                />
            </div>

            {ticks.length > 0 && (
                <div className="range-slider__ticks">
                    {ticks.map(mark => (
                        <span className="range-slider__tick" key={mark} style={{ left: `${toPercent(mark)}%` }}>
                            <span className="range-slider__tick-mark" />
                            <span className="range-slider__tick-label">{display(mark)}</span>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
