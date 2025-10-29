import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './Textarea.scss';

interface TextareaProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    cols?: number;
    disabled?: boolean;
    id?: string;
    maxLength?: number;
    onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLTextAreaElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    value?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ autoComplete = 'on', autoFocus, cols, disabled, id, maxLength, onBlur, onChange, onClick, onKeyDown, onKeyUp, placeholder, rows, value }, ref) => {
        return (
            <textarea
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                className="textarea"
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
        );
    }
);
