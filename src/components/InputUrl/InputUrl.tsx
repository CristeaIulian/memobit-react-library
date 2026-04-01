import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useState } from 'react';

import './InputUrl.scss';

const DEFAULT_URL_ERROR_MESSAGE = 'Please enter a valid URL (e.g. https://example.com)';

const isValidUrl = (value: string): boolean => {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
};

interface InputUrlProps {
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
    onValidationChange?: (isValid: boolean) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    validationErrorMessage?: string;
    value?: string;
}

export const InputUrl = forwardRef<HTMLInputElement, InputUrlProps>(
    (
        {
            autoFocus,
            disabled,
            error,
            id,
            label,
            maxLength,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            onValidationChange,
            placeholder = 'https://',
            readOnly = false,
            required = false,
            validationErrorMessage,
            value,
        },
        ref
    ) => {
        const [internalError, setInternalError] = useState<string | undefined>(undefined);

        const validate = (val: string): boolean => {
            if (!val) {
                setInternalError(undefined);
                onValidationChange?.(true);
                return true;
            }

            const valid = isValidUrl(val);
            setInternalError(valid ? undefined : (validationErrorMessage ?? DEFAULT_URL_ERROR_MESSAGE));
            onValidationChange?.(valid);
            return valid;
        };

        const handleChange = (val: string) => {
            onChange?.(val);
            if (internalError) {
                validate(val);
            }
        };

        const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
            validate(event.target.value);
            onBlur?.(event);
        };

        const displayedError = error ?? internalError;

        return (
            <div className="input-url-wrapper">
                {label && (
                    <label htmlFor={id} className="input-url-label">
                        {label}
                        {required && <span className="input-url-required">*</span>}
                    </label>
                )}
                <input
                    autoFocus={autoFocus}
                    disabled={disabled}
                    type="url"
                    className={`input-url ${displayedError ? 'input-url-error' : ''}`}
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
                {displayedError && <span className="input-url-error-message">{displayedError}</span>}
            </div>
        );
    }
);
