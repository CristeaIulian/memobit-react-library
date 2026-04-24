import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';
import { InputText } from '../InputText/InputText';
import { Icon } from '../Icon';
import './Search.scss';

const clearIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
        />
    </svg>
);

export interface SearchProps {
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

export const Search = forwardRef<HTMLInputElement, SearchProps>(
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
            <div className={`search ${className}`}>
                <div className="search__icon"><Icon name="search" /></div>
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
                    <button type="button" className="search__clear" onClick={handleClear} aria-label="Clear search">
                        {clearIcon}
                    </button>
                )}
            </div>
        );
    }
);
