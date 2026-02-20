import React, { useState } from 'react';
import { DatePicker, CalendarDateRange } from '../../../src';

export const DatePickerPage: React.FC = () => {
    const [singleDate, setSingleDate] = useState<Date | undefined>(new Date());
    const [dateWithTime, setDateWithTime] = useState<Date | undefined>(new Date());
    const [dateWith12h, setDateWith12h] = useState<Date | undefined>(new Date());
    const [dateWithSeconds, setDateWithSeconds] = useState<Date | undefined>(new Date());
    const [rangeDate, setRangeDate] = useState<CalendarDateRange | undefined>();
    const [multipleDates, setMultipleDates] = useState<Date[] | undefined>();
    const [customFormatDate, setCustomFormatDate] = useState<Date | undefined>();
    const [birthDate, setBirthDate] = useState<Date | undefined>();

    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const handleSingleDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setSingleDate(value as Date | undefined);
    };

    const handleDateWithTimeChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setDateWithTime(value as Date | undefined);
    };

    const handleDateWith12hChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setDateWith12h(value as Date | undefined);
    };

    const handleDateWithSecondsChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setDateWithSeconds(value as Date | undefined);
    };

    const handleRangeDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setRangeDate(value as CalendarDateRange | undefined);
    };

    const handleMultipleDatesChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setMultipleDates(value as Date[] | undefined);
    };

    const handleCustomFormatDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setCustomFormatDate(value as Date | undefined);
    };

    const handleBirthDateChange = (value: Date | CalendarDateRange | Date[] | undefined) => {
        setBirthDate(value as Date | undefined);
    };

    return (
        <div className="component-page">
            <h1>DatePicker</h1>
            <p>
                An interactive date picker component combining calendar selection with an input
                field. Supports single, range, and multiple date selection, with optional time
                picking functionality.
            </p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Single Date Selection</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            placeholder="Select a date..."
                        />
                    </div>
                    <p>
                        Selected: {singleDate ? singleDate.toLocaleDateString() : 'None'}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>With Custom Date Format (DD/MM/YYYY)</h3>
                    <div className="component-group">
                        <DatePicker
                            value={customFormatDate}
                            onChange={handleCustomFormatDateChange}
                            dateFormat="DD/MM/YYYY"
                            placeholder="DD/MM/YYYY"
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled State</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            disabled
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Not Clearable</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            clearable={false}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Always Visible</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            alwaysOpen
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Time Selection</h2>
                <div className="showcase-group">
                    <h3>Date and Time (24-hour format)</h3>
                    <div className="component-group">
                        <DatePicker
                            value={dateWithTime}
                            onChange={handleDateWithTimeChange}
                            withTime
                            placeholder="Select date and time..."
                        />
                    </div>
                    <p>
                        Selected: {dateWithTime ? dateWithTime.toLocaleString() : 'None'}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Date and Time (12-hour format)</h3>
                    <div className="component-group">
                        <DatePicker
                            value={dateWith12h}
                            onChange={handleDateWith12hChange}
                            withTime
                            timeFormat="12h"
                            placeholder="Select date and time..."
                        />
                    </div>
                    <p>
                        Selected: {dateWith12h ? dateWith12h.toLocaleString() : 'None'}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Date and Time with Seconds</h3>
                    <div className="component-group">
                        <DatePicker
                            value={dateWithSeconds}
                            onChange={handleDateWithSecondsChange}
                            withTime
                            withSeconds
                            placeholder="Select date and time..."
                        />
                    </div>
                    <p>
                        Selected:{' '}
                        {dateWithSeconds
                            ? dateWithSeconds.toLocaleString('en-US', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                              })
                            : 'None'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Range Selection</h2>
                <div className="showcase-group">
                    <h3>Date Range Picker</h3>
                    <div className="component-group">
                        <DatePicker
                            mode="range"
                            value={rangeDate}
                            onChange={handleRangeDateChange}
                            placeholder="Select date range..."
                            autoClose={false}
                        />
                    </div>
                    <p>
                        Selected:{' '}
                        {rangeDate
                            ? `${rangeDate.start.toLocaleDateString()} - ${rangeDate.end.toLocaleDateString()}`
                            : 'None'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple Selection</h2>
                <div className="showcase-group">
                    <h3>Multiple Dates</h3>
                    <div className="component-group">
                        <DatePicker
                            mode="multiple"
                            value={multipleDates}
                            onChange={handleMultipleDatesChange}
                            placeholder="Select multiple dates..."
                            autoClose={false}
                        />
                    </div>
                    <p>
                        Selected:{' '}
                        {multipleDates && multipleDates.length > 0
                            ? multipleDates.map(d => d.toLocaleDateString()).join(', ')
                            : 'None'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Quick Year/Month Selection</h2>
                <div className="showcase-group">
                    <h3>Birth Date Selection</h3>
                    <p>
                        Click on the month or year in the calendar header to quickly navigate.
                        Useful for selecting dates far in the past (e.g., birth dates).
                    </p>
                    <div className="component-group">
                        <DatePicker
                            value={birthDate}
                            onChange={handleBirthDateChange}
                            placeholder="Select your birth date..."
                        />
                    </div>
                    <p>
                        Selected: {birthDate ? birthDate.toLocaleDateString() : 'None'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>With Constraints</h2>
                <div className="showcase-group">
                    <h3>Min/Max Dates</h3>
                    <p>
                        Allowed range: {minDate.toLocaleDateString()} to{' '}
                        {maxDate.toLocaleDateString()}
                    </p>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            minDate={minDate}
                            maxDate={maxDate}
                            placeholder="Select date within range..."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Monday as First Day of Week</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            firstDayOfWeek={1}
                            placeholder="Week starts Monday..."
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without Today Button</h3>
                    <div className="component-group">
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            showToday={false}
                            placeholder="No today button..."
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple DatePickers</h2>
                <div className="showcase-group">
                    <h3>Side by Side</h3>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            placeholder="Start date..."
                        />
                        <DatePicker
                            value={singleDate}
                            onChange={handleSingleDateChange}
                            placeholder="End date..."
                        />
                        <DatePicker
                            value={dateWithTime}
                            onChange={handleDateWithTimeChange}
                            withTime
                            placeholder="Date with time..."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
