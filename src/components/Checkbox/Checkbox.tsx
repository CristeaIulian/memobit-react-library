import { FC, useId } from 'react';

import './Checkbox.scss';

interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    disabled?: boolean;
    id?: string;
}

export const Checkbox: FC<CheckboxProps> = ({ checked = false, onChange, label, disabled = false, id }: CheckboxProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
        <div className={`checkbox-wrapper ${disabled ? 'checkbox-wrapper--disabled' : ''}`}>
            <input
                type="checkbox"
                id={inputId}
                className="checkbox-input"
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
