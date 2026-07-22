import React, { useCallback, useEffect, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import { formatDate } from '../../helpers/Datetime';
import { Calendar, CalendarDateRange,CalendarProps } from '../Calendar';
import { Icon } from '../Icon';
import { Tooltip } from '../Tooltip';

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
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
        position: 'fixed',
        visibility: 'hidden',
    });

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

    const updateDropdownPosition = useCallback(() => {
        if (alwaysOpen || !isOpen || !inputRef.current || !dropdownRef.current) {
            return;
        }

        const anchorRect = inputRef.current.getBoundingClientRect();
        const panelRect = dropdownRef.current.getBoundingClientRect();
        const viewportMargin = 16;
        const offset = 8;
        const availableBelow = window.innerHeight - anchorRect.bottom - viewportMargin;
        const availableAbove = anchorRect.top - viewportMargin;
        const shouldShowAbove = availableBelow < panelRect.height && availableAbove > panelRect.height;

        const top = shouldShowAbove
            ? anchorRect.top - panelRect.height - offset
            : anchorRect.bottom + offset;
        const constrainedTop = Math.max(viewportMargin, Math.min(top, window.innerHeight - panelRect.height - viewportMargin));
        const constrainedLeft = Math.max(
            viewportMargin,
            Math.min(anchorRect.left, window.innerWidth - panelRect.width - viewportMargin)
        );

        setDropdownStyle({
            position: 'fixed',
            top: `${constrainedTop}px`,
            left: `${constrainedLeft}px`,
            zIndex: 1100,
        });
    }, [alwaysOpen, isOpen]);

    useEffect(() => {
        if (alwaysOpen || !isOpen) {
            setDropdownStyle({
                position: 'fixed',
                visibility: 'hidden',
            });
            return;
        }

        const animationFrame = requestAnimationFrame(() => requestAnimationFrame(updateDropdownPosition));
        window.addEventListener('resize', updateDropdownPosition);
        window.addEventListener('scroll', updateDropdownPosition, true);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', updateDropdownPosition);
            window.removeEventListener('scroll', updateDropdownPosition, true);
        };
    }, [alwaysOpen, isOpen, updateDropdownPosition]);

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
                        <Tooltip title="Clear">
                            <button type="button" className="datepicker__clear" onClick={handleClear}>
                                ×
                            </button>
                        </Tooltip>
                    )}
                    <span className="datepicker__icon"><Icon name="calendar" /></span>
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
                        <div ref={dropdownRef} className="datepicker__dropdown" style={dropdownStyle}>
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
