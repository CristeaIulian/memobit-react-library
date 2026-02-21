import React, { useState } from 'react';

import { DateRangePicker } from '../../../src';

export const DateRangePickerPage: React.FC = () => {
    const [compactRange, setCompactRange] = useState<{ start?: string; end?: string }>({
        start: '2026-02-10',
        end: '2026-02-18',
    });
    const [alwaysOpenRange, setAlwaysOpenRange] = useState<{ start?: string; end?: string }>({
        start: '2026-03-05',
        end: '2026-03-12',
    });

    return (
        <div className="component-page">
            <h1>Date Range Picker</h1>
            <p>Two-month calendar range selection with compact and always-open modes.</p>

            <section className="page-section">
                <h2>Examples</h2>
                <div className="showcase-group">
                    <h3>Default (closed until opened)</h3>
                    <div className="component-group">
                        <DateRangePicker
                            label="Trip dates"
                            value={compactRange}
                            onChange={setCompactRange}
                            min="2026-01-01"
                            max="2026-12-31"
                        />
                    </div>
                    <p>
                        Selected: {compactRange.start ?? 'none'} to {compactRange.end ?? 'none'}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Always visible</h3>
                    <div className="component-group">
                        <DateRangePicker
                            label="Reporting period"
                            value={alwaysOpenRange}
                            onChange={setAlwaysOpenRange}
                            min="2026-01-01"
                            max="2026-12-31"
                            alwaysOpen
                        />
                    </div>
                    <p>
                        Selected: {alwaysOpenRange.start ?? 'none'} to {alwaysOpenRange.end ?? 'none'}
                    </p>
                </div>
            </section>
        </div>
    );
};
