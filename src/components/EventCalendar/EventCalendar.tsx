import { useCallback, useMemo, useState } from 'react';

import { addDays, addMonths } from '../../helpers/Datetime';
import { Button } from '../Button';
import { ToggleButtons } from '../ToggleButtons';

import { buildDroppedStart, getWeekDays, startOfDay } from './EventCalendar.helpers';
import { EventCalendarMonth } from './EventCalendar.Month';
import { CalendarEvent, EventCalendarProps, EventCalendarView } from './EventCalendar.types';
import { EventCalendarWeek } from './EventCalendar.Week';

import './EventCalendar.scss';

const VIEW_STATES = [
    { key: 'month', label: 'Month', icon: 'calendar-month' as const },
    { key: 'week', label: 'Week', icon: 'calendar-week' as const },
];

const formatMonthTitle = (date: Date): string => date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

const shortMonth = (date: Date): string => date.toLocaleDateString(undefined, { month: 'short' });

/**
 * Composed by hand rather than through `toLocaleDateString`: asking Intl for a
 * partial field set such as day + year (no month) yields a fallback like
 * "2026 (day: 19)" instead of dropping the missing field.
 */
const formatWeekTitle = (date: Date, firstDayOfWeek: 0 | 1): string => {
    const days = getWeekDays(date, firstDayOfWeek);
    const start = days[0];
    const end = days[days.length - 1];

    if (start.getFullYear() !== end.getFullYear()) {
        return `${start.getDate()} ${shortMonth(start)} ${start.getFullYear()} – ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`;
    }

    if (start.getMonth() !== end.getMonth()) {
        return `${start.getDate()} ${shortMonth(start)} – ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`;
    }

    return `${start.getDate()} – ${end.getDate()} ${shortMonth(end)} ${end.getFullYear()}`;
};

export function EventCalendar<T>({
    className,
    date,
    dayEndHour = 24,
    dayStartHour = 0,
    defaultDurationMinutes = 30,
    emptyLabel,
    events,
    firstDayOfWeek = 0,
    headerExtra,
    hourHeight = 44,
    maxEventsPerDay = 3,
    onDateChange,
    onDayClick,
    onEventClick,
    onEventDrop,
    onViewChange,
    renderEvent,
    showHeader = true,
    view,
}: EventCalendarProps<T>) {
    const [internalDate, setInternalDate] = useState<Date>(() => startOfDay(date ?? new Date()));
    const [internalView, setInternalView] = useState<EventCalendarView>(view ?? 'month');
    const [dragging, setDragging] = useState<CalendarEvent<T> | null>(null);

    const activeDate = date ?? internalDate;
    const activeView = view ?? internalView;
    const dragEnabled = Boolean(onEventDrop);

    const changeDate = useCallback(
        (next: Date) => {
            if (onDateChange) {
                onDateChange(next);
            }
            if (!date) {
                setInternalDate(next);
            }
        },
        [date, onDateChange]
    );

    const changeView = useCallback(
        (next: EventCalendarView) => {
            if (onViewChange) {
                onViewChange(next);
            }
            if (!view) {
                setInternalView(next);
            }
        },
        [onViewChange, view]
    );

    const step = useCallback(
        (direction: -1 | 1) => {
            changeDate(activeView === 'month' ? addMonths(activeDate, direction) : addDays(activeDate, direction * 7));
        },
        [activeDate, activeView, changeDate]
    );

    const handleDrop = useCallback(
        (target: Date, keepTimeOfDay: boolean) => {
            if (!dragging || !onEventDrop) {
                return;
            }
            onEventDrop(dragging, buildDroppedStart(dragging, target, keepTimeOfDay));
            setDragging(null);
        },
        [dragging, onEventDrop]
    );

    const title = useMemo(
        () => (activeView === 'month' ? formatMonthTitle(activeDate) : formatWeekTitle(activeDate, firstDayOfWeek)),
        [activeDate, activeView, firstDayOfWeek]
    );

    const sharedProps = {
        date: activeDate,
        dragEnabled,
        draggingId: dragging?.id ?? null,
        events,
        firstDayOfWeek,
        onDayClick,
        onDragEnd: () => setDragging(null),
        onDragStart: (event: CalendarEvent<T>) => setDragging(event),
        onDrop: handleDrop,
        onEventClick,
        renderEvent,
    };

    return (
        <div className={['event-calendar', className ?? ''].filter(Boolean).join(' ')}>
            {showHeader && (
                <div className="event-calendar__header">
                    <div className="event-calendar__nav">
                        <Button icon="arrow-left" onClick={() => step(-1)} size="small" title="Previous" variant="plain" />
                        <Button onClick={() => changeDate(startOfDay(new Date()))} size="small">
                            Today
                        </Button>
                        <Button icon="arrow-right" onClick={() => step(1)} size="small" title="Next" variant="plain" />
                    </div>

                    <h2 className="event-calendar__title">{title}</h2>

                    {headerExtra && <div className="event-calendar__header-extra">{headerExtra}</div>}

                    <ToggleButtons onToggleChange={value => changeView(value as EventCalendarView)} size="small" state={activeView} states={VIEW_STATES} />
                </div>
            )}

            {activeView === 'month' ? (
                <EventCalendarMonth {...sharedProps} emptyLabel={emptyLabel} maxEventsPerDay={maxEventsPerDay} />
            ) : (
                <EventCalendarWeek
                    {...sharedProps}
                    dayEndHour={dayEndHour}
                    dayStartHour={dayStartHour}
                    defaultDurationMinutes={defaultDurationMinutes}
                    hourHeight={hourHeight}
                />
            )}
        </div>
    );
}
