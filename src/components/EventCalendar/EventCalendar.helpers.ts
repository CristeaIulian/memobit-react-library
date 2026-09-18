import { addDays, isSameDay } from '../../helpers/Datetime';

import { CalendarDayBucket, CalendarEvent } from './EventCalendar.types';

export const MINUTES_PER_DAY = 1440;

/** Midnight of the given day, in local time. */
export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** The `firstDayOfWeek`-aligned week containing `date`. */
export const startOfWeek = (date: Date, firstDayOfWeek: 0 | 1): Date => {
    const day = date.getDay();
    const diff = (day - firstDayOfWeek + 7) % 7;
    return addDays(startOfDay(date), -diff);
};

export const getWeekDays = (date: Date, firstDayOfWeek: 0 | 1): Date[] => {
    const start = startOfWeek(date, firstDayOfWeek);
    return Array.from({ length: 7 }, (_, index) => addDays(start, index));
};

export const minutesFromMidnight = (date: Date): number => date.getHours() * 60 + date.getMinutes();

export const getEventEnd = (event: CalendarEvent, defaultDurationMinutes: number): Date =>
    event.end ?? new Date(event.start.getTime() + defaultDurationMinutes * 60000);

/**
 * Buckets events onto the given days. A timed event lands on the day it starts;
 * an all-day event spans every day between its start and end inclusive, so a
 * multi-day event shows up in each cell it covers.
 */
export const bucketEventsByDay = <T>(events: CalendarEvent<T>[], days: Date[]): CalendarDayBucket<T>[] =>
    days.map(date => {
        const allDay: CalendarEvent<T>[] = [];
        const timed: CalendarEvent<T>[] = [];

        events.forEach(event => {
            if (event.allDay) {
                const spanStart = startOfDay(event.start);
                const spanEnd = startOfDay(event.end ?? event.start);
                if (date >= spanStart && date <= spanEnd) {
                    allDay.push(event);
                }
                return;
            }

            if (isSameDay(event.start, date)) {
                timed.push(event);
            }
        });

        timed.sort((a, b) => a.start.getTime() - b.start.getTime());

        return { date, allDay, timed };
    });

export interface PositionedEvent<T = unknown> {
    event: CalendarEvent<T>;
    /** Percentages of the day column, ready for absolute positioning. */
    top: number;
    height: number;
    left: number;
    width: number;
}

/**
 * Lays timed events out inside a day column. Events that overlap in time are split
 * into side-by-side lanes; a run of non-overlapping events reclaims the full width.
 */
export const layoutDayEvents = <T>(
    events: CalendarEvent<T>[],
    dayStartHour: number,
    dayEndHour: number,
    defaultDurationMinutes: number
): PositionedEvent<T>[] => {
    if (events.length === 0) {
        return [];
    }

    const windowStart = dayStartHour * 60;
    const windowEnd = dayEndHour * 60;
    const windowSpan = Math.max(windowEnd - windowStart, 1);

    const spans = events.map(event => {
        const rawStart = minutesFromMidnight(event.start);
        const rawEnd = Math.max(minutesFromMidnight(getEventEnd(event, defaultDurationMinutes)), rawStart + 15);
        return { event, start: rawStart, end: rawEnd };
    });

    // Group into clusters of transitively overlapping events; each cluster gets its own lanes.
    const positioned: PositionedEvent<T>[] = [];
    let cluster: typeof spans = [];
    let clusterEnd = -1;

    const flushCluster = () => {
        if (cluster.length === 0) {
            return;
        }

        const lanes: number[] = [];
        const laneOf = new Map<CalendarEvent<T>, number>();

        cluster.forEach(span => {
            let lane = lanes.findIndex(end => end <= span.start);
            if (lane === -1) {
                lane = lanes.length;
            }
            lanes[lane] = span.end;
            laneOf.set(span.event, lane);
        });

        const laneCount = lanes.length;

        cluster.forEach(span => {
            const lane = laneOf.get(span.event) ?? 0;
            const top = ((span.start - windowStart) / windowSpan) * 100;
            const height = ((span.end - span.start) / windowSpan) * 100;

            positioned.push({
                event: span.event,
                top: Math.max(top, 0),
                height: Math.min(Math.max(height, 1.5), 100 - Math.max(top, 0)),
                left: (lane / laneCount) * 100,
                width: (1 / laneCount) * 100,
            });
        });

        cluster = [];
        clusterEnd = -1;
    };

    [...spans]
        .sort((a, b) => a.start - b.start || a.end - b.end)
        .forEach(span => {
            if (cluster.length > 0 && span.start >= clusterEnd) {
                flushCluster();
            }
            cluster.push(span);
            clusterEnd = Math.max(clusterEnd, span.end);
        });

    flushCluster();

    return positioned;
};

/**
 * Moves an event to `target`. In month view the original time of day is preserved
 * (`keepTimeOfDay`); in week view the dropped slot supplies the new time.
 */
export const buildDroppedStart = (event: CalendarEvent, target: Date, keepTimeOfDay: boolean): Date => {
    if (!keepTimeOfDay) {
        return new Date(target);
    }

    const next = startOfDay(target);
    next.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);
    return next;
};

export const formatHourLabel = (hour: number): string => `${hour.toString().padStart(2, '0')}:00`;

export const formatEventTime = (date: Date): string => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
