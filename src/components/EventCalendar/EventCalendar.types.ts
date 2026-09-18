import { ReactNode } from 'react';

export type EventCalendarView = 'month' | 'week';

/**
 * Visual treatment for a chip. `ghost` is for events that are computed rather than
 * stored — a projected recurrence, say — so they read as "expected" not "booked".
 */
export type CalendarEventVariant = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted' | 'ghost' | 'done';

export interface CalendarEvent<T = unknown> {
    id: string | number;
    /** Local start. On an all-day event the time part is ignored. */
    start: Date;
    /** Local end. Defaults to `start` + `defaultDurationMinutes`. */
    end?: Date;
    /** Renders in the all-day row of the week view and without a time in the month view. */
    allDay?: boolean;
    title: string;
    variant?: CalendarEventVariant;
    /** Overrides the variant's colour. Any CSS colour — pass a theme token where possible. */
    color?: string;
    /** Set false to pin an event in place while drag-to-reschedule is on. */
    draggable?: boolean;
    /** Caller payload, handed straight back on every callback. */
    data?: T;
}

/** A day cell's worth of events, already split into all-day and timed. */
export interface CalendarDayBucket<T = unknown> {
    date: Date;
    allDay: CalendarEvent<T>[];
    timed: CalendarEvent<T>[];
}

export interface EventCalendarProps<T = unknown> {
    events: CalendarEvent<T>[];
    /** Controlled view. Falls back to internal state when `onViewChange` is omitted. */
    view?: EventCalendarView;
    onViewChange?: (view: EventCalendarView) => void;
    /** Controlled anchor date — the month or week on screen. */
    date?: Date;
    onDateChange?: (date: Date) => void;
    firstDayOfWeek?: 0 | 1;
    onEventClick?: (event: CalendarEvent<T>) => void;
    /** Fires on the empty part of a day cell (month) or an hour slot (week). */
    onDayClick?: (date: Date) => void;
    /**
     * Enables drag-to-reschedule. `nextStart` keeps the original time of day in month
     * view, and snaps to the dropped hour slot in week view.
     */
    onEventDrop?: (event: CalendarEvent<T>, nextStart: Date) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    /** Chips shown in a month cell before the rest collapse behind "+N more". */
    maxEventsPerDay?: number;
    showHeader?: boolean;
    /** Extra controls rendered in the header, between the title and the view switch. */
    headerExtra?: ReactNode;
    /** First and last hour rendered by the week view. */
    dayStartHour?: number;
    dayEndHour?: number;
    /** Height of one hour row in the week view, in pixels. */
    hourHeight?: number;
    /** Assumed length of a timed event with no `end`. */
    defaultDurationMinutes?: number;
    className?: string;
    /** Shown in a month cell's place when the whole period has no events. */
    emptyLabel?: string;
}

export interface EventCalendarViewProps<T = unknown> {
    date: Date;
    events: CalendarEvent<T>[];
    firstDayOfWeek: 0 | 1;
    draggingId: string | number | null;
    onDragStart: (event: CalendarEvent<T>) => void;
    onDragEnd: () => void;
    onDrop: (target: Date, keepTimeOfDay: boolean) => void;
    onEventClick?: (event: CalendarEvent<T>) => void;
    onDayClick?: (date: Date) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    dragEnabled: boolean;
}
