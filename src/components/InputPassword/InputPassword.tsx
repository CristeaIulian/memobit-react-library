import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputPassword.scss';

interface InputPasswordProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    maxLength?: number;
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

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            disabled,
            error,
            highlighted,
            id,
            label,
            maxLength,
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
            <div className={`input-password-wrapper${highlighted ? ' input-password-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-password-label">
                        {label}
                        {required && <span className="input-password-required">*</span>}
                    </label>
                )}
                <input
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    type="password"
                    className="input-password"
                    id={id}
                    maxLength={maxLength}
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
                {error && <span className="input-password-error-message">{error}</span>}
            </div>
        );
    }
);
