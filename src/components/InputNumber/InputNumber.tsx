import { forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputNumber.scss';

interface InputNumberProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    max?: number;
    min?: number;
    onChange?: (value: number | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    step?: number;
    success?: string;
    value?: number;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
    ({ autoComplete = 'on', autoFocus, disabled, error, highlighted, id, label, onChange, onClick, onKeyDown, required, success, value, min, max, placeholder, step }, ref) => {
        return (
            <div className={`input-number-wrapper${highlighted ? ' input-number-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-number-label">
                        {label}
                        {required && <span className="input-number-required">*</span>}
                    </label>
                )}
                <input
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    className={`input-number${error ? ' input-number-error' : ''}${success ? ' input-number-success' : ''}`}
                    id={id}
                    max={max}
                    min={min}
                    onChange={e => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
                    onClick={onClick}
                    onKeyDown={e => {
                        if (e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                        onKeyDown?.(e);
                    }}
                    placeholder={placeholder}
                    ref={ref}
                    step={step}
                    type="number"
                    value={value ?? ''}
                />
                {error && <span className="input-number-error-message">{error}</span>}
                {success && <span className="input-number-success-message">{success}</span>}
            </div>
        );
    }
);
