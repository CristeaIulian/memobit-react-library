import React, { useMemo, useRef, useState } from 'react';

import './AnalogClock.scss';

export type AnalogClockMode = 'hours' | 'minutes' | 'seconds';

export interface TimeValue {
    hours: number;
    minutes: number;
    seconds: number;
}

export interface AnalogClockProps {
    value: TimeValue;
    onChange: (value: TimeValue) => void;
    format?: '12h' | '24h';
    withSeconds?: boolean;
    minuteStep?: number;
    secondStep?: number;
    size?: number;
    disabled?: boolean;
    showHeader?: boolean;
    autoAdvance?: boolean;
    mode?: AnalogClockMode;
    onModeChange?: (mode: AnalogClockMode) => void;
    className?: string;
}

interface DialNumber {
    degrees: number;
    inner: boolean;
    label: string;
    selected: boolean;
    value: number;
}

const pad = (value: number): string => value.toString().padStart(2, '0');

const toPoint = (center: number, radius: number, degrees: number): { x: number; y: number } => {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
};

/** In 24h mode the second half of the day sits on the inner ring, with 00 at the top. */
const isInnerHour = (hours: number): boolean => hours === 0 || hours > 12;

export const AnalogClock: React.FC<AnalogClockProps> = ({
    value,
    onChange,
    format = '24h',
    withSeconds = false,
    minuteStep = 1,
    secondStep = 1,
    size = 232,
    disabled = false,
    showHeader = true,
    autoAdvance = true,
    mode,
    onModeChange,
    className = '',
}: AnalogClockProps) => {
    const [internalMode, setInternalMode] = useState<AnalogClockMode>('hours');
    const svgRef = useRef<SVGSVGElement>(null);
    const isDragging = useRef(false);

    const activeMode = mode ?? internalMode;
    const isPM = value.hours >= 12;

    const geometry = useMemo(() => {
        const center = size / 2;
        const knobRadius = size * 0.078;
        const outerRadius = center - knobRadius - size * 0.018;
        const innerRadius = outerRadius - knobRadius * 1.85;
        return { center, knobRadius, outerRadius, innerRadius, ringThreshold: (outerRadius + innerRadius) / 2 };
    }, [size]);

    const changeMode = (next: AnalogClockMode) => {
        if (mode === undefined) {
            setInternalMode(next);
        }
        onModeChange?.(next);
    };

    const advanceMode = () => {
        if (!autoAdvance) return;

        if (activeMode === 'hours') {
            changeMode('minutes');
            return;
        }

        if (activeMode === 'minutes' && withSeconds) {
            changeMode('seconds');
        }
    };

    const dialNumbers = useMemo<DialNumber[]>(() => {
        if (activeMode === 'hours') {
            if (format === '12h') {
                return Array.from({ length: 12 }, (_, index) => {
                    const hour12 = index + 1;
                    return {
                        degrees: hour12 * 30,
                        inner: false,
                        label: `${hour12}`,
                        selected: (value.hours % 12 || 12) === hour12,
                        value: hour12,
                    };
                });
            }

            const outerHours = Array.from({ length: 12 }, (_, index) => {
                const hours = index + 1;
                return {
                    degrees: hours * 30,
                    inner: false,
                    label: `${hours}`,
                    selected: value.hours === hours,
                    value: hours,
                };
            });

            const innerHours = Array.from({ length: 12 }, (_, index) => {
                const hours = index === 0 ? 0 : index + 12;
                return {
                    degrees: index * 30,
                    inner: true,
                    label: pad(hours),
                    selected: value.hours === hours,
                    value: hours,
                };
            });

            return [...outerHours, ...innerHours];
        }

        const current = activeMode === 'minutes' ? value.minutes : value.seconds;

        return Array.from({ length: 12 }, (_, index) => {
            const unit = index * 5;
            return {
                degrees: unit * 6,
                inner: false,
                label: pad(unit),
                selected: current === unit,
                value: unit,
            };
        });
    }, [activeMode, format, value.hours, value.minutes, value.seconds]);

    const hand = useMemo(() => {
        if (activeMode === 'hours') {
            return {
                degrees: (value.hours % 12) * 30,
                radius: format === '24h' && isInnerHour(value.hours) ? geometry.innerRadius : geometry.outerRadius,
            };
        }

        const unit = activeMode === 'minutes' ? value.minutes : value.seconds;
        return { degrees: unit * 6, radius: geometry.outerRadius };
    }, [activeMode, format, geometry.innerRadius, geometry.outerRadius, value.hours, value.minutes, value.seconds]);

    const handPoint = toPoint(geometry.center, hand.radius, hand.degrees);

    const valueFromPointer = (clientX: number, clientY: number): TimeValue | undefined => {
        const rect = svgRef.current?.getBoundingClientRect();
        if (!rect || rect.width === 0) return undefined;

        const scale = size / rect.width;
        const x = (clientX - rect.left) * scale - geometry.center;
        const y = (clientY - rect.top) * scale - geometry.center;
        const distance = Math.sqrt(x * x + y * y);

        let degrees = (Math.atan2(x, -y) * 180) / Math.PI;
        if (degrees < 0) {
            degrees += 360;
        }

        if (activeMode === 'hours') {
            const index = Math.round(degrees / 30) % 12;

            if (format === '12h') {
                const hour12 = index === 0 ? 12 : index;
                return { ...value, hours: isPM ? (hour12 % 12) + 12 : hour12 % 12 };
            }

            const onInnerRing = distance < geometry.ringThreshold;
            const hours = onInnerRing ? (index === 0 ? 0 : index + 12) : index === 0 ? 12 : index;
            return { ...value, hours };
        }

        const step = activeMode === 'minutes' ? minuteStep : secondStep;
        const unit = (Math.round(Math.round(degrees / 6) / step) * step) % 60;

        return activeMode === 'minutes' ? { ...value, minutes: unit } : { ...value, seconds: unit };
    };

    const applyPointer = (event: React.PointerEvent<SVGSVGElement>) => {
        const next = valueFromPointer(event.clientX, event.clientY);
        if (next) {
            onChange(next);
        }
    };

    const handlePointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
        if (disabled) return;

        isDragging.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
        applyPointer(event);
    };

    const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
        if (disabled || !isDragging.current) return;

        applyPointer(event);
    };

    const handlePointerUp = (event: React.PointerEvent<SVGSVGElement>) => {
        if (disabled || !isDragging.current) return;

        isDragging.current = false;
        event.currentTarget.releasePointerCapture(event.pointerId);
        applyPointer(event);
        advanceMode();
    };

    const shiftActiveUnit = (direction: 1 | -1) => {
        if (activeMode === 'hours') {
            if (format === '12h') {
                const hour12 = value.hours % 12 || 12;
                const next = ((hour12 - 1 + direction + 12) % 12) + 1;
                onChange({ ...value, hours: isPM ? (next % 12) + 12 : next % 12 });
                return;
            }

            onChange({ ...value, hours: (value.hours + direction + 24) % 24 });
            return;
        }

        if (activeMode === 'minutes') {
            onChange({ ...value, minutes: (value.minutes + direction * minuteStep + 60) % 60 });
            return;
        }

        onChange({ ...value, seconds: (value.seconds + direction * secondStep + 60) % 60 });
    };

    const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
        if (disabled) return;

        if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
            event.preventDefault();
            shiftActiveUnit(1);
            return;
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
            event.preventDefault();
            shiftActiveUnit(-1);
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            advanceMode();
        }
    };

    const setPeriod = (pm: boolean) => {
        if (disabled || pm === isPM) return;

        onChange({ ...value, hours: pm ? (value.hours % 12) + 12 : value.hours % 12 });
    };

    const segmentClass = (segment: AnalogClockMode): string => `analog-clock__segment${activeMode === segment ? ' analog-clock__segment--active' : ''}`;

    const headerHours = format === '12h' ? value.hours % 12 || 12 : value.hours;

    return (
        <div className={`analog-clock${disabled ? ' analog-clock--disabled' : ''} ${className}`.trim()}>
            {showHeader && (
                <div className="analog-clock__header">
                    <div className="analog-clock__readout">
                        <button type="button" className={segmentClass('hours')} disabled={disabled} onClick={() => changeMode('hours')}>
                            {pad(headerHours)}
                        </button>
                        <span className="analog-clock__separator">:</span>
                        <button type="button" className={segmentClass('minutes')} disabled={disabled} onClick={() => changeMode('minutes')}>
                            {pad(value.minutes)}
                        </button>
                        {withSeconds && (
                            <>
                                <span className="analog-clock__separator">:</span>
                                <button type="button" className={segmentClass('seconds')} disabled={disabled} onClick={() => changeMode('seconds')}>
                                    {pad(value.seconds)}
                                </button>
                            </>
                        )}
                    </div>

                    {format === '12h' && (
                        <div className="analog-clock__period">
                            <button
                                type="button"
                                className={`analog-clock__period-button${!isPM ? ' analog-clock__period-button--active' : ''}`}
                                disabled={disabled}
                                onClick={() => setPeriod(false)}
                            >
                                AM
                            </button>
                            <button
                                type="button"
                                className={`analog-clock__period-button${isPM ? ' analog-clock__period-button--active' : ''}`}
                                disabled={disabled}
                                onClick={() => setPeriod(true)}
                            >
                                PM
                            </button>
                        </div>
                    )}
                </div>
            )}

            <svg
                ref={svgRef}
                className="analog-clock__dial"
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                tabIndex={disabled ? -1 : 0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onKeyDown={handleKeyDown}
            >
                <circle className="analog-clock__face" cx={geometry.center} cy={geometry.center} r={geometry.center - 1} />

                {activeMode !== 'hours' &&
                    Array.from({ length: 60 }, (_, index) => {
                        const isMajor = index % 5 === 0;
                        const start = toPoint(geometry.center, geometry.outerRadius + geometry.knobRadius * 0.55, index * 6);
                        const end = toPoint(geometry.center, geometry.outerRadius + geometry.knobRadius * (isMajor ? 0.95 : 0.8), index * 6);

                        return (
                            <line
                                key={`tick-${index}`}
                                className={`analog-clock__tick${isMajor ? ' analog-clock__tick--major' : ''}`}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                            />
                        );
                    })}

                <line className="analog-clock__hand" x1={geometry.center} y1={geometry.center} x2={handPoint.x} y2={handPoint.y} />
                <circle className="analog-clock__knob" cx={handPoint.x} cy={handPoint.y} r={geometry.knobRadius} />
                <circle className="analog-clock__pivot" cx={geometry.center} cy={geometry.center} r={size * 0.017} />

                {dialNumbers.map(number => {
                    const point = toPoint(geometry.center, number.inner ? geometry.innerRadius : geometry.outerRadius, number.degrees);

                    return (
                        <text
                            key={`${activeMode}-${number.inner ? 'inner' : 'outer'}-${number.value}`}
                            className={`analog-clock__number${number.inner ? ' analog-clock__number--inner' : ''}${
                                number.selected ? ' analog-clock__number--selected' : ''
                            }`}
                            x={point.x}
                            y={point.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                        >
                            {number.label}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};
