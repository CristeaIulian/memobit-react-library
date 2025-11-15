import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputPassword.scss';

interface InputPasswordProps {
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
    required?: boolean;
    value?: string;
}

export const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(
    (
        { autoComplete = 'on', autoFocus, disabled, id, onBlur, onChange, onClick, onKeyDown, onKeyUp, placeholder, readOnly = false, required = false, value },
        ref
    ) => {
        return (
            <input
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                disabled={disabled}
                type="password"
                className="input-password"
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
        );
    }
);
