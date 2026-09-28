import { useCallback, useMemo, useState } from 'react';

import { addDays, addMonths, getIsoWeek } from '../../helpers/Datetime';
import { Button } from '../Button';
import { DayAgenda } from '../DayAgenda';
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
    dayAgenda = false,
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
    showWeekNumbers = false,
    view,
}: EventCalendarProps<T>) {
    const [internalDate, setInternalDate] = useState<Date>(() => startOfDay(date ?? new Date()));
    const [internalView, setInternalView] = useState<EventCalendarView>(view ?? 'month');
    const [dragging, setDragging] = useState<CalendarEvent<T> | null>(null);
    const [agendaDate, setAgendaDate] = useState<Date | null>(null);

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

    // With the agenda on, a chip is a way into its day rather than into itself: the cell is
    // too cramped to aim at, and everything past `maxEventsPerDay` is behind "+N more" anyway.
    const openDay = useCallback((day: Date) => setAgendaDate(startOfDay(day)), []);

    const handleEventClick = useCallback(
        (event: CalendarEvent<T>) => {
            if (dayAgenda) {
                openDay(event.start);
                return;
            }
            onEventClick?.(event);
        },
        [dayAgenda, onEventClick, openDay]
    );

    const title = useMemo(() => {
        if (activeView === 'month') {
            return formatMonthTitle(activeDate);
        }

        const weekTitle = formatWeekTitle(activeDate, firstDayOfWeek);
        return showWeekNumbers ? `${weekTitle} · W${getIsoWeek(activeDate)}` : weekTitle;
    }, [activeDate, activeView, firstDayOfWeek, showWeekNumbers]);

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
        // Kept undefined when there is nothing to do with a click, so a chip does not
        // advertise itself as clickable.
        onEventClick: dayAgenda || onEventClick ? handleEventClick : undefined,
        renderEvent,
        showWeekNumbers,
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
                <EventCalendarMonth {...sharedProps} emptyLabel={emptyLabel} maxEventsPerDay={maxEventsPerDay} onOpenDay={dayAgenda ? openDay : undefined} />
            ) : (
                <EventCalendarWeek
                    {...sharedProps}
                    dayEndHour={dayEndHour}
                    dayStartHour={dayStartHour}
                    defaultDurationMinutes={defaultDurationMinutes}
                    hourHeight={hourHeight}
                />
            )}

            {agendaDate && (
                <DayAgenda<T>
                    date={agendaDate}
                    emptyLabel={emptyLabel}
                    events={events}
                    isOpen
                    onAdd={
                        onDayClick
                            ? day => {
                                  setAgendaDate(null);
                                  onDayClick(day);
                              }
                            : undefined
                    }
                    onClose={() => setAgendaDate(null)}
                    onEventClick={
                        onEventClick
                            ? event => {
                                  setAgendaDate(null);
                                  onEventClick(event);
                              }
                            : undefined
                    }
                    renderEvent={renderEvent}
                />
            )}
        </div>
    );
}
