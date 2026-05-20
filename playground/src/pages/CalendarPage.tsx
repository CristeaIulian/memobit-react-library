import React, { useState } from 'react';
import { Calendar, CalendarDateRange } from '../../../src';

export const CalendarPage: React.FC = () => {
    const today = new Date();
    const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
    const [rangeDate, setRangeDate] = useState<CalendarDateRange | undefined>({
        start: new Date(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    const [multipleDates, setMultipleDates] = useState<Date[] | undefined>([new Date(), new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)]);
    const [controlledMonth, setControlledMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
    const [controlledRangeStart, setControlledRangeStart] = useState<Date | null>(null);

    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const disabledDates = [new Date(today.getFullYear(), today.getMonth(), 15), new Date(today.getFullYear(), today.getMonth(), 20)];

    const isWeekendDisabled = (date: Date): boolean => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const handleSingleDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        if (value instanceof Date || value === undefined) {
            setSingleDate(value);
        }
    };

    const handleRangeDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        if ((value && 'start' in value) || value === undefined) {
            setRangeDate(value as CalendarDateRange | undefined);
        }
    };

    const handleMultipleDatesChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        if (Array.isArray(value) || value === undefined) {
            setMultipleDates(value);
        }
    };

    return (
        <div className="component-page">
            <h1>Calendar</h1>
            <p>A flexible calendar component that supports single date, range, and multiple date selection modes with extensive customization options.</p>

            <section className="page-section">
                <h2>Single Date Selection</h2>
                <div className="showcase-group">
                    <h3>Default Calendar</h3>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} />
                    </div>
                    <p>Selected: {singleDate ? singleDate.toLocaleDateString() : 'None'}</p>
                </div>

                <div className="showcase-group">
                    <h3>Monday First Day of Week</h3>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} firstDayOfWeek={1} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without Today Button</h3>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} showToday={false} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Range Selection</h2>
                <div className="showcase-group">
                    <h3>Date Range Picker</h3>
                    <div className="component-group">
                        <Calendar mode="range" value={rangeDate} onChange={handleRangeDateChange} />
                    </div>
                    <p>Selected: {rangeDate ? `${rangeDate.start.toLocaleDateString()} - ${rangeDate.end.toLocaleDateString()}` : 'None'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple Date Selection</h2>
                <div className="showcase-group">
                    <h3>Multiple Dates</h3>
                    <div className="component-group">
                        <Calendar mode="multiple" value={multipleDates} onChange={handleMultipleDatesChange} />
                    </div>
                    <p>Selected: {multipleDates && multipleDates.length > 0 ? multipleDates.map(d => d.toLocaleDateString()).join(', ') : 'None'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Date Constraints</h2>
                <div className="showcase-group">
                    <h3>Min/Max Dates</h3>
                    <p>
                        Restricted to current month and next month ({minDate.toLocaleDateString()} - {maxDate.toLocaleDateString()})
                    </p>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} minDate={minDate} maxDate={maxDate} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Specific Disabled Dates</h3>
                    <p>Dates 15th and 20th of current month are disabled</p>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} disabledDates={disabledDates} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled Weekends (Function)</h3>
                    <p>All weekends are disabled using a function</p>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} disabledDates={isWeekendDisabled} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Controlled Calendar State</h2>
                <div className="showcase-group">
                    <h3>Controlled Month and Range Start</h3>
                    <div className="component-group">
                        <Calendar
                            mode="range"
                            value={rangeDate}
                            onChange={handleRangeDateChange}
                            currentMonth={controlledMonth}
                            onMonthChange={setControlledMonth}
                            rangeStart={controlledRangeStart}
                            onRangeStartChange={setControlledRangeStart}
                            showHeader
                        />
                    </div>
                    <p>Visible month: {controlledMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                    <p>Range start: {controlledRangeStart ? controlledRangeStart.toLocaleDateString() : 'None'}</p>
                </div>

                <div className="showcase-group">
                    <h3>Year-only Header and Hidden Header</h3>
                    <div className="component-group">
                        <Calendar value={singleDate} onChange={handleSingleDateChange} yearOnly />
                        <Calendar value={singleDate} onChange={handleSingleDateChange} showHeader={false} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Side by Side Comparison</h2>
                <div className="showcase-group">
                    <h3>Multiple Calendars</h3>
                    <div
                        style={{
                            display: 'flex',
                            gap: '16px',
                            flexWrap: 'wrap',
                        }}
                    >
                        <Calendar value={singleDate} onChange={handleSingleDateChange} />
                        <Calendar value={singleDate} onChange={handleSingleDateChange} firstDayOfWeek={1} />
                    </div>
                </div>
            </section>
        </div>
    );
};
