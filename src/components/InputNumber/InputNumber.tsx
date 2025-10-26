import { forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputNumber.scss';

interface InputNumberProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    id?: string;
    max?: number;
    min?: number;
    onChange?: (value: number | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    step?: number;
    value?: number;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
    ({ autoComplete = 'on', autoFocus, disabled, id, onChange, onClick, onKeyDown, value, min, max, placeholder, step }, ref) => {
        return (
            <input
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                className="input-number"
                id={id}
                max={max}
                min={min}
                onChange={e => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
                onClick={onClick}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                ref={ref}
                step={step}
                type="number"
                value={value ?? ''}
            />
        );
    }
);
