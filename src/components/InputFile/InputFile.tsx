import { forwardRef,KeyboardEvent, MouseEvent } from 'react';

import './InputFile.scss';

interface InputFileProps {
    accept?: string;
    disabled?: boolean;
    id?: string;
    onChange?: (value: FileList | null) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    value?: string;
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(({ accept, disabled, id, onChange, onClick, onKeyDown, placeholder, value }, ref) => {
    return (
        <input
            accept={accept}
            disabled={disabled}
            type="file"
            className="input"
            id={id}
            placeholder={placeholder}
            ref={ref}
            value={value}
            onChange={e => onChange?.(e.target.files)}
            onClick={onClick}
            onKeyDown={onKeyDown}
        />
    );
});
