import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useRef, useState } from 'react';

import { TimeValue } from '../AnalogClock';
import { Icon } from '../Icon';
import { Popover } from '../Popover';
import { TimePicker } from '../TimePicker';

import './InputTime.scss';

interface InputTimeProps {
    autoFocus?: boolean;
    disabled?: boolean;
    error?: string;
    highlighted?: boolean;
    id?: string;
    label?: string;
    max?: string;
    min?: string;
    minuteStep?: number;
    onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
    onChange?: (value: string | undefined) => void;
    onClick?: (event: MouseEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    required?: boolean;
    success?: string;
    value?: string;
    withClock?: boolean;
}

const pad = (value: number): string => value.toString().padStart(2, '0');

const parseTime = (value: string | undefined): TimeValue => {
    const [hours, minutes] = (value ?? '').split(':').map(Number);

    return {
        hours: Number.isFinite(hours) ? hours : 0,
        minutes: Number.isFinite(minutes) ? minutes : 0,
        seconds: 0,
    };
};

export const InputTime = forwardRef<HTMLInputElement, InputTimeProps>(
    (
        {
            autoFocus,
            disabled,
            error,
            highlighted,
            id,
            label,
            max,
            min,
            minuteStep = 1,
            onBlur,
            onChange,
            onClick,
            onKeyDown,
            onKeyUp,
            readOnly = false,
            required = false,
            success,
            value,
            withClock = false,
        },
        ref
    ) => {
        const [isClockOpen, setIsClockOpen] = useState(false);
        const fieldRef = useRef<HTMLDivElement>(null);

        const handleClockChange = (time: TimeValue) => {
            onChange?.(`${pad(time.hours)}:${pad(time.minutes)}`);
        };

        return (
            <div className={`input-time-wrapper${highlighted ? ' input-time-highlighted' : ''}`}>
                {label && (
                    <label htmlFor={id} className="input-time-label">
                        {label}
                        {required && <span className="input-time-required">*</span>}
                    </label>
                )}
                <div ref={fieldRef} className={`input-time-field${withClock ? ' input-time-field--with-clock' : ''}`}>
                    <input
                        autoFocus={autoFocus}
                        disabled={disabled}
                        type="time"
                        className={`input-time${error ? ' input-time-error' : ''}${success ? ' input-time-success' : ''}`}
                        id={id}
                        max={max}
                        min={min}
                        ref={ref}
                        value={value ?? ''}
                        onBlur={onBlur}
                        onChange={e => onChange?.(e.target.value || undefined)}
                        onClick={onClick}
                        onKeyDown={onKeyDown}
                        onKeyUp={onKeyUp}
                        readOnly={readOnly}
                        required={required}
                    />
                    {withClock && (
                        <button
                            className={`input-time-clock-button${isClockOpen ? ' input-time-clock-button--active' : ''}`}
                            disabled={disabled || readOnly}
                            onClick={() => setIsClockOpen(!isClockOpen)}
                            title="Pick on a clock"
                            type="button"
                        >
                            <Icon name="time" />
                        </button>
                    )}
                </div>
                {error && <span className="input-time-error-message">{error}</span>}
                {success && <span className="input-time-success-message">{success}</span>}

                {withClock && (
                    <Popover visible={isClockOpen} onClose={() => setIsClockOpen(false)} anchorEl={fieldRef.current}>
                        <TimePicker
                            collapsibleClock={false}
                            label=""
                            minuteStep={minuteStep}
                            onChange={handleClockChange}
                            value={parseTime(value)}
                            withClock
                        />
                    </Popover>
                )}
            </div>
        );
    }
);
