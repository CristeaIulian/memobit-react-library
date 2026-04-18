import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputDate.scss';

interface InputDateProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
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
    success?: string;
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
            highlighted,
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
            success,
            type = 'date',
            value,
        },
        ref
    ) => {
        return (
            <div className={`input-date-wrapper${highlighted ? ' input-date-highlighted' : ''}`}>
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
                    className={`input-date${error ? ' input-date-error' : ''}${success ? ' input-date-success' : ''}`}
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
                {success && <span className="input-date-success-message">{success}</span>}
            </div>
        );
    }
);
