import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, CalendarProps, CalendarDateRange } from '../Calendar';
import { formatDate } from '../../helpers/Datetime';
import './DatePicker.scss';

export interface DatePickerProps extends Omit<CalendarProps, 'onChange' | 'value'> {
    value?: Date | CalendarDateRange | Date[];
    onChange?: (value: Date | CalendarDateRange | Date[] | undefined) => void;
    withTime?: boolean;
    timeFormat?: '12h' | '24h';
    withSeconds?: boolean;
    dateFormat?: string;
    placeholder?: string;
    disabled?: boolean;
    clearable?: boolean;
    autoClose?: boolean;
    alwaysOpen?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    mode = 'single',
    withTime = false,
    timeFormat = '24h',
    withSeconds = false,
    dateFormat = 'YYYY-MM-DD',
    placeholder = 'Select date...',
    disabled = false,
    clearable = true,
    autoClose = true,
    alwaysOpen = false,
    ...calendarProps
}: DatePickerProps) => {
    const [isOpenInternal, setIsOpenInternal] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isPM, setIsPM] = useState(false);
    const [rangeStart, setRangeStart] = useState<Date | null>(null);

    const inputRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (withTime && value instanceof Date) {
            setHours(timeFormat === '12h' ? value.getHours() % 12 || 12 : value.getHours());
            setMinutes(value.getMinutes());
            setSeconds(value.getSeconds());
            setIsPM(value.getHours() >= 12);
        }
    }, [value, withTime, timeFormat]);

    const isOpen = alwaysOpen ? !disabled : isOpenInternal;

    useEffect(() => {
        if (alwaysOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                inputRef.current &&
                dropdownRef.current &&
                !inputRef.current.contains(event.target as Node) &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setRangeStart(null);
                setIsOpenInternal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [alwaysOpen, isOpen]);

    const formatDisplayValue = (): string => {
        if (!value) return '';

        if (mode === 'single' && value instanceof Date) {
            const formattedDate = formatDate(value, dateFormat);
            if (withTime) {
                const timeStr = withSeconds ? formatDate(value, 'HH:mm:ss') : formatDate(value, 'HH:mm');
                return `${formattedDate} ${timeStr}`;
            }
            return formattedDate;
        }

        if (mode === 'range' && value && 'start' in value) {
            const startStr = formatDate(value.start, dateFormat);
            const endStr = formatDate(value.end, dateFormat);
            return `${startStr} - ${endStr}`;
        }

        if (mode === 'multiple' && Array.isArray(value)) {
            return value.map(d => formatDate(d, dateFormat)).join(', ');
        }

        return '';
    };

    const handleCalendarChange = (newValue: Date | CalendarDateRange | Date[] | undefined) => {
        if (!withTime || !(newValue instanceof Date)) {
            onChange?.(newValue);
            if (autoClose && mode !== 'multiple' && !alwaysOpen) {
                setIsOpenInternal(false);
            }
            return;
        }

        const updatedDate = new Date(newValue);
        const actualHours = timeFormat === '12h' ? (isPM ? (hours % 12) + 12 : hours % 12) : hours;
        updatedDate.setHours(actualHours, minutes, seconds);

        onChange?.(updatedDate);
        if (autoClose && !alwaysOpen) {
            setIsOpenInternal(false);
        }
    };

    const handleTimeChange = () => {
        if (!value || !(value instanceof Date)) return;

        const updatedDate = new Date(value);
        const actualHours = timeFormat === '12h' ? (isPM ? (hours % 12) + 12 : hours % 12) : hours;
        updatedDate.setHours(actualHours, minutes, seconds);
        onChange?.(updatedDate);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRangeStart(null);
        onChange?.(undefined);
    };

    const getDropdownPosition = (): React.CSSProperties => {
        if (!inputRef.current) return {};

        const rect = inputRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 400;

        const spaceBelow = viewportHeight - rect.bottom;
        const shouldShowAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

        return {
            position: 'fixed',
            left: `${rect.left}px`,
            top: shouldShowAbove ? `${rect.top - dropdownHeight - 8}px` : `${rect.bottom + 8}px`,
            zIndex: 1000,
        };
    };

    const displayValue = formatDisplayValue();

    return (
        <div className="datepicker">
            <div
                ref={inputRef}
                className={`datepicker__input ${disabled ? 'datepicker__input--disabled' : ''} ${isOpen ? 'datepicker__input--open' : ''}`}
                onClick={() => {
                    if (disabled || alwaysOpen) return;
                    if (isOpen) {
                        setRangeStart(null);
                    }
                    setIsOpenInternal(!isOpen);
                }}
            >
                <span className={`datepicker__value ${!displayValue ? 'datepicker__value--placeholder' : ''}`}>{displayValue || placeholder}</span>
                <div className="datepicker__actions">
                    {clearable && displayValue && (
                        <button type="button" className="datepicker__clear" onClick={handleClear} aria-label="Clear">
                            ×
                        </button>
                    )}
                    <span className="datepicker__icon">📅</span>
                </div>
            </div>

            {isOpen &&
                (alwaysOpen ? (
                    <div ref={dropdownRef} className="datepicker__dropdown datepicker__dropdown--inline">
                        <Calendar
                            {...calendarProps}
                            mode={mode}
                            value={value}
                            onChange={handleCalendarChange}
                            rangeStart={mode === 'range' ? rangeStart : calendarProps.rangeStart}
                            onRangeStartChange={mode === 'range' ? setRangeStart : calendarProps.onRangeStartChange}
                        />

                        {withTime && mode === 'single' && value instanceof Date && (
                            <div className="datepicker__time">
                                <div className="datepicker__time-label">Time</div>
                                <div className="datepicker__time-inputs">
                                    <input
                                        type="number"
                                        className="datepicker__time-input"
                                        value={hours}
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            const max = timeFormat === '12h' ? 12 : 23;
                                            setHours(Math.min(Math.max(val, 0), max));
                                        }}
                                        onBlur={handleTimeChange}
                                        min="0"
                                        max={timeFormat === '12h' ? '12' : '23'}
                                    />
                                    <span>:</span>
                                    <input
                                        type="number"
                                        className="datepicker__time-input"
                                        value={minutes}
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            setMinutes(Math.min(Math.max(val, 0), 59));
                                        }}
                                        onBlur={handleTimeChange}
                                        min="0"
                                        max="59"
                                    />
                                    {withSeconds && (
                                        <>
                                            <span>:</span>
                                            <input
                                                type="number"
                                                className="datepicker__time-input"
                                                value={seconds}
                                                onChange={e => {
                                                    const val = parseInt(e.target.value) || 0;
                                                    setSeconds(Math.min(Math.max(val, 0), 59));
                                                }}
                                                onBlur={handleTimeChange}
                                                min="0"
                                                max="59"
                                            />
                                        </>
                                    )}
                                    {timeFormat === '12h' && (
                                        <button
                                            type="button"
                                            className="datepicker__time-period"
                                            onClick={() => {
                                                setIsPM(!isPM);
                                                setTimeout(handleTimeChange, 0);
                                            }}
                                        >
                                            {isPM ? 'PM' : 'AM'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    createPortal(
                        <div ref={dropdownRef} className="datepicker__dropdown" style={getDropdownPosition()}>
                            <Calendar
                                {...calendarProps}
                                mode={mode}
                                value={value}
                                onChange={handleCalendarChange}
                                rangeStart={mode === 'range' ? rangeStart : calendarProps.rangeStart}
                                onRangeStartChange={mode === 'range' ? setRangeStart : calendarProps.onRangeStartChange}
                            />

                            {withTime && mode === 'single' && value instanceof Date && (
                                <div className="datepicker__time">
                                    <div className="datepicker__time-label">Time</div>
                                    <div className="datepicker__time-inputs">
                                        <input
                                            type="number"
                                            className="datepicker__time-input"
                                            value={hours}
                                            onChange={e => {
                                                const val = parseInt(e.target.value) || 0;
                                                const max = timeFormat === '12h' ? 12 : 23;
                                                setHours(Math.min(Math.max(val, 0), max));
                                            }}
                                            onBlur={handleTimeChange}
                                            min="0"
                                            max={timeFormat === '12h' ? '12' : '23'}
                                        />
                                        <span>:</span>
                                        <input
                                            type="number"
                                            className="datepicker__time-input"
                                            value={minutes}
                                            onChange={e => {
                                                const val = parseInt(e.target.value) || 0;
                                                setMinutes(Math.min(Math.max(val, 0), 59));
                                            }}
                                            onBlur={handleTimeChange}
                                            min="0"
                                            max="59"
                                        />
                                        {withSeconds && (
                                            <>
                                                <span>:</span>
                                                <input
                                                    type="number"
                                                    className="datepicker__time-input"
                                                    value={seconds}
                                                    onChange={e => {
                                                        const val = parseInt(e.target.value) || 0;
                                                        setSeconds(Math.min(Math.max(val, 0), 59));
                                                    }}
                                                    onBlur={handleTimeChange}
                                                    min="0"
                                                    max="59"
                                                />
                                            </>
                                        )}
                                        {timeFormat === '12h' && (
                                            <button
                                                type="button"
                                                className="datepicker__time-period"
                                                onClick={() => {
                                                    setIsPM(!isPM);
                                                    setTimeout(handleTimeChange, 0);
                                                }}
                                            >
                                                {isPM ? 'PM' : 'AM'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>,
                        document.body
                    )
                ))}
        </div>
    );
};
