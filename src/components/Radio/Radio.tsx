import { ChangeEvent, FC, ReactNode, useId } from 'react';

import './Radio.scss';

export interface RadioProps {
    checked?: boolean;
    onChange?: (value: string | number | boolean) => void;
    label?: ReactNode;
    disabled?: boolean;
    name?: string;
    value?: string | number;
    id?: string;
    className?: string;
}

export const Radio: FC<RadioProps> = ({ checked = false, onChange, label, disabled = false, name, value, id, className = '' }: RadioProps) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e.target.checked && value !== undefined ? value : e.target.checked);
    };

    return (
        <div className={['radio-wrapper', disabled ? 'radio-wrapper--disabled' : '', className].filter(Boolean).join(' ')}>
            <input type="radio" id={inputId} name={name} value={value} className="radio-input" checked={checked} onChange={handleChange} disabled={disabled} />
            <label htmlFor={inputId} className="radio-label">
                <span className="radio-circle"></span>
                {label && <span className="radio-text">{label}</span>}
            </label>
        </div>
    );
};
