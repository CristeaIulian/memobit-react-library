import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputTextarea.scss';

interface InputTextareaProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    cols?: number;
    disabled?: boolean;
    error?: string;
    id?: string;
    label?: string;
    maxLength?: number;
    onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    success?: string;
    value?: string;
}

export const InputTextarea = forwardRef<HTMLTextAreaElement, InputTextareaProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            cols,
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
            placeholder,
            required,
            rows,
            success,
            value,
        },
        ref
    ) => {
        return (
            <div className="input-textarea-wrapper">
                {label && (
                    <label htmlFor={id} className="input-textarea-label">
                        {label}
                        {required && <span className="input-textarea-required">*</span>}
                    </label>
                )}
                <textarea
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    className={`input-textarea${error ? ' input-textarea-error' : ''}${success ? ' input-textarea-success' : ''}`}
                    cols={cols}
                    disabled={disabled}
                    id={id}
                    maxLength={maxLength}
                    onBlur={onBlur}
                    onChange={e => onChange?.(e.target.value)}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    placeholder={placeholder}
                    ref={ref}
                    rows={rows}
                    value={value}
                />
                {error && <span className="input-textarea-error-message">{error}</span>}
                {success && <span className="input-textarea-success-message">{success}</span>}
            </div>
        );
    }
);
