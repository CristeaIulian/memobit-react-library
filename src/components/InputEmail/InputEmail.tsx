import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useState, useEffect } from 'react';

import './InputEmail.scss';

export interface InputEmailProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    id?: string;
    label?: string;
    maxLength?: number;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onValidate?: (isValid: boolean) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    showValidation?: boolean;
    validateOn?: 'blur' | 'change' | 'both';
    value?: string;
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateEmail = (email: string): boolean => {
    if (!email || email.trim() === '') {
        return true; // Empty is valid (use required prop for mandatory)
    }
    return EMAIL_REGEX.test(email.trim());
};

export const InputEmail = forwardRef<HTMLInputElement, InputEmailProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            disabled,
            error = 'Please enter a valid email address',
            id,
            label,
            maxLength,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            onValidate,
            placeholder,
            readOnly = false,
            required = false,
            showValidation = false,
            validateOn = 'blur',
            value,
        },
        ref
    ) => {
        const [isValid, setIsValid] = useState(true);
        const [isTouched, setIsTouched] = useState(false);

        const validateValue = (val: string): boolean => {
            // If required and empty, it's invalid
            if (required && (!val || val.trim() === '')) {
                return false;
            }
            // If not required and empty, it's valid
            if (!val || val.trim() === '') {
                return true;
            }
            // Otherwise check email format
            return validateEmail(val);
        };

        useEffect(() => {
            if (value !== undefined) {
                const valid = validateValue(value);
                setIsValid(valid);
                onValidate?.(valid);
            }
        }, [value, onValidate, required]);

        const handleChange = (newValue: string) => {
            onChange?.(newValue);

            if (validateOn === 'change' || validateOn === 'both') {
                const valid = validateValue(newValue);
                setIsValid(valid);
                setIsTouched(true);
                onValidate?.(valid);
            }
        };

        const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
            setIsTouched(true);

            if (validateOn === 'blur' || validateOn === 'both') {
                const valid = validateValue(event.target.value);
                setIsValid(valid);
                onValidate?.(valid);
            }

            onBlur?.(event);
        };

        const showError = showValidation && isTouched && !isValid;

        return (
            <div className="input-email-wrapper">
                {label && (
                    <label htmlFor={id} className="input-email-label">
                        {label}
                        {required && <span className="input-email-required">*</span>}
                    </label>
                )}
                <input
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    type="email"
                    className={`input-email ${showError ? 'input-email--error' : ''} ${isValid && isTouched && showValidation ? 'input-email--valid' : ''}`}
                    id={id}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    ref={ref}
                    value={value}
                    onBlur={handleBlur}
                    onChange={e => handleChange(e.target.value)}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    readOnly={readOnly}
                    required={required}
                />
                {showError && <span className="input-email-error-message">{error}</span>}
            </div>
        );
    }
);
