import React, { useState } from 'react';

import { AnalogClock, AnalogClockMode, TimeValue } from '../AnalogClock';
import { Icon } from '../Icon';

import { TimeSpinner } from './TimeSpinner';

import './TimePicker.scss';

export interface TimePickerProps {
    className?: string;
    clockSize?: number;
    collapsibleClock?: boolean;
    disabled?: boolean;
    format?: '12h' | '24h';
    label?: string;
    minuteStep?: number;
    onChange: (value: TimeValue) => void;
    value: TimeValue;
    withClock?: boolean;
    withSeconds?: boolean;
}

export const TimePicker: React.FC<TimePickerProps> = ({
    className = '',
    clockSize = 208,
    collapsibleClock = true,
    disabled = false,
    format = '24h',
    label = 'Time',
    minuteStep = 1,
    onChange,
    value,
    withClock = false,
    withSeconds = false,
}: TimePickerProps) => {
    const [mode, setMode] = useState<AnalogClockMode>('hours');
    const [isClockOpen, setIsClockOpen] = useState(true);

    const isPM = value.hours >= 12;
    const showClock = withClock && (!collapsibleClock || isClockOpen);

    const handleHoursChange = (hours: number) => {
        if (format === '12h') {
            const hour12 = hours % 12;
            onChange({ ...value, hours: isPM ? hour12 + 12 : hour12 });
            return;
        }

        onChange({ ...value, hours });
    };

    const togglePeriod = () => {
        onChange({ ...value, hours: isPM ? value.hours % 12 : (value.hours % 12) + 12 });
    };

    return (
        <div className={`time-picker${showClock ? ' time-picker--with-clock' : ''} ${className}`.trim()}>
            <div className="time-picker__header">
                {label && <span className="time-picker__label">{label}</span>}
                {withClock && collapsibleClock && (
                    <button
                        className={`time-picker__clock-toggle${isClockOpen ? ' time-picker__clock-toggle--active' : ''}`}
                        disabled={disabled}
                        onClick={() => setIsClockOpen(!isClockOpen)}
                        title={isClockOpen ? 'Hide clock' : 'Pick on a clock'}
                        type="button"
                    >
                        <Icon name="time" />
                    </button>
                )}
            </div>

            <div className="time-picker__fields">
                <TimeSpinner
                    active={mode === 'hours'}
                    disabled={disabled}
                    max={format === '12h' ? 12 : 23}
                    min={format === '12h' ? 1 : 0}
                    onChange={handleHoursChange}
                    onFocus={() => setMode('hours')}
                    title="Hours"
                    value={format === '12h' ? value.hours % 12 || 12 : value.hours}
                />
                <span className="time-picker__separator">:</span>
                <TimeSpinner
                    active={mode === 'minutes'}
                    disabled={disabled}
                    max={59}
                    min={0}
                    onChange={minutes => onChange({ ...value, minutes })}
                    onFocus={() => setMode('minutes')}
                    step={minuteStep}
                    title="Minutes"
                    value={value.minutes}
                />
                {withSeconds && (
                    <>
                        <span className="time-picker__separator">:</span>
                        <TimeSpinner
                            active={mode === 'seconds'}
                            disabled={disabled}
                            max={59}
                            min={0}
                            onChange={seconds => onChange({ ...value, seconds })}
                            onFocus={() => setMode('seconds')}
                            title="Seconds"
                            value={value.seconds}
                        />
                    </>
                )}
                {format === '12h' && (
                    <button className="time-picker__period" disabled={disabled} onClick={togglePeriod} type="button">
                        {isPM ? 'PM' : 'AM'}
                    </button>
                )}
            </div>

            {showClock && (
                <AnalogClock
                    disabled={disabled}
                    format={format}
                    minuteStep={minuteStep}
                    mode={mode}
                    onChange={onChange}
                    onModeChange={setMode}
                    showHeader={false}
                    size={clockSize}
                    value={value}
                    withSeconds={withSeconds}
                />
            )}
        </div>
    );
};
