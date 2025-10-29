import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputDate.scss';

interface InputDateProps {
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
    type?: 'datetime-local' | 'date';
    value?: string;
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
    (
        { autoComplete = 'on', autoFocus, disabled, id, max, min, onBlur, onChange, onClick, onKeyDown, onKeyUp, readOnly = false, type = 'date', value },
        ref
    ) => {
        return (
            <input
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                type={type === 'date' ? 'date' : 'datetime-local'}
                className="input-date"
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
