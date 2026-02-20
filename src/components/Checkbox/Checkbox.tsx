import { FC, useEffect, useId, useRef } from 'react';

import './Checkbox.scss';

interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    id?: string;
    indeterminate?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({ checked = false, onChange, label, disabled = false, id, indeterminate = false }: CheckboxProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = indeterminate && !checked;
        }
    }, [indeterminate, checked]);

    return (
        <div className={`checkbox-wrapper ${disabled ? 'checkbox-wrapper--disabled' : ''}`}>
            <input
                type="checkbox"
                id={inputId}
                className="checkbox-input"
                ref={inputRef}
                checked={checked}
                onChange={event => onChange?.(event.target.checked)}
                disabled={disabled}
            />
            <label htmlFor={inputId} className="checkbox-label">
                <span className="checkbox-box"></span>
                {label && <span className="checkbox-text">{label}</span>}
            </label>
        </div>
    );
};
