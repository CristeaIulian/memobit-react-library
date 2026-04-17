import React, { FC } from 'react';

import { CalendarHeatmap, type CalendarHeatmapDataPoint } from '../../../src';

const toDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const addDays = (base: Date, n: number): Date => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d;
};

// Sparse: 3 events over 30 days (impulse-tracking use case)
const today = new Date('2026-04-17');
const sparseData: CalendarHeatmapDataPoint[] = [
    { date: '2026-03-28', count: 1 },
    { date: '2026-04-08', count: 1 },
    { date: '2026-04-14', count: 2 },
];

// Dense: simulated commit-like activity over a year
const seed = (n: number) => ((n * 1103515245 + 12345) & 0x7fffffff) % 100;
const yearData: CalendarHeatmapDataPoint[] = Array.from({ length: 365 }, (_, i) => {
    const date = toDateStr(addDays(new Date('2025-04-17'), i));
    const val = seed(i * 7 + 3);
    const count = val < 35 ? Math.floor((val % 8) + 1) : 0;
    return { date, count };
}).filter(d => d.count > 0);

// Custom green color fn (for a "health streak" use case)
const greenColorFn = (count: number): string => {
    if (count === 0) return 'var(--card-background-accent-color)';
    if (count === 1) return 'rgba(34, 197, 94, 0.3)';
    if (count <= 3) return 'rgba(34, 197, 94, 0.6)';
    return '#22c55e';
};

export const CalendarHeatmapPage: FC = () => {
    return (
        <div className="component-page">
            <h1>Calendar Heatmap Component</h1>
            <p>
                A GitHub-style calendar heatmap for visualizing time-series count data. All days in the range are
                shown — empty days are rendered as zero — making data sparseness immediately visible.
            </p>

            <section className="page-section">
                <h2>Sparse Data (30 days)</h2>
                <div className="showcase-group">
                    <h3>Default — few events over a month</h3>
                    <div className="component-group">
                        <CalendarHeatmap
                            data={sparseData}
                            startDate={addDays(today, -29)}
                            endDate={today}
                            countLabel="impulse"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Dense Data (1 year)</h2>
                <div className="showcase-group">
                    <h3>Default purple scale — commit-style activity</h3>
                    <div className="component-group">
                        <CalendarHeatmap
                            data={yearData}
                            startDate={new Date('2025-04-17')}
                            endDate={today}
                            countLabel="commit"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Color Function</h2>
                <div className="showcase-group">
                    <h3>Green scale — health / streak tracking</h3>
                    <div className="component-group">
                        <CalendarHeatmap
                            data={yearData}
                            startDate={new Date('2025-04-17')}
                            endDate={today}
                            colorFn={greenColorFn}
                            countLabel="workout"
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Short Ranges</h2>
                <div className="showcase-group">
                    <h3>Last 7 days</h3>
                    <div className="component-group">
                        <CalendarHeatmap
                            data={sparseData}
                            startDate={addDays(today, -6)}
                            endDate={today}
                            countLabel="event"
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Last 6 months</h3>
                    <div className="component-group">
                        <CalendarHeatmap
                            data={yearData}
                            startDate={addDays(today, -179)}
                            endDate={today}
                            countLabel="entry"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
