import { FC, Fragment } from 'react';

import './CalendarHeatmap.scss';

export interface CalendarHeatmapDataPoint {
    date: string; // YYYY-MM-DD
    count: number;
}

export interface CalendarHeatmapProps {
    data: CalendarHeatmapDataPoint[];
    startDate: Date;
    endDate?: Date;
    colorFn?: (count: number) => string;
    countLabel?: string;
}

const DAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const defaultColorFn = (count: number): string => {
    if (count === 0) return 'var(--card-background-accent-color)';
    if (count === 1) return 'rgba(136, 132, 216, 0.35)';
    if (count <= 3) return 'rgba(136, 132, 216, 0.65)';
    return '#8884d8';
};

const toLocalDateStr = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

interface HeatmapCell {
    dateStr: string;
    displayDate: string;
    count: number;
}

export const CalendarHeatmap: FC<CalendarHeatmapProps> = ({
    data,
    startDate,
    endDate,
    colorFn = defaultColorFn,
    countLabel = 'event',
}) => {
    const rangeEnd = new Date(endDate ?? new Date());
    rangeEnd.setHours(0, 0, 0, 0);

    // Align startDate to Monday of its week
    const alignedStart = new Date(startDate);
    alignedStart.setHours(0, 0, 0, 0);
    const dayOfWeek = (alignedStart.getDay() + 6) % 7;
    alignedStart.setDate(alignedStart.getDate() - dayOfWeek);

    const countByDate = new Map(data.map(d => [d.date, d.count]));

    const weeks: Array<Array<HeatmapCell | null>> = [];
    const current = new Date(alignedStart);

    while (current <= rangeEnd) {
        const week: Array<HeatmapCell | null> = [];
        for (let d = 0; d < 7; d++) {
            if (current > rangeEnd) {
                week.push(null);
            } else {
                const dateStr = toLocalDateStr(current);
                week.push({
                    dateStr,
                    displayDate: current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    count: countByDate.get(dateStr) ?? 0,
                });
            }
            current.setDate(current.getDate() + 1);
        }
        weeks.push(week);
    }

    const monthLabels: (string | null)[] = weeks.map(week => {
        const firstCell = week.find(c => c !== null);
        if (!firstCell) return null;
        const d = new Date(firstCell.dateStr + 'T00:00:00');
        return d.getDate() <= 7 ? d.toLocaleDateString('en-US', { month: 'short' }) : null;
    });

    return (
        <div className="calendar-heatmap">
            <div className="calendar-heatmap__months">
                <div className="calendar-heatmap__spacer" />
                {monthLabels.map((label, i) => (
                    <div key={i} className="calendar-heatmap__month-label">{label ?? ''}</div>
                ))}
            </div>
            {DAY_LABELS.map((dayLabel, dayIdx) => (
                <Fragment key={dayIdx}>
                    <div className="calendar-heatmap__row">
                        <div className="calendar-heatmap__day-label">{dayLabel}</div>
                        {weeks.map((week, weekIdx) => {
                            const cell = week[dayIdx];
                            return (
                                <div
                                    key={weekIdx}
                                    className="calendar-heatmap__cell"
                                    style={{ background: cell ? colorFn(cell.count) : 'transparent' }}
                                    title={cell ? `${cell.displayDate}: ${cell.count} ${countLabel}${cell.count !== 1 ? 's' : ''}` : undefined}
                                />
                            );
                        })}
                    </div>
                </Fragment>
            ))}
            <div className="calendar-heatmap__legend">
                <span>Less</span>
                {([0, 1, 2, 4] as const).map(count => (
                    <div key={count} className="calendar-heatmap__legend-cell" style={{ background: colorFn(count) }} />
                ))}
                <span>More</span>
            </div>
        </div>
    );
};
