import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useState } from 'react';

import './InputPhone.scss';

// Very lightweight format engine.
// `#` → digit placeholder, everything else is a literal separator.
// Default: international style  +## (###) ###-####
const DEFAULT_FORMAT = '+## (###) ###-####';

function applyFormat(digits: string, format: string): string {
    let di = 0;
    let result = '';

    for (let fi = 0; fi < format.length; fi++) {
        if (di >= digits.length) break;

        if (format[fi] === '#') {
            result += digits[di];
            di++;
        } else {
            // Only add the separator if there are still digits to follow
            if (di < digits.length) {
                result += format[fi];
            }
        }
    }

    return result;
}

function extractDigits(value: string): string {
    return value.replace(/\D/g, '');
}

function maxDigitsInFormat(format: string): number {
    return format.split('').filter(c => c === '#').length;
}

interface InputPhoneProps {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    format?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string, digits: string) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
}

export const InputPhone = forwardRef<HTMLInputElement, InputPhoneProps>(
    (
        {
            autoFocus,
            disabled,
            error,
            format = DEFAULT_FORMAT,
            highlighted,
            id,
            label,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            placeholder,
            readOnly = false,
            required = false,
            value,
        },
        ref
    ) => {
        const controlled = value !== undefined;
        const [internalValue, setInternalValue] = useState<string>(() =>
            value ? applyFormat(extractDigits(value), format) : ''
        );

        const displayValue = controlled
            ? applyFormat(extractDigits(value ?? ''), format)
            : internalValue;

        const derivedPlaceholder = placeholder ?? format.replace(/#/g, '0');
        const maxLen = format.length; // formatted string length

        const handleChange = (raw: string) => {
            const digits = extractDigits(raw);
            const maxDigits = maxDigitsInFormat(format);
            const clampedDigits = digits.slice(0, maxDigits);
            const formatted = applyFormat(clampedDigits, format);

            if (!controlled) {
                setInternalValue(formatted);
            }

            onChange?.(formatted, clampedDigits);
        };

        return (
            <div className="input-phone-wrapper">
                {label && (
                    <label htmlFor={id} className="input-phone-label">
                        {label}
                        {required && <span className="input-phone-required">*</span>}
                    </label>
                )}
                <div className={`input-phone-field ${error ? 'input-phone-field--error' : ''} ${highlighted ? 'input-phone-field--highlighted' : ''} ${disabled ? 'input-phone-field--disabled' : ''}`}>
                    <span className="input-phone-icon" aria-hidden="true">
                        {/* Simple phone handset SVG */}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </span>
                    <input
                        autoFocus={autoFocus}
                        className="input-phone"
                        disabled={disabled}
                        id={id}
                        inputMode="tel"
                        maxLength={maxLen}
                        placeholder={derivedPlaceholder}
                        readOnly={readOnly}
                        ref={ref}
                        required={required}
                        type="tel"
                        value={displayValue}
                        onBlur={onBlur}
                        onChange={e => handleChange(e.target.value)}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                    />
                </div>
                {error && <span className="input-phone-error-message">{error}</span>}
            </div>
        );
    }
);

InputPhone.displayName = 'InputPhone';
