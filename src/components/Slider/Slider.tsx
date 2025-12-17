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
    largeValueState?: 'danger' | 'warning' | 'info' | 'success';
}

export const Slider: FC<SliderProps> = ({
    disabled = false,
    largeValueState = 'info',
    min = 0,
    max = 100,
    step = 1,
    value,
    onChange,
    showValues = true,
}: SliderProps): ReactElement => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value));
    };

    return (
        <div className="slider-component">
            <input type="range" min={min} max={max} value={value} step={step} onChange={handleChange} className="slider-input" disabled={disabled} />
            {showValues && (
                <div className="slider-display">
                    <span className={`slider-value slider-state-${largeValueState}`}>{value}</span>
                </div>
            )}
        </div>
    );
};
