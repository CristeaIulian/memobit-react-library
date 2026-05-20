import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';
import { InputText } from '../InputText';
import { Icon } from '../Icon';
import './InputSearch.scss';

export interface InputSearchProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    disabled?: boolean;
    id?: string;
    label?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    value?: string;
    className?: string;
}

export const InputSearch = forwardRef<HTMLInputElement, InputSearchProps>(
    (
        {
            autoComplete = 'off',
            autoFocus,
            disabled,
            id,
            label,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            placeholder = 'Search...',
            readOnly = false,
            required = false,
            value,
            className = '',
        },
        ref
    ) => {
        const handleClear = () => {
            onChange?.('');
        };

        const showClearButton = value && value.length > 0 && !disabled && !readOnly;

        return (
            <div className={`input-search ${className}`}>
                <div className="input-search__icon">
                    <Icon name="search" />
                </div>
                <InputText
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    id={id}
                    label={label}
                    onBlur={onBlur}
                    onChange={onChange}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onKeyUp={onKeyUp}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    required={required}
                    value={value}
                    ref={ref}
                />
                {showClearButton && (
                    <button type="button" className="input-search__clear" onClick={handleClear} aria-label="Clear search">
                        <Icon name="clear" size="sm" />
                    </button>
                )}
            </div>
        );
    }
);
