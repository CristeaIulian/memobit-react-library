import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent } from 'react';
import { InputText } from '../InputText/InputText';
import { search } from '../../icons/search';
import './Search.scss';

export interface SearchProps {
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
    className?: string;
}

export const Search = forwardRef<HTMLInputElement, SearchProps>(
    (
        {
            autoComplete = 'off',
            autoFocus,
            disabled,
            id,
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
        return (
            <div className={`search ${className}`}>
                <div className="search__icon">{search}</div>
                <InputText
                    autoComplete={autoComplete}
                    autoFocus={autoFocus}
                    disabled={disabled}
                    id={id}
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
            </div>
        );
    }
);
