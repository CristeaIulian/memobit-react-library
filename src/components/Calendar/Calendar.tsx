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
}: CalendarProps) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
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
        const year = currentMonth.getFullYear();
        return Math.floor(year / YEARS_PER_PAGE) * YEARS_PER_PAGE;
    });

    const [rangeStart, setRangeStart] = useState<Date | null>(null);

    const monthMatrix = useMemo(() => {
        return getMonthMatrix(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            firstDayOfWeek
        );
    }, [currentMonth, firstDayOfWeek]);

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

        if (mode === 'range' && value && 'start' in value) {
            return isSameDay(date, value.start) || isSameDay(date, value.end);
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
        if (mode === 'range' && rangeStart && !value) {
            const dateTime = date.getTime();
            const startTime = rangeStart.getTime();
            return dateTime > startTime;
        }
        return false;
    };

    const isCurrentMonthDate = (date: Date): boolean => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        if (mode === 'single') {
            onChange?.(date);
        } else if (mode === 'range') {
            if (!rangeStart) {
                setRangeStart(date);
                onChange?.(undefined);
            } else {
                const start = isBefore(date, rangeStart) ? date : rangeStart;
                const end = isBefore(date, rangeStart) ? rangeStart : date;
                onChange?.({ start, end });
                setRangeStart(null);
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
        setCurrentMonth(addMonths(currentMonth, -1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    const handleTodayClick = () => {
        const today = new Date();
        setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
        setView('days');
        if (mode === 'single') {
            onChange?.(today);
        }
    };

    const handleMonthHeaderClick = () => {
        setView('months');
    };

    const handleYearHeaderClick = () => {
        setYearsRangeStart(Math.floor(currentMonth.getFullYear() / YEARS_PER_PAGE) * YEARS_PER_PAGE);
        setView('years');
    };

    const handleMonthSelect = (monthIndex: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
        setView('days');
    };

    const handleYearSelect = (year: number) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
        setView('months');
    };

    const handlePreviousYears = () => {
        setYearsRangeStart(yearsRangeStart - YEARS_PER_PAGE);
    };

    const handleNextYears = () => {
        setYearsRangeStart(yearsRangeStart + YEARS_PER_PAGE);
    };

    const handlePreviousYear = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1));
    };

    const handleNextYear = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1));
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

        if (!isCurrentMonthDate(date)) {
            classes.push('calendar__day--other-month');
        }

        if (isDateSelected(date)) {
            classes.push('calendar__day--selected');
        }

        if (isDateInSelectedRange(date)) {
            classes.push('calendar__day--in-range');
        }

        if (isDateInHoverRange(date)) {
            classes.push('calendar__day--hover-range');
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
                        {currentMonth.getFullYear()}
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
                            {MONTH_NAMES[currentMonth.getMonth()]}
                        </span>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="calendar__header-button"
                                onClick={handleMonthHeaderClick}
                            >
                                {MONTH_NAMES[currentMonth.getMonth()]}
                            </button>
                            <button
                                type="button"
                                className="calendar__header-button"
                                onClick={handleYearHeaderClick}
                            >
                                {currentMonth.getFullYear()}
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
        const selectedYear = currentMonth.getFullYear();

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
        const selectedMonthIndex = currentMonth.getMonth();
        const selectedYear = currentMonth.getFullYear();

        return (
            <div className="calendar__months-grid">
                {MONTH_NAMES.map((month, index) => (
                    <button
                        key={month}
                        type="button"
                        className={`calendar__month-item ${index === selectedMonthIndex && selectedYear === currentMonth.getFullYear() ? 'calendar__month-item--selected' : ''} ${index === currentMonthIndex && currentYear === currentMonth.getFullYear() ? 'calendar__month-item--current' : ''}`}
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
            {renderHeader()}

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
