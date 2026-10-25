import { FocusEvent, forwardRef, KeyboardEvent, MouseEvent, useRef, useState } from 'react';

import type { TimeValue } from '../AnalogClock';
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

/**
 * Reads what was typed as `HH:mm`, or undefined when it is not a time yet. Takes `17:30`,
 * `9:05`, `1730` and `905`; with `allowHoursOnly`, a bare `9` or `17` too, which is only
 * a finished entry once the field is left.
 */
const parseTyped = (text: string, allowHoursOnly: boolean): string | undefined => {
    const match = text.trim().match(/^(\d{1,2}):?(\d{2})$/) ?? (allowHoursOnly ? text.trim().match(/^(\d{1,2})()$/) : null);
    if (!match) return undefined;

    const hours = Number(match[1]);
    const minutes = match[2] === '' ? 0 : Number(match[2]);
    if (hours > 23 || minutes > 59) return undefined;

    return `${pad(hours)}:${pad(minutes)}`;
};

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
        // What is being typed, kept until it reads as a time. A text field rather than the
        // native time input, which follows the device locale and shows AM/PM on a phone set
        // to English — this one is always 24-hour.
        const [draft, setDraft] = useState<string | undefined>(undefined);
        const fieldRef = useRef<HTMLDivElement>(null);

        // `HH:mm` strings compare in time order, so the range check needs no parsing.
        const isInRange = (time: string): boolean => (!min || time >= min) && (!max || time <= max);

        const handleClockChange = (time: TimeValue) => {
            setDraft(undefined);
            onChange?.(`${pad(time.hours)}:${pad(time.minutes)}`);
        };

        const handleInputChange = (text: string) => {
            setDraft(text);

            const time = parseTyped(text, false);
            if (time && isInRange(time)) {
                onChange?.(time);
            }
        };

        const handleInputBlur = (event: FocusEvent<HTMLInputElement>) => {
            if (draft !== undefined) {
                if (draft.trim() === '') {
                    onChange?.(undefined);
                } else {
                    const time = parseTyped(draft, true);
                    if (time && isInRange(time)) {
                        onChange?.(time);
                    }
                }
                // Anything that still isn't a time falls back to the last good value.
                setDraft(undefined);
            }
            onBlur?.(event);
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
                        type="text"
                        inputMode="numeric"
                        maxLength={5}
                        placeholder="--:--"
                        className={`input-time${error ? ' input-time-error' : ''}${success ? ' input-time-success' : ''}`}
                        id={id}
                        ref={ref}
                        value={draft ?? value?.slice(0, 5) ?? ''}
                        onBlur={handleInputBlur}
                        onChange={e => handleInputChange(e.target.value)}
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
                        <TimePicker collapsibleClock={false} label="" minuteStep={minuteStep} onChange={handleClockChange} value={parseTime(value)} withClock />
                    </Popover>
                )}
            </div>
        );
    }
);

InputTime.displayName = 'InputTime';
