import { ChangeEvent, FC, useId } from 'react';

import './Radio.scss';

interface RadioProps {
    checked?: boolean;
    onChange?: (value: string | number | boolean) => void;
    label?: string;
    disabled?: boolean;
    name?: string;
    value?: string | number;
    id?: string;
}

export const Radio: FC<RadioProps> = ({ checked = false, onChange, label, disabled = false, name, value, id }: RadioProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked && value ? value : e.target.checked);
    };

    return (
        <div className={`radio-wrapper ${disabled ? 'radio-wrapper--disabled' : ''}`}>
            <input type="radio" id={inputId} name={name} value={value} className="radio-input" checked={checked} onChange={handleChange} disabled={disabled} />
            <label htmlFor={inputId} className="radio-label">
                <span className="radio-circle"></span>
                {label && <span className="radio-text">{label}</span>}
            </label>
        </div>
    );
};
