import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputText.scss';

interface InputTextProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    id?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    value?: string;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(
    ({ autoComplete = 'on', autoFocus, disabled, id, onBlur, onChange, onClick, onKeyDown, onKeyUp, placeholder, readOnly = false, value }, ref) => {
        return (
            <input
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                type="text"
                className="input-text"
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
            />
        );
    }
);
