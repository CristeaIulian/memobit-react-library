import { ChangeEvent, FC, ReactElement } from 'react';

import './Slider.scss';

type ValueSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface SliderProps {
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    showValues?: boolean;
    /**
     * When true, render the value as a label to the right of the slider track
     * instead of as a large block below it. Ignored when `vertical` is true.
     */
    showValueAtTheRight?: boolean;
    largeValueState?: 'danger' | 'warning' | 'info' | 'success';
    /** Explicit font size for the value label. Overrides the thin default when combined. */
    valueSize?: ValueSize;
    /** Renders a thinner track and smaller thumb. */
    thin?: boolean;
    /** Renders the slider vertically (bottom = min, top = max). */
    vertical?: boolean;
}

// Derive decimal places from the step so fractional steps (0.1, 0.05, ...)
// display cleanly without floating-point artefacts.
const getDecimalPlaces = (step: number): number => {
    if (!Number.isFinite(step) || step >= 1) return 0;
    const parts = String(step).split('.');
    return parts[1]?.length ?? 0;
};

export const Slider: FC<SliderProps> = ({
    disabled = false,
    largeValueState = 'info',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    showValues = true,
    showValueAtTheRight = false,
    valueSize,
    thin = false,
    vertical = false,
}: SliderProps): ReactElement => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(parseFloat(e.target.value));
    };

    const decimals = getDecimalPlaces(step);
    const displayValue = decimals > 0 ? value.toFixed(decimals) : String(value);

    const isInline = showValueAtTheRight && !vertical;

    const className = [
        'slider-component',
        isInline ? 'slider-component--inline' : '',
        thin ? 'slider-component--thin' : '',
        vertical ? 'slider-component--vertical' : '',
        valueSize ? `slider-component--value-${valueSize}` : '',
    ].filter(Boolean).join(' ');

    const trackInput = (
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            step={step}
            onChange={handleChange}
            className="slider-input"
            disabled={disabled}
        />
    );

    const valueDisplay = showValues && (
        isInline ? (
            <span className={`slider-value-inline slider-state-${largeValueState}`}>
                {displayValue}
            </span>
        ) : (
            <div className="slider-display">
                <span className={`slider-value slider-state-${largeValueState}`}>{displayValue}</span>
            </div>
        )
    );

    return (
        <div className={className}>
            {trackInput}
            {valueDisplay}
        </div>
    );
};
