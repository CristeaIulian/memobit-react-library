import { ChangeEvent, FC, ReactElement } from 'react';

import './Slider.scss';

interface SliderProps {
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    showValues?: boolean;
}

export const Slider: FC<SliderProps> = ({ disabled = false, min = 0, max = 100, step = 1, value, onChange, showValues = true }: SliderProps): ReactElement => {
    const getScoreClass = (score: number, minValue: number, maxValue: number): string => {
        const range = maxValue - minValue;
        const normalizedScore = ((score - minValue) / range) * 100;

        if (normalizedScore <= 33) {
            return 'low';
        }

        if (normalizedScore <= 66) {
            return 'medium';
        }

        return 'high';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value));
    };

    return (
        <div className="slider-component">
            <input type="range" min={min} max={max} value={value} step={step} onChange={handleChange} className="slider-input" disabled={disabled} />
            {showValues && (
                <div className="slider-display">
                    <span className={`slider-value slider-value-${getScoreClass(value, min, max)}`}>{value}</span>
                </div>
            )}
        </div>
    );
};
