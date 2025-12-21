import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputText.scss';

interface InputTextProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
    label?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            disabled,
            error,
            id,
            label,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            placeholder,
            readOnly = false,
            required = false,
            value,
        },
        ref
    ) => {
        return (
            <div className="input-text-wrapper">
                {label && (
                    <label htmlFor={id} className="input-text-label">
                        {label}
                        {required && <span className="input-text-required">*</span>}
                    </label>
                )}
                <input
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    type="text"
                    className={`input-text ${error ? 'input-text-error' : ''}`}
                    id={id}
                    placeholder={placeholder}
                    ref={ref}
                    value={value}
                    onBlur={onBlur}
                    onChange={e => onChange?.(e.target.value)}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    readOnly={readOnly}
                    required={required}
                />
                {error && <span className="input-text-error-message">{error}</span>}
            </div>
        );
    }
);
