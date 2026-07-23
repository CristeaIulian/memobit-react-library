import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useRef } from 'react';

import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

import './InputDate.scss';

interface InputDateProps {
    autoComplete?: 'on' | 'off';
    autoFocus?: boolean;
    clearable?: boolean;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    max?: string;
    min?: string;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    required?: boolean;
    success?: string;
    type?: 'datetime' | 'date';
    value?: string;
}

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
    (
        {
            autoComplete = 'on',
            autoFocus,
            clearable,
            disabled,
            error,
            highlighted,
            id,
            label,
            max,
            min,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            readOnly = false,
            required = false,
            success,
            type = 'date',
            value,
        },
        ref
    ) => {
        const showClear = clearable && value && !disabled && !readOnly;

        // Own the input node so the picker button can open the native calendar. Merge with any forwarded ref.
        const innerRef = useRef<HTMLInputElement | null>(null);
        const setRef = (node: HTMLInputElement | null) => {
            innerRef.current = node;
            if (typeof ref === 'function') {
                ref(node);
            } else if (ref) {
                ref.current = node;
            }
        };

        const openPicker = () => {
            const node = innerRef.current;
            if (node && !disabled && !readOnly) {
                node.showPicker();
            }
        };

        return (
            <div className={`input-date-wrapper${highlighted ? ' input-date-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-date-label">
                        {label}
                        {required && <span className="input-date-required">*</span>}
                    </label>
                )}
                <div className="input-date-field">
                    <input
                        autoComplete={autoComplete}
                        autoFocus={autoFocus}
                        disabled={disabled}
                        type={type === 'date' ? 'date' : 'datetime-local'}
                        className={`input-date${error ? ' input-date-error' : ''}${success ? ' input-date-success' : ''}${showClear ? ' input-date--clearable' : ''}`}
                        id={id}
                        max={max}
                        min={min}
                        ref={setRef}
                        value={value ?? ''}
                        onBlur={onBlur}
                        onChange={e => onChange?.(e.target.value || undefined)}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}
                        readOnly={readOnly}
                        required={required}
                    />
                    {/* We hide the browser's native calendar indicator (its position is unpredictable and clashes with
                        the clear button) and render our own themed controls in a fixed, non-overlapping group. */}
                    <div className="input-date-actions">
                        {showClear && (
                            <Tooltip title="Clear date">
                                <button type="button" className="input-date-clear" onClick={() => onChange?.(undefined)}>
                                    <Icon name="clear" size="sm" />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip title="Open calendar">
                            <button type="button" className="input-date-picker" onClick={openPicker} disabled={disabled || readOnly} tabIndex={-1}>
                                <Icon name="calendar" size="sm" />
                            </button>
                        </Tooltip>
                    </div>
                </div>
                {error && <span className="input-date-error-message">{error}</span>}
                {success && <span className="input-date-success-message">{success}</span>}
            </div>
        );
    }
);
