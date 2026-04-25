import React, { useState, useMemo } from 'react';
import {
    getMonthMatrix,
    isSameDay,
    isToday,
    isWeekend,
    addMonths,
    isBefore,
    isAfter,
} from '../../helpers/Datetime';
import './Calendar.scss';

export type CalendarMode = 'single' | 'range' | 'multiple';
export type CalendarView = 'days' | 'months' | 'years';

export interface CalendarDateRange {
    start: Date;
    end: Date;
}

export interface CalendarProps {
    value?: Date | CalendarDateRange | Date[];
    onChange?: (value: Date | CalendarDateRange | Date[] | undefined) => void;
    mode?: CalendarMode;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[] | ((date: Date) => boolean);
    firstDayOfWeek?: 0 | 1;
    showToday?: boolean;
    yearOnly?: boolean;
    className?: string;
    currentMonth?: Date;
    onMonthChange?: (month: Date) => void;
    showHeader?: boolean;
    rangeStart?: Date | null;
    onRangeStartChange?: (date: Date | null) => void;
}

const YEARS_PER_PAGE = 12;

const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_SHORT_MONDAY_FIRST = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const Calendar: React.FC<CalendarProps> = ({
    value,
    onChange,
    mode = 'single',
    minDate,
    maxDate,
    disabledDates,
    firstDayOfWeek = 0,
    showToday = true,
    yearOnly = false,
    className = '',
    currentMonth,
    onMonthChange,
    showHeader = true,
    rangeStart,
    onRangeStartChange,
}: CalendarProps) => {
    const [internalMonth, setInternalMonth] = useState(() => {
        if (value) {
            if (value instanceof Date) {
                return new Date(value.getFullYear(), value.getMonth(), 1);
            } else if ('start' in value) {
                return new Date(value.start.getFullYear(), value.start.getMonth(), 1);
            } else if (Array.isArray(value) && value.length > 0) {
                return new Date(value[0].getFullYear(), value[0].getMonth(), 1);
            }
        }
        return new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    });

    const [view, setView] = useState<CalendarView>('days');
    const [yearsRangeStart, setYearsRangeStart] = useState(() => {
        const year = (currentMonth ?? internalMonth).getFullYear();
        return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
    });

    const [internalRangeStart, setInternalRangeStart] = useState<Date | null>(null);
    const displayMonth = currentMonth ?? internalMonth;
    const rangeStartValue = rangeStart ?? internalRangeStart;

    const monthMatrix = useMemo(() => {
        return getMonthMatrix(
            displayMonth.getFullYear(),
            displayMonth.getMonth(),
            firstDayOfWeek
        );
    }, [displayMonth, firstDayOfWeek]);

    const dayNames = firstDayOfWeek === 1 ? DAY_NAMES_SHORT_MONDAY_FIRST : DAY_NAMES_SHORT;

    const isDateDisabled = (date: Date): boolean => {
        if (minDate && isBefore(date, minDate)) return true;
        if (maxDate && isAfter(date, maxDate)) return true;

        if (disabledDates) {
            if (typeof disabledDates === 'function') {
                return disabledDates(date);
            }
            return disabledDates.some(disabledDate => isSameDay(disabledDate, date));
        }

        return false;
    };

    const isDateSelected = (date: Date): boolean => {
        if (!value) return false;

        if (mode === 'single' && value instanceof Date) {
            return isSameDay(date, value);
        }

        if (mode === 'range') {
            if (value && 'start' in value) {
                return isSameDay(date, value.start) || isSameDay(date, value.end);
            }
            if (rangeStartValue) {
                return isSameDay(date, rangeStartValue);
            }
        }

        if (mode === 'multiple' && Array.isArray(value)) {
            return value.some(selectedDate => isSameDay(selectedDate, date));
        }

        return false;
    };

    const isDateInSelectedRange = (date: Date): boolean => {
        if (mode === 'range' && value && 'start' in value) {
            const { start, end } = value;
            const dateTime = date.getTime();
            return dateTime > start.getTime() && dateTime < end.getTime();
        }
        return false;
    };

    const isDateInHoverRange = (date: Date): boolean => {
        if (mode === 'range' && rangeStartValue && !value) {
            const dateTime = date.getTime();
            const startTime = rangeStartValue.getTime();
            return dateTime > startTime;
        }
        return false;
    };

    const isCurrentMonthDate = (date: Date): boolean => {
        return date.getMonth() === displayMonth.getMonth();
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        if (mode === 'single') {
            onChange?.(date);
        } else if (mode === 'range') {
            if (!rangeStartValue) {
                if (onRangeStartChange) {
                    onRangeStartChange(date);
                } else {
                    setInternalRangeStart(date);
                    onChange?.(undefined);
                }
            } else {
                const start = isBefore(date, rangeStartValue) ? date : rangeStartValue;
                const end = isBefore(date, rangeStartValue) ? rangeStartValue : date;
                onChange?.({ start, end });
                if (onRangeStartChange) {
                    onRangeStartChange(null);
                } else {
                    setInternalRangeStart(null);
                }
            }
        } else if (mode === 'multiple') {
            const currentValues = Array.isArray(value) ? value : [];
            const existingIndex = currentValues.findIndex(d => isSameDay(d, date));

            if (existingIndex >= 0) {
                const newValues = currentValues.filter((_, index) => index !== existingIndex);
                onChange?.(newValues.length > 0 ? newValues : undefined);
            } else {
                onChange?.([...currentValues, date]);
            }
        }
    };

    const handlePreviousMonth = () => {
        const next = addMonths(displayMonth, -1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
    };

    const handleNextMonth = () => {
        const next = addMonths(displayMonth, 1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
    };

    const handleTodayClick = () => {
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        if (onMonthChange) {
            onMonthChange(nextMonth);
        } else {
            setInternalMonth(nextMonth);
        }
        setView('days');
        if (mode === 'single') {
            onChange?.(today);
        }
    };

    const handleMonthHeaderClick = () => {
        if (showHeader) {
            setView('months');
        }
    };

    const handleYearHeaderClick = () => {
        if (!showHeader) return;
        setYearsRangeStart(Math.floor(displayMonth.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE);
        setView('years');
    };

    const handleMonthSelect = (monthIndex: number) => {
        const next = new Date(displayMonth.getFullYear(), monthIndex, 1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
        setView('days');
    };

    const handleYearSelect = (year: number) => {
        const next = new Date(year, displayMonth.getMonth(), 1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
        setView('months');
    };

    const handlePreviousYears = () => {
        setYearsRangeStart(yearsRangeStart - YEARS_PER_PAGE);
    };

    const handleNextYears = () => {
        setYearsRangeStart(yearsRangeStart + YEARS_PER_PAGE);
    };

    const handlePreviousYear = () => {
        const next = new Date(displayMonth.getFullYear() - 1, displayMonth.getMonth(), 1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
    };

    const handleNextYear = () => {
        const next = new Date(displayMonth.getFullYear() + 1, displayMonth.getMonth(), 1);
        if (onMonthChange) {
            onMonthChange(next);
        } else {
            setInternalMonth(next);
        }
    };

    const getYearsInRange = (): number[] => {
        const years: number[] = [];
        for (let i = 0; i < YEARS_PER_PAGE; i++) {
            years.push(yearsRangeStart + i);
        }
        return years;
    };

    const getDayClassName = (date: Date): string => {
        const classes = ['calendar__day'];
        const currentMonth = isCurrentMonthDate(date);

        if (!currentMonth) {
            classes.push('calendar__day--other-month');
        } else {
            if (isDateSelected(date)) {
                classes.push('calendar__day--selected');
            }

            if (isDateInSelectedRange(date)) {
                classes.push('calendar__day--in-range');
            }

            if (isDateInHoverRange(date)) {
                classes.push('calendar__day--hover-range');
            }
        }

        if (isToday(date)) {
            classes.push('calendar__day--today');
        }

        if (isWeekend(date)) {
            classes.push('calendar__day--weekend');
        }

        if (isDateDisabled(date)) {
            classes.push('calendar__day--disabled');
        }

        return classes.join(' ');
    };

    const renderHeader = () => {
        if (view === 'years') {
            return (
                <div className="calendar__header">
                    <button
                        type="button"
                        className="calendar__nav-button"
                        onClick={handlePreviousYears}
                        aria-label="Previous years"
                    >
                        ‹
                    </button>
                    <div className="calendar__month-year">
                        {yearsRangeStart} - {yearsRangeStart + YEARS_PER_PAGE - 1}
                    </div>
                    <button
                        type="button"
                        className="calendar__nav-button"
                        onClick={handleNextYears}
                        aria-label="Next years"
                    >
                        ›
                    </button>
                </div>
            );
        }

        if (view === 'months') {
            return (
                <div className="calendar__header">
                    <button
                        type="button"
                        className="calendar__nav-button"
                        onClick={handlePreviousYear}
                        aria-label="Previous year"
                    >
                        ‹
                    </button>
                    <button
                        type="button"
                        className="calendar__header-button"
                        onClick={handleYearHeaderClick}
                    >
                        {displayMonth.getFullYear()}
                    </button>
                    <button
                        type="button"
                        className="calendar__nav-button"
                        onClick={handleNextYear}
                        aria-label="Next year"
                    >
                        ›
                    </button>
                </div>
            );
        }

        return (
            <div className="calendar__header">
                <button
                    type="button"
                    className="calendar__nav-button"
                    onClick={handlePreviousMonth}
                    aria-label="Previous month"
                >
                    ‹
                </button>
                <div className="calendar__month-year">
                    {yearOnly ? (
                        <span className="calendar__header-label">
                            {MONTH_NAMES[displayMonth.getMonth()]}
                        </span>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="calendar__header-button"
                                onClick={handleMonthHeaderClick}
                            >
                                {MONTH_NAMES[displayMonth.getMonth()]}
                            </button>
                            <button
                                type="button"
                                className="calendar__header-button"
                                onClick={handleYearHeaderClick}
                            >
                                {displayMonth.getFullYear()}
                            </button>
                        </>
                    )}
                </div>
                <button
                    type="button"
                    className="calendar__nav-button"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                >
                    ›
                </button>
            </div>
        );
    };

    const renderYearsGrid = () => {
        const years = getYearsInRange();
        const currentYear = new Date().getFullYear();
        const selectedYear = displayMonth.getFullYear();

        return (
            <div className="calendar__years-grid">
                {years.map(year => (
                    <button
                        key={year}
                        type="button"
                        className={`calendar__year-item ${year === selectedYear ? 'calendar__year-item--selected' : ''} ${year === currentYear ? 'calendar__year-item--current' : ''}`}
                        onClick={() => handleYearSelect(year)}
                    >
                        {year}
                    </button>
                ))}
            </div>
        );
    };

    const renderMonthsGrid = () => {
        const currentMonthIndex = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const selectedMonthIndex = displayMonth.getMonth();
        const selectedYear = displayMonth.getFullYear();

        return (
            <div className="calendar__months-grid">
                {MONTH_NAMES.map((month, index) => (
                    <button
                        key={month}
                        type="button"
                        className={`calendar__month-item ${index === selectedMonthIndex && selectedYear === displayMonth.getFullYear() ? 'calendar__month-item--selected' : ''} ${index === currentMonthIndex && currentYear === displayMonth.getFullYear() ? 'calendar__month-item--current' : ''}`}
                        onClick={() => handleMonthSelect(index)}
                    >
                        {month.substring(0, 3)}
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className={`calendar ${className}`}>
            {showHeader && renderHeader()}

            {view === 'years' && renderYearsGrid()}

            {view === 'months' && renderMonthsGrid()}

            {view === 'days' && (
                <>
                    {showToday && !yearOnly && (
                        <div className="calendar__today-section">
                            <button
                                type="button"
                                className="calendar__today-button"
                                onClick={handleTodayClick}
                            >
                                Today
                            </button>
                        </div>
                    )}

                    <div className="calendar__weekdays">
                        {dayNames.map(day => (
                            <div key={day} className="calendar__weekday">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="calendar__days">
                        {monthMatrix.map((week, weekIndex) => (
                            <div key={weekIndex} className="calendar__week">
                                {week.map((date, dayIndex) => (
                                    <button
                                        key={dayIndex}
                                        type="button"
                                        className={getDayClassName(date)}
                                        onClick={() => handleDateClick(date)}
                                        disabled={isDateDisabled(date)}
                                        aria-label={date.toDateString()}
                                    >
                                        {date.getDate()}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
