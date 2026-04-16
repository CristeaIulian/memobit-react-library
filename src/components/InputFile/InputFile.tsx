import { forwardRef, KeyboardEvent, MouseEvent } from 'react';

import './InputFile.scss';

interface InputFileProps {
    accept?: string;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    onChange?: (value: FileList | null) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    value?: string;
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
    ({ accept, disabled, error, highlighted, id, label, onChange, onClick, onKeyDown, placeholder, required, value }, ref) => {
        return (
            <div className={`input-file-wrapper${highlighted ? ' input-file-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-file-label">
                        {label}
                        {required && <span className="input-file-required">*</span>}
                    </label>
                )}
                <input
                    accept={accept}
                    disabled={disabled}
                    type="file"
                    className="input-file"
                    id={id}
                    placeholder={placeholder}
                    ref={ref}
                    value={value}
                    onChange={e => onChange?.(e.target.files)}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                />
                {error && <span className="input-file-error-message">{error}</span>}
            </div>
        );
    }
);
