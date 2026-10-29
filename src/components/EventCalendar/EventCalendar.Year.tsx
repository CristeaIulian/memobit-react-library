import { CSSProperties, useMemo, useState } from 'react';

import { addDays, formatDate, getMonthMatrix, isSameDay } from '../../helpers/Datetime';
import { Button } from '../Button';
import { Popover } from '../Popover';

import { formatEventTime, isMultiDayEvent, startOfDay } from './EventCalendar.helpers';
import { CalendarEvent } from './EventCalendar.types';

/** Past this many a day stops adding dots: the popover carries the full list. */
const MAX_DOTS = 3;

interface EventCalendarYearProps<T> {
    date: Date;
    events: CalendarEvent<T>[];
    firstDayOfWeek: 0 | 1;
    emptyLabel?: string;
    /** An empty day: the same "add on this day" the month grid offers. */
    onDayClick?: (date: Date) => void;
    /** A row in a day's popover. */
    onEventClick?: (event: CalendarEvent<T>) => void;
    /** When set, the popover offers to open the whole day. */
    onOpenDay?: (date: Date) => void;
    /** A month's name, which zooms the calendar into that month. */
    onOpenMonth: (date: Date) => void;
}

const dayKey = (date: Date): string => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const getDotStyle = (event: CalendarEvent): CSSProperties | undefined =>
    event.color ? ({ '--event-calendar-chip-color': event.color } as CSSProperties) : undefined;

/**
 * Twelve small months with a dot under every day that has something on it — a map for
 * finding where things are, rather than a place to read them. A day's events open in a
 * popover; a month's name zooms into that month.
 */
export function EventCalendarYear<T>({
    date,
    emptyLabel,
    events,
    firstDayOfWeek,
    onDayClick,
    onEventClick,
    onOpenDay,
    onOpenMonth,
}: EventCalendarYearProps<T>) {
    const [openDay, setOpenDay] = useState<{ day: Date; anchor: HTMLElement } | null>(null);
    const year = date.getFullYear();

    // Every day an event touches, so a holiday dots each of its days and not only the first.
    const eventsByDay = useMemo(() => {
        const map = new Map<string, CalendarEvent<T>[]>();
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31);

        events.forEach(event => {
            const first = startOfDay(event.start);
            const last = isMultiDayEvent(event) && event.end ? startOfDay(event.end) : first;

            for (let day = first < yearStart ? yearStart : first; day <= last && day <= yearEnd; day = addDays(day, 1)) {
                const key = dayKey(day);
                map.set(key, [...(map.get(key) ?? []), event]);
            }
        });

        // All-day first, then by start time, the order a day reads in.
        map.forEach(list => list.sort((a, b) => Number(Boolean(b.allDay)) - Number(Boolean(a.allDay)) || a.start.getTime() - b.start.getTime()));

        return map;
    }, [events, year]);

    const months = useMemo(
        () => Array.from({ length: 12 }, (_, month) => ({ month, weeks: getMonthMatrix(year, month, firstDayOfWeek) })),
        [firstDayOfWeek, year]
    );

    const weekdayNames = useMemo(() => months[0].weeks[0].map(day => day.toLocaleDateString(undefined, { weekday: 'narrow' })), [months]);

    const openDayEvents = openDay ? (eventsByDay.get(dayKey(openDay.day)) ?? []) : [];
    const closePopover = () => setOpenDay(null);

    return (
        <div className="event-calendar__year">
            <div className="event-calendar__year-months">
                {months.map(({ month, weeks }) => (
                    <section className="event-calendar__year-month" key={month}>
                        <button className="event-calendar__year-month-title" onClick={() => onOpenMonth(new Date(year, month, 1))} type="button">
                            {new Date(year, month, 1).toLocaleDateString(undefined, { month: 'long' })}
                        </button>

                        <div className="event-calendar__year-weekdays">
                            {weekdayNames.map((name, index) => (
                                <span key={index}>{name}</span>
                            ))}
                        </div>

                        {weeks.map(week => (
                            <div className="event-calendar__year-week" key={week[0].toDateString()}>
                                {week.map(day => {
                                    // The matrix pads each month out to whole weeks; those days belong to
                                    // the neighbouring months, which show them themselves.
                                    if (day.getMonth() !== month) {
                                        return <span className="event-calendar__year-day event-calendar__year-day--outside" key={day.toDateString()} />;
                                    }

                                    const dayEvents = eventsByDay.get(dayKey(day)) ?? [];
                                    const hasEvents = dayEvents.length > 0;
                                    const isOpen = Boolean(openDay && isSameDay(openDay.day, day));

                                    const className = [
                                        'event-calendar__year-day',
                                        hasEvents ? 'event-calendar__year-day--has-events' : '',
                                        !hasEvents && onDayClick ? 'event-calendar__year-day--clickable' : '',
                                        isSameDay(day, new Date()) ? 'event-calendar__year-day--today' : '',
                                        isOpen ? 'event-calendar__year-day--open' : '',
                                    ]
                                        .filter(Boolean)
                                        .join(' ');

                                    return (
                                        <button
                                            className={className}
                                            key={day.toDateString()}
                                            onClick={clickEvent => {
                                                if (hasEvents) {
                                                    setOpenDay(isOpen ? null : { day, anchor: clickEvent.currentTarget });
                                                } else {
                                                    onDayClick?.(day);
                                                }
                                            }}
                                            type="button"
                                        >
                                            <span className="event-calendar__year-day-number">{day.getDate()}</span>
                                            <span className="event-calendar__year-dots">
                                                {dayEvents.slice(0, MAX_DOTS).map(event => (
                                                    <span
                                                        className={`event-calendar__year-dot event-calendar__year-dot--${event.variant ?? 'default'}`}
                                                        key={event.id}
                                                        style={getDotStyle(event)}
                                                    />
                                                ))}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </section>
                ))}
            </div>

            {eventsByDay.size === 0 && emptyLabel && <div className="event-calendar__empty">{emptyLabel}</div>}

            <Popover anchorEl={openDay?.anchor ?? null} onClose={closePopover} visible={Boolean(openDay)}>
                {openDay && (
                    <div className="event-calendar__year-popover">
                        <div className="event-calendar__year-popover-head">
                            <span className="event-calendar__year-popover-date">
                                {openDay.day.toLocaleDateString(undefined, { weekday: 'long' })}, {formatDate(openDay.day, 'DD MMM YYYY')}
                            </span>
                            {onOpenDay && (
                                <Button
                                    onClick={() => {
                                        closePopover();
                                        onOpenDay(openDay.day);
                                    }}
                                    size="small"
                                    variant="plain"
                                >
                                    Open day
                                </Button>
                            )}
                        </div>

                        <ul className="event-calendar__year-popover-list">
                            {openDayEvents.map(event => {
                                const content = (
                                    <>
                                        <span
                                            className={`event-calendar__year-dot event-calendar__year-dot--${event.variant ?? 'default'}`}
                                            style={getDotStyle(event)}
                                        />
                                        {event.leading && <span className="event-calendar__chip-leading">{event.leading}</span>}
                                        {!event.allDay && <span className="event-calendar__year-popover-time">{formatEventTime(event.start)}</span>}
                                        <span className="event-calendar__year-popover-title">{event.title}</span>
                                    </>
                                );

                                const itemClassName = `event-calendar__year-popover-item event-calendar__year-popover-item--${event.variant ?? 'default'}`;

                                return (
                                    <li key={event.id}>
                                        {onEventClick ? (
                                            <button
                                                className={`${itemClassName} event-calendar__year-popover-item--clickable`}
                                                onClick={() => {
                                                    closePopover();
                                                    onEventClick(event);
                                                }}
                                                type="button"
                                            >
                                                {content}
                                            </button>
                                        ) : (
                                            <div className={itemClassName}>{content}</div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </Popover>
        </div>
    );
}
