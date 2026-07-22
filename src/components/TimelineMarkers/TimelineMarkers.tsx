import { ReactNode, useMemo } from 'react';

import './TimelineMarkers.scss';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimelineMarkerInfo {
    showYear: boolean;
    showDate: boolean;
    yearLabel: string;
    dateLabel: string;
}

export interface TimelineMarkersItem {
    id: string | number;
    date: string; // YYYY-MM-DD
}

interface TimelineMarkersProps<T extends TimelineMarkersItem> {
    items: T[];
    renderItem: (item: T, marker: TimelineMarkerInfo) => ReactNode;
    className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const formatTimelineDate = (date: Date, granularity: 'day' | 'month'): string => {
    if (granularity === 'month') {
        return date.toLocaleDateString('en-US', { month: 'long' });
    }
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};

const getDateKey = (date: Date, granularity: 'day' | 'month'): string => {
    if (granularity === 'month') {
        return `${date.getFullYear()}-${date.getMonth()}`;
    }
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

const getYearKey = (date: Date): string =>
    date.getFullYear().toString();

export const calculateTimelineMarkers = <T extends TimelineMarkersItem>(
    items: T[],
    granularity: 'day' | 'month' = 'day',
): Map<number, TimelineMarkerInfo> => {
    const markers = new Map<number, TimelineMarkerInfo>();
    let lastYear: string | null = null;
    let lastDate: string | null = null;

    items.forEach((item, index) => {
        const date = parseLocalDate(item.date);
        const yearKey = getYearKey(date);
        const dateKey = getDateKey(date, granularity);

        const showYear = yearKey !== lastYear;
        const showDate = dateKey !== lastDate;

        markers.set(index, {
            showYear,
            showDate,
            yearLabel: showYear ? date.getFullYear().toString() : '',
            dateLabel: showDate ? formatTimelineDate(date, granularity) : '',
        });

        lastYear = yearKey;
        lastDate = dateKey;
    });

    return markers;
};

// ─── Marker Dot ───────────────────────────────────────────────────────────────

export const TimelineMarkerDot = ({ marker, onClick }: { marker: TimelineMarkerInfo; onClick?: (e: React.MouseEvent) => void }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(e);
    };

    if (marker.showYear) {
        return (
            <div className="timeline-markers__marker timeline-markers__marker--year" onClick={handleClick}>
                <div className="timeline-markers__labels">
                    <span className="timeline-markers__label timeline-markers__label--year">{marker.yearLabel}</span>
                    <span className="timeline-markers__label timeline-markers__label--date">{marker.dateLabel}</span>
                </div>
                <div className="timeline-markers__dot timeline-markers__dot--year" />
            </div>
        );
    }

    if (marker.showDate) {
        return (
            <div className="timeline-markers__marker timeline-markers__marker--date" onClick={handleClick}>
                <span className="timeline-markers__label timeline-markers__label--date">{marker.dateLabel}</span>
                <div className="timeline-markers__dot timeline-markers__dot--date" />
            </div>
        );
    }

    return (
        <div className="timeline-markers__marker timeline-markers__marker--empty" onClick={handleClick}>
            <div className="timeline-markers__dot timeline-markers__dot--small" />
        </div>
    );
};

// ─── Mobile Separator ─────────────────────────────────────────────────────────

export const TimelineMobileSeparator = ({ marker }: { marker: TimelineMarkerInfo }) => {
    if (!marker.showYear && !marker.showDate) return null;

    return (
        <div className="timeline-markers__separator">
            <span className="timeline-markers__separator-label">
                {marker.showYear ? marker.yearLabel : marker.dateLabel}
            </span>
        </div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TimelineMarkers = <T extends TimelineMarkersItem>({
    items,
    renderItem,
    className,
}: TimelineMarkersProps<T>) => {
    const markers = useMemo(() => calculateTimelineMarkers(items), [items]);

    return (
        <div className={`timeline-markers${className ? ` ${className}` : ''}`}>
            <div className="timeline-markers__track" />
            {items.map((item, index) => {
                const marker = markers.get(index);
                if (!marker) return null;
                return renderItem(item, marker);
            })}
        </div>
    );
};
