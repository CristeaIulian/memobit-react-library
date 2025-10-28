import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputDateTime.scss';

interface InputDateTimeProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    id?: string;
    max?: string;
    min?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    value?: string;
}

export const InputDateTime = forwardRef<HTMLInputElement, InputDateTimeProps>(
    ({ autoComplete = 'on', autoFocus, disabled, id, max, min, onBlur, onChange, onClick, onKeyDown, onKeyUp, readOnly = false, value }, ref) => {
        return (
            <input
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                type="datetime-local"
                className="input-datetime"
                id={id}
                max={max}
                min={min}
                ref={ref}
                value={value ?? ''}
                onBlur={onBlur}
                onChange={e => onChange?.(e.target.value || undefined)}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                readOnly={readOnly}
            />
        );
    }
);
