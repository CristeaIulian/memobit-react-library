import { CSSProperties, ReactNode, useMemo } from 'react';

import { formatDate } from '../../helpers/Datetime';
import { bucketEventsByDay, formatEventTime, getEventEnd, startOfDay } from '../EventCalendar/EventCalendar.helpers';
import { CalendarEvent } from '../EventCalendar/EventCalendar.types';
import { Modal } from '../Modal';

import './DayAgenda.scss';

export interface DayAgendaProps<T = unknown> {
    /** The day to list. Only the date part is read. */
    date: Date;
    /**
     * The same array the calendar is given — the day's events are picked out here, so the
     * caller never has to keep a second, pre-filtered copy in sync.
     */
    events: CalendarEvent<T>[];
    isOpen: boolean;
    onClose: () => void;
    onEventClick?: (event: CalendarEvent<T>) => void;
    /** Adds a footer button that hands back the day being listed. */
    onAdd?: (date: Date) => void;
    addLabel?: string;
    /** Replaces the title of a row. The time column and colour bar stay. */
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    emptyLabel?: string;
    /** Assumed length of a timed event with no `end`, used for the row's time range. */
    defaultDurationMinutes?: number;
    className?: string;
}

/**
 * A single day's events, listed in a modal. The month grid can only show a chip or
 * three per cell before it starts hiding them behind "+N more", and the chips are too
 * small to aim at on a phone — this is the way into a busy day.
 */
export function DayAgenda<T>({
    addLabel = 'Add',
    className,
    date,
    defaultDurationMinutes = 30,
    emptyLabel = 'Nothing scheduled',
    events,
    isOpen,
    onAdd,
    onClose,
    onEventClick,
    renderEvent,
}: DayAgendaProps<T>) {
    const dayEvents = useMemo(() => {
        const [bucket] = bucketEventsByDay(events, [startOfDay(date)]);
        return [...bucket.allDay, ...bucket.timed];
    }, [date, events]);

    const formatRowTime = (event: CalendarEvent<T>): string => {
        if (event.allDay) {
            return 'All day';
        }

        const end = getEventEnd(event as CalendarEvent, defaultDurationMinutes);

        // An event with no stored end gets one assumed for layout purposes only — printing
        // that guess as a range would read as information the caller never supplied.
        return event.end ? `${formatEventTime(event.start)} – ${formatEventTime(end)}` : formatEventTime(event.start);
    };

    return (
        <Modal
            className={['day-agenda', className ?? ''].filter(Boolean).join(' ')}
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={onClose}
            primary={onAdd ? { text: addLabel, icon: 'plus', onClick: () => onAdd(date) } : undefined}
            size="small"
            title={formatDate(date, 'DD MMM YYYY')}
            usePortal
        >
            <div className="day-agenda__weekday">{date.toLocaleDateString(undefined, { weekday: 'long' })}</div>

            {dayEvents.length === 0 ? (
                <div className="day-agenda__empty">{emptyLabel}</div>
            ) : (
                <ul className="day-agenda__list">
                    {dayEvents.map(event => (
                        <li
                            className={['day-agenda__row', `day-agenda__row--${event.variant ?? 'default'}`, onEventClick ? 'day-agenda__row--clickable' : '']
                                .filter(Boolean)
                                .join(' ')}
                            key={event.id}
                            onClick={() => onEventClick?.(event)}
                            style={event.color ? ({ '--day-agenda-row-color': event.color } as CSSProperties) : undefined}
                        >
                            <span className="day-agenda__time">{formatRowTime(event)}</span>
                            <span className="day-agenda__title">{renderEvent ? renderEvent(event) : event.title}</span>
                        </li>
                    ))}
                </ul>
            )}
        </Modal>
    );
}
