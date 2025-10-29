import { ChangeEvent, FC, ReactElement } from 'react';

import './Slider.scss';

interface SliderProps {
    min?: number;
    max?: number;
    value: number;
    onChange: (value: number) => void;
    showValues?: boolean;
}

export const Slider: FC<SliderProps> = ({ min = 0, max = 100, value, onChange, showValues = true }: SliderProps): ReactElement => {
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
            <input type="range" min={min} max={max} value={value} onChange={handleChange} className="slider-input" />
            {showValues && (
                <div className="slider-display">
                    <span className={`slider-value slider-value-${getScoreClass(value, min, max)}`}>{value}</span>
                </div>
            )}
        </div>
    );
};
