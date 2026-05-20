import React, { useState } from 'react';

import { DateRangePicker, type DateRangePreset } from '../../../src';

const PRESETS: DateRangePreset[] = [
    { label: '7d', days: 7 },
    { label: '14d', days: 14 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
];

export const DateRangePickerPage: React.FC = () => {
    const [compactRange, setCompactRange] = useState<{ start?: string; end?: string }>({
        start: '2026-02-10',
        end: '2026-02-18',
    });
    const [presetsRange, setPresetsRange] = useState<{ start?: string; end?: string }>({
        start: '2026-03-14',
        end: '2026-04-13',
    });
    const [alwaysOpenRange, setAlwaysOpenRange] = useState<{ start?: string; end?: string }>({
        start: '2026-03-05',
        end: '2026-03-12',
    });
    const [manualCloseRange, setManualCloseRange] = useState<{ start?: string; end?: string }>({
        start: '2026-05-01',
        end: '2026-05-10',
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
                        <DateRangePicker label="Trip dates" value={compactRange} onChange={setCompactRange} min="2026-01-01" max="2026-12-31" />
                    </div>
                    <p>
                        Selected: {compactRange.start ?? 'none'} to {compactRange.end ?? 'none'}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>With presets</h3>
                    <div className="component-group">
                        <DateRangePicker label="Date Range" value={presetsRange} onChange={setPresetsRange} presets={PRESETS} />
                    </div>
                    <p>
                        Selected: {presetsRange.start ?? 'none'} to {presetsRange.end ?? 'none'}
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

                <div className="showcase-group">
                    <h3>Manual Close</h3>
                    <div className="component-group">
                        <DateRangePicker label="Audit window" value={manualCloseRange} onChange={setManualCloseRange} autoClose={false} presets={PRESETS} />
                    </div>
                    <p>
                        Selected: {manualCloseRange.start ?? 'none'} to {manualCloseRange.end ?? 'none'}
                    </p>
                </div>
            </section>
        </div>
    );
};
