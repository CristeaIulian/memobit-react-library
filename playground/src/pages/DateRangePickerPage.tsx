import React, { useState } from 'react';

import { DateRangePicker } from '../../../src';

export const DateRangePickerPage: React.FC = () => {
    const [range, setRange] = useState({ start: '2026-02-10', end: '2026-02-18' });

    return (
        <div className="component-page">
            <h1>Date Range Picker</h1>
            <p>Two-month calendar range selection.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Select a date range</h3>
                    <div className="component-group">
                        <DateRangePicker label="Trip dates" value={range} onChange={setRange} min="2026-01-01" max="2026-12-31" />
                    </div>
                    <p>
                        Selected: {range.start ?? 'none'} to {range.end ?? 'none'}
                    </p>
                </div>
            </section>
        </div>
    );
};
