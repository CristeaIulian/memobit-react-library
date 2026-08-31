import React, { useState } from 'react';

import { Icon } from '../Icon';

interface TimeSpinnerProps {
    active?: boolean;
    disabled?: boolean;
    max: number;
    min: number;
    onChange: (value: number) => void;
    onFocus?: () => void;
    step?: number;
    title?: string;
    value: number;
}

const pad = (value: number): string => value.toString().padStart(2, '0');

export const TimeSpinner: React.FC<TimeSpinnerProps> = ({ active, disabled, max, min, onChange, onFocus, step = 1, title, value }: TimeSpinnerProps) => {
    const [draft, setDraft] = useState<string | undefined>(undefined);

    const wrap = (next: number): number => {
        const span = max - min + 1;
        return ((((next - min) % span) + span) % span) + min;
    };

    const shift = (direction: 1 | -1) => {
        if (disabled) return;

        setDraft(undefined);
        onChange(wrap(value + direction * step));
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const digits = event.target.value.replace(/\D/g, '').slice(-2);
        setDraft(digits);

        if (digits === '') return;

        const parsed = Number(digits);
        if (parsed >= min && parsed <= max) {
            onChange(parsed);
        }
    };

    const handleBlur = () => {
        if (draft !== undefined && draft !== '') {
            onChange(Math.min(Math.max(Number(draft), min), max));
        }
        setDraft(undefined);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            shift(1);
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            shift(-1);
        }
    };

    return (
        <div className={`time-spinner${active ? ' time-spinner--active' : ''}${disabled ? ' time-spinner--disabled' : ''}`}>
            <input
                className="time-spinner__input"
                disabled={disabled}
                inputMode="numeric"
                onBlur={handleBlur}
                onChange={handleInputChange}
                onFocus={onFocus}
                onKeyDown={handleKeyDown}
                title={title}
                type="text"
                value={draft ?? pad(value)}
            />
            <span className="time-spinner__steppers">
                <button className="time-spinner__step" disabled={disabled} onClick={() => shift(1)} tabIndex={-1} type="button">
                    <Icon name="caret-up" />
                </button>
                <button className="time-spinner__step" disabled={disabled} onClick={() => shift(-1)} tabIndex={-1} type="button">
                    <Icon name="caret-down" />
                </button>
            </span>
        </div>
    );
};
