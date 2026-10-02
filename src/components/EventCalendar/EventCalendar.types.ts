import { ReactNode } from 'react';

export type EventCalendarView = 'month' | 'week';

/** Half-open [start, end): with start 9 and end 18, 17:00 is active and 18:00 is not. */
export interface CalendarActiveHours {
    start: number;
    end: number;
}

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
    /**
     * Rendered before the time and title on the default chip — an icon or a badge that
     * identifies the event at a glance. Prefer this over baking a glyph into `title`,
     * which pushes it through the same truncation as the text and cannot be coloured
     * separately. Ignored when `renderEvent` replaces the chip's contents entirely.
     */
    leading?: ReactNode;
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
    /** Adds a leading ISO week-number column to the month grid. The week view names its own period, so it needs none. */
    showWeekNumbers?: boolean;
    /**
     * Swiping the grid left or right pages to the next or previous period — the month in
     * month view, the week in week view. Touch only, so it costs a desktop nothing. Set
     * false where a horizontal drag already means something else.
     */
    swipeNavigation?: boolean;
    onEventClick?: (event: CalendarEvent<T>) => void;
    /** Fires on the empty part of a day cell (month) or an hour slot (week). */
    onDayClick?: (date: Date) => void;
    /**
     * Dragging across the month grid selects a run of days and fires this on release, with
     * `start` always the earlier end whichever way the drag went. It is how a period gets
     * created by pointing at it rather than typing two dates into a form.
     *
     * A press that never leaves its day is a click, not a selection, and goes to
     * `onDayClick` instead — so the two can both be set without competing.
     */
    onRangeSelect?: (range: { start: Date; end: Date }) => void;
    /**
     * Enables drag-to-reschedule. `nextStart` keeps the original time of day in month
     * view, and snaps to the dropped hour slot in week view.
     */
    onEventDrop?: (event: CalendarEvent<T>, nextStart: Date) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    /** Chips shown in a month cell before the rest collapse behind "+N more". */
    maxEventsPerDay?: number;
    /**
     * Routes a chip click, a "+N more" and a day number through a `DayAgenda` listing that
     * day instead of firing `onEventClick` straight away. `onEventClick` then fires from a
     * row inside the agenda, and `onDayClick` becomes its Add action. Aiming at a 16px chip
     * is the part that does not survive a phone, and a busy cell hides its events anyway.
     */
    dayAgenda?: boolean;
    showHeader?: boolean;
    /** Extra controls rendered in the header, between the title and the view switch. */
    headerExtra?: ReactNode;
    /** First and last hour rendered by the week view. */
    dayStartHour?: number;
    dayEndHour?: number;
    /**
     * The hours that matter — working hours, opening hours. Everything outside the band
     * recedes, so the part of the day worth reading is found without counting rows. Unlike
     * `dayStartHour`/`dayEndHour` this trims nothing: a 21:00 event still shows, just
     * against a quieter background. Omit to treat every hour alike.
     */
    activeHours?: CalendarActiveHours;
    /** Height of one hour row in the week view, in pixels. */
    hourHeight?: number;
    /** Assumed length of a timed event with no `end`. */
    defaultDurationMinutes?: number;
    className?: string;
    /** Shown in a month cell's place when the whole period has no events. */
    emptyLabel?: string;
}

export interface EventCalendarViewProps<T = unknown> {
    onRangeSelect?: (range: { start: Date; end: Date }) => void;
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
    showWeekNumbers: boolean;
    activeHours?: CalendarActiveHours;
}
