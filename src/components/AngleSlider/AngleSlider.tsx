import { CSSProperties, FC, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactElement, useCallback, useMemo, useRef } from 'react';

import './AngleSlider.scss';

export type AngleSliderVariant = 'accent' | 'info' | 'success' | 'warning' | 'danger';

export interface AngleSliderProps {
    disabled?: boolean;
    /** Text under the dial. Replaced by the degree readout when `showValue` is on. */
    label?: string;
    /** Highest angle the dial accepts, in degrees. Defaults to a full turn. */
    max?: number;
    /** Lowest angle the dial accepts, in degrees. */
    min?: number;
    onChange: (value: number) => void;
    /** Diameter in pixels. */
    size?: number;
    /** Rounding applied to every change, in degrees. */
    step?: number;
    /** Draws a tick every N degrees. `0` turns the ticks off. */
    tickStep?: number;
    /** Degrees moved per arrow key press. Defaults to `step`. */
    keyboardStep?: number;
    showValue?: boolean;
    value: number;
    variant?: AngleSliderVariant;
}

const RADIUS = 42;
const CENTER = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const DEGREES_IN_TURN = 360;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// 0° sits at twelve o'clock and grows clockwise, which is how people read a dial.
const pointOnDial = (degrees: number, radius: number): { x: number; y: number } => ({
    x: CENTER + radius * Math.sin(toRadians(degrees)),
    y: CENTER - radius * Math.cos(toRadians(degrees)),
});

interface AngleSliderCustomProperties extends CSSProperties {
    '--_angle-size': string;
}

export const AngleSlider: FC<AngleSliderProps> = ({
    disabled = false,
    label,
    max = DEGREES_IN_TURN,
    min = 0,
    onChange,
    size = 120,
    step = 1,
    tickStep = 45,
    keyboardStep,
    showValue = true,
    value,
    variant = 'accent',
}: AngleSliderProps): ReactElement => {
    const dialRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    const span = Math.max(1, max - min);

    const clampAndSnap = useCallback(
        (degrees: number): number => {
            const snapped = step > 0 ? Math.round(degrees / step) * step : degrees;

            return Math.min(max, Math.max(min, snapped));
        },
        [max, min, step]
    );

    // Reads the angle straight off the pointer position rather than accumulating deltas, so
    // the handle never drifts away from the cursor over a long drag.
    const angleFromPointer = useCallback((clientX: number, clientY: number): number | null => {
        const dial = dialRef.current;
        if (!dial) return null;

        const rect = dial.getBoundingClientRect();
        const dx = clientX - (rect.left + rect.width / 2);
        const dy = clientY - (rect.top + rect.height / 2);

        if (dx === 0 && dy === 0) return null;

        const degrees = (Math.atan2(dx, -dy) * 180) / Math.PI;

        return (degrees + DEGREES_IN_TURN) % DEGREES_IN_TURN;
    }, []);

    const updateFromPointer = useCallback(
        (clientX: number, clientY: number) => {
            const degrees = angleFromPointer(clientX, clientY);
            if (degrees === null) return;

            onChange(clampAndSnap(degrees));
        },
        [angleFromPointer, clampAndSnap, onChange]
    );

    const handlePointerDown = useCallback(
        (event: ReactPointerEvent<SVGSVGElement>) => {
            if (disabled) return;

            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            isDragging.current = true;
            updateFromPointer(event.clientX, event.clientY);
        },
        [disabled, updateFromPointer]
    );

    const handlePointerMove = useCallback(
        (event: ReactPointerEvent<SVGSVGElement>) => {
            if (!isDragging.current || disabled) return;

            updateFromPointer(event.clientX, event.clientY);
        },
        [disabled, updateFromPointer]
    );

    const handlePointerUp = useCallback((event: ReactPointerEvent<SVGSVGElement>) => {
        if (!isDragging.current) return;

        event.currentTarget.releasePointerCapture(event.pointerId);
        isDragging.current = false;
    }, []);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent<SVGSVGElement>) => {
            if (disabled) return;

            const amount = keyboardStep ?? (step > 0 ? step : 1);
            const jump = event.key === 'PageUp' ? amount * 10 : event.key === 'PageDown' ? -amount * 10 : 0;
            const nudge = event.key === 'ArrowRight' || event.key === 'ArrowUp' ? amount : event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -amount : 0;

            if (event.key === 'Home') {
                event.preventDefault();
                onChange(min);
                return;
            }

            if (event.key === 'End') {
                event.preventDefault();
                onChange(max);
                return;
            }

            if (jump === 0 && nudge === 0) return;

            event.preventDefault();
            onChange(clampAndSnap(value + jump + nudge));
        },
        [clampAndSnap, disabled, keyboardStep, max, min, onChange, step, value]
    );

    const ticks = useMemo(() => {
        if (!tickStep || tickStep <= 0) return [];

        const marks: number[] = [];
        for (let degrees = min; degrees < min + span; degrees += tickStep) {
            marks.push(degrees);
        }

        return marks;
    }, [min, span, tickStep]);

    const progress = (Math.min(max, Math.max(min, value)) - min) / span;
    const handlePoint = pointOnDial(value, RADIUS);

    const classes = ['angle-slider', `angle-slider--${variant}`, disabled ? 'angle-slider--disabled' : ''].filter(Boolean).join(' ');
    const wrapperStyle: AngleSliderCustomProperties = { '--_angle-size': `${size}px` };

    return (
        <div className={classes} style={wrapperStyle}>
            <svg
                className="angle-slider__dial"
                onKeyDown={handleKeyDown}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                ref={dialRef}
                tabIndex={disabled ? -1 : 0}
                viewBox="0 0 100 100"
            >
                <circle className="angle-slider__track" cx={CENTER} cy={CENTER} r={RADIUS} />

                {ticks.map(degrees => {
                    const outer = pointOnDial(degrees, RADIUS);
                    const inner = pointOnDial(degrees, RADIUS - 6);

                    return <line className="angle-slider__tick" key={degrees} x1={inner.x} x2={outer.x} y1={inner.y} y2={outer.y} />;
                })}

                <circle
                    className="angle-slider__progress"
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    strokeDasharray={`${CIRCUMFERENCE * progress} ${CIRCUMFERENCE}`}
                    // Starts the arc at twelve o'clock instead of three.
                    transform={`rotate(-90 ${CENTER} ${CENTER})`}
                />

                <line className="angle-slider__pointer" x1={CENTER} x2={handlePoint.x} y1={CENTER} y2={handlePoint.y} />
                <circle className="angle-slider__handle" cx={handlePoint.x} cy={handlePoint.y} r={7} />
            </svg>

            {showValue && <span className="angle-slider__value">{Math.round(value)}°</span>}
            {label && <span className="angle-slider__label">{label}</span>}
        </div>
    );
};
