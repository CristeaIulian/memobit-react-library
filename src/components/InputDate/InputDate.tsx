import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputDate.scss';

interface InputDateProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
    label?: string;
    max?: string;
    min?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    required?: boolean;
    type?: 'datetime' | 'date';
    value?: string;
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            disabled,
            error,
            id,
            label,
            max,
            min,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            readOnly = false,
            required = false,
            type = 'date',
            value,
        },
        ref
    ) => {
        return (
            <div className="input-date-wrapper">
                {label && (
                    <label htmlFor={id} className="input-date-label">
                        {label}
                        {required && <span className="input-date-required">*</span>}
                    </label>
                )}
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
                    required={required}
                />
                {error && <span className="input-date-error-message">{error}</span>}
            </div>
        );
    }
);
