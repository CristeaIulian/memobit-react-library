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
// ─── Helpers ──────────────────────────────────────────────────────────────────

export const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};
export const formatTimelineDate = (date: Date, granularity: 'day' | 'month'): string => {
    if (granularity === 'month') {
        return date.toLocaleDateString('en-US', { month: 'long' });
    }
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
};
export const getDateKey = (date: Date, granularity: 'day' | 'month'): string => {
    if (granularity === 'month') {
        return `${date.getFullYear()}-${date.getMonth()}`;
    }
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};
export const getYearKey = (date: Date): string => date.getFullYear().toString();
export const calculateTimelineMarkers = <T extends TimelineMarkersItem>(items: T[], granularity: 'day' | 'month' = 'day'): Map<number, TimelineMarkerInfo> => {
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
