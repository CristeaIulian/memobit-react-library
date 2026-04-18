import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './Textarea.scss';

interface TextareaProps {
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

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
            <div className="textarea-wrapper">
                {label && (
                    <label htmlFor={id} className="textarea-label">
                        {label}
                        {required && <span className="textarea-required">*</span>}
                    </label>
                )}
                <textarea
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    className={`textarea${error ? ' textarea-error' : ''}${success ? ' textarea-success' : ''}`}
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
                {error && <span className="textarea-error-message">{error}</span>}
                {success && <span className="textarea-success-message">{success}</span>}
            </div>
        );
    }
);
