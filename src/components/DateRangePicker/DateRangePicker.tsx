import React, { useMemo, useState } from 'react';

import { Calendar, type CalendarDateRange } from '../Calendar';
import { Button } from '../Button';
import { InputText } from '../InputText';
import { addMonths } from '../../helpers/Datetime';

import './DateRangePicker.scss';

interface DateRange {
    start?: string;
    end?: string;
}

export interface DateRangePickerProps {
    label?: string;
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    min?: string;
    max?: string;
}

const toDate = (value?: string) => {
    if (!value) return undefined;
    const [year, month, day] = value.split('-').map(part => Number(part));
    if (!year || !month || !day) return undefined;
    return new Date(year, month - 1, day);
};

const toKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ label, value, onChange, min, max }) => {
    const [internalRange, setInternalRange] = useState<DateRange>({});
    const [baseMonth, setBaseMonth] = useState(() => new Date());
    const [rangeStart, setRangeStart] = useState<Date | null>(null);

    const range = value ?? internalRange;
    const startDate = toDate(range.start);
    const endDate = toDate(range.end);
    const calendarValue: CalendarDateRange | undefined =
        startDate && endDate ? { start: startDate, end: endDate } : undefined;

    const updateRange = (next: DateRange) => {
        if (!value) {
            setInternalRange(next);
        }
        onChange?.(next);
    };

    const handleRangeChange = (next: Date | CalendarDateRange | Date[] | undefined) => {
        if (next && typeof next === 'object' && 'start' in next) {
            updateRange({ start: toKey(next.start), end: toKey(next.end) });
            setRangeStart(null);
        }
    };

    const handleRangeStartChange = (date: Date | null) => {
        setRangeStart(date);
    };

    const secondMonth = useMemo(() => addMonths(baseMonth, 1), [baseMonth]);

    return (
        <div className="date-range-picker">
            {label && <label className="date-range-picker__label">{label}</label>}
            <div className="date-range-picker__inputs">
                <InputText readOnly value={range.start ?? ''} placeholder="Start date" />
                <span>to</span>
                <InputText readOnly value={range.end ?? ''} placeholder="End date" />
            </div>

            <div className="date-range-picker__calendar">
                <div className="date-range-picker__nav">
                    <Button variant="default" onClick={() => setBaseMonth(addMonths(baseMonth, -1))}>
                        Prev
                    </Button>
                    <span>
                        {baseMonth.toLocaleString('default', { month: 'long' })} {baseMonth.getFullYear()} -
                        {secondMonth.toLocaleString('default', { month: 'long' })} {secondMonth.getFullYear()}
                    </span>
                    <Button variant="default" onClick={() => setBaseMonth(addMonths(baseMonth, 1))}>
                        Next
                    </Button>
                </div>

                <div className="date-range-picker__months">
                    <Calendar
                        mode="range"
                        value={calendarValue}
                        onChange={handleRangeChange}
                        rangeStart={rangeStart}
                        onRangeStartChange={handleRangeStartChange}
                        currentMonth={baseMonth}
                        onMonthChange={setBaseMonth}
                        showHeader={false}
                        showToday={false}
                        minDate={min ? toDate(min) : undefined}
                        maxDate={max ? toDate(max) : undefined}
                    />
                    <Calendar
                        mode="range"
                        value={calendarValue}
                        onChange={handleRangeChange}
                        rangeStart={rangeStart}
                        onRangeStartChange={handleRangeStartChange}
                        currentMonth={secondMonth}
                        onMonthChange={setBaseMonth}
                        showHeader={false}
                        showToday={false}
                        minDate={min ? toDate(min) : undefined}
                        maxDate={max ? toDate(max) : undefined}
                    />
                </div>
            </div>
        </div>
    );
};
