import { addDays, isSameDay } from '../../helpers/Datetime';

import { CalendarActiveHours, CalendarDayBucket, CalendarEvent } from './EventCalendar.types';

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

/** Whether an hour falls inside the active band. No band means every hour counts. */
export const isActiveHour = (hour: number, activeHours?: CalendarActiveHours): boolean =>
    !activeHours || (hour >= activeHours.start && hour < activeHours.end);

export const formatHourLabel = (hour: number): string => `${hour.toString().padStart(2, '0')}:00`;

export const formatEventTime = (date: Date): string => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;


/**
 * True when an event occupies more than one calendar day, which is what earns it a bar
 * across the month grid rather than a chip inside a single cell.
 */
export const isMultiDayEvent = (event: CalendarEvent): boolean =>
    Boolean(event.allDay && event.end && startOfDay(event.end) > startOfDay(event.start));

export interface WeekSpan<T = unknown> {
    event: CalendarEvent<T>;
    /** Column indices inside this week, 0-6 inclusive, already clipped to it. */
    startIndex: number;
    endIndex: number;
    /** Stacking row, so two overlapping spans do not sit on top of each other. */
    lane: number;
    /** Whether the event really begins/ends here, as opposed to being clipped by the week. */
    isStart: boolean;
    isEnd: boolean;
}

const DAY_MS = 86400000;

/** Whole days between two midnights, DST-safe because it rounds. */
const daysBetween = (from: Date, to: Date): number => Math.round((to.getTime() - from.getTime()) / DAY_MS);

/**
 * Places the multi-day events overlapping `weekDays` into lanes, clipped to the week.
 *
 * A span is drawn once per week it touches rather than once per day: five chips reading
 * "Vacation" look like five separate tasks, where one bar reads as one period. A span
 * running over a week boundary is clipped on each side and flagged, so only the true ends
 * get a rounded cap and the middle reads as continuing.
 */
export const layoutWeekSpans = <T>(events: CalendarEvent<T>[], weekDays: Date[]): WeekSpan<T>[] => {
    if (weekDays.length === 0) {
        return [];
    }

    const weekStart = startOfDay(weekDays[0]);
    const weekEnd = startOfDay(weekDays[weekDays.length - 1]);
    const lastIndex = weekDays.length - 1;

    const overlapping = events
        .filter(isMultiDayEvent)
        .map(event => ({ event, start: startOfDay(event.start), end: startOfDay(event.end ?? event.start) }))
        .filter(({ end, start }) => end >= weekStart && start <= weekEnd)
        // Earliest first, then longest first, so the bars that cross the most of the week
        // settle into the top lanes and the row reads as a stack rather than a staircase.
        .sort((a, b) => a.start.getTime() - b.start.getTime() || b.end.getTime() - a.end.getTime());

    const laneEnds: number[] = [];

    return overlapping.map(({ end, event, start }) => {
        const startIndex = Math.max(daysBetween(weekStart, start), 0);
        const endIndex = Math.min(daysBetween(weekStart, end), lastIndex);

        let lane = laneEnds.findIndex(occupiedTo => occupiedTo < startIndex);

        if (lane === -1) {
            lane = laneEnds.length;
        }

        laneEnds[lane] = endIndex;

        return { event, startIndex, endIndex, lane, isStart: start >= weekStart, isEnd: end <= weekEnd };
    });
};
