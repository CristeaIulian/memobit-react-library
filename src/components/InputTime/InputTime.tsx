import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputTime.scss';

interface InputTimeProps {
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
    value?: string;
}

export const InputTime = forwardRef<HTMLInputElement, InputTimeProps>(
    (
        {
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
            value,
        },
        ref
    ) => {
        return (
            <div className={`input-time-wrapper${highlighted ? ' input-time-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-time-label">
                        {label}
                        {required && <span className="input-time-required">*</span>}
                    </label>
                )}
                <input
                    autoFocus={autoFocus}
                    disabled={disabled}
                    type="time"
                    className="input-time"
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
                {error && <span className="input-time-error-message">{error}</span>}
            </div>
        );
    }
);
