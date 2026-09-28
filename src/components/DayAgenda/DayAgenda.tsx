import { ReactNode, useEffect, useMemo, useRef } from 'react';

import { addDays, formatDate } from '../../helpers/Datetime';
import { useSwipe } from '../../hooks/useSwipe';
import { EventCalendarChip } from '../EventCalendar/EventCalendar.Chip';
import { bucketEventsByDay, formatHourLabel, isActiveHour, layoutDayEvents, startOfDay } from '../EventCalendar/EventCalendar.helpers';
import { CalendarActiveHours, CalendarEvent } from '../EventCalendar/EventCalendar.types';
import { Modal } from '../Modal';

import './DayAgenda.scss';

/** Opens on the working day rather than an empty 00:00 when nothing is scheduled. */
const DEFAULT_SCROLL_HOUR = 8;

const noop = (): void => {};

export interface DayAgendaProps<T = unknown> {
    /** The day to lay out. Only the date part is read. */
    date: Date;
    /**
     * The same array the calendar is given — the day's events are picked out here, so the
     * caller never has to keep a second, pre-filtered copy in sync.
     */
    events: CalendarEvent<T>[];
    isOpen: boolean;
    onClose: () => void;
    /**
     * Enables swiping the grid left or right to step a day. Without it the modal shows
     * only the day it was opened on — which is fine for a one-off, but on a phone the
     * neighbouring day is usually the next thing wanted.
     */
    onDateChange?: (date: Date) => void;
    onEventClick?: (event: CalendarEvent<T>) => void;
    /**
     * Fires with the hour slot that was clicked, so something added from an empty stretch
     * starts at the time pointed at rather than at midnight. Also backs the footer button,
     * which passes the day itself for an entry with no particular time.
     */
    onAdd?: (date: Date) => void;
    addLabel?: string;
    /** Replaces a chip's contents. */
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    emptyLabel?: string;
    /** First and last hour rendered. */
    dayStartHour?: number;
    dayEndHour?: number;
    /**
     * The hours that matter — working hours, opening hours. Everything outside the band
     * recedes, so the part of the day worth reading is found without counting rows. It
     * trims nothing, unlike `dayStartHour`/`dayEndHour`.
     */
    activeHours?: CalendarActiveHours;
    /** Height of one hour row, in pixels. */
    hourHeight?: number;
    /** Assumed length of a timed event with no `end`. */
    defaultDurationMinutes?: number;
    className?: string;
}

/**
 * One day laid out against the clock, in a modal.
 *
 * A month cell can only carry a chip or three before the rest hide behind "+N more", and
 * those chips are too small to aim at on a phone. This is the way into a busy day: events
 * sit at the hour they actually happen, overlapping ones split into lanes, and the empty
 * stretches are themselves the target for adding something at that time.
 */
export function DayAgenda<T>({
    activeHours,
    addLabel = 'Add',
    className,
    date,
    dayEndHour = 24,
    dayStartHour = 0,
    defaultDurationMinutes = 30,
    emptyLabel = 'Nothing scheduled',
    events,
    hourHeight = 44,
    isOpen,
    onAdd,
    onClose,
    onDateChange,
    onEventClick,
    renderEvent,
}: DayAgendaProps<T>) {
    const bodyRef = useRef<HTMLDivElement>(null);

    const bucket = useMemo(() => bucketEventsByDay(events, [startOfDay(date)])[0], [date, events]);

    const hours = useMemo(() => Array.from({ length: Math.max(dayEndHour - dayStartHour, 1) }, (_, index) => dayStartHour + index), [dayStartHour, dayEndHour]);

    const positioned = useMemo(
        () => layoutDayEvents(bucket.timed, dayStartHour, dayEndHour, defaultDurationMinutes),
        [bucket.timed, dayEndHour, dayStartHour, defaultDurationMinutes]
    );

    const firstEventHour = useMemo(() => {
        const starts = bucket.timed.map(event => event.start.getHours());
        return starts.length > 0 ? Math.min(...starts) : (activeHours?.start ?? DEFAULT_SCROLL_HOUR);
    }, [activeHours, bucket.timed]);

    // A full 24-hour grid in a modal otherwise opens parked on an empty midnight.
    useEffect(() => {
        if (!isOpen || !bodyRef.current) {
            return;
        }
        bodyRef.current.scrollTop = Math.max(firstEventHour - dayStartHour - 1, 0) * hourHeight;
    }, [dayStartHour, firstEventHour, hourHeight, isOpen]);

    // Restrained hard against the vertical axis: this grid scrolls, and a scroll that
    // jumped to another day would be maddening.
    const swipe = useSwipe({
        enabled: Boolean(onDateChange),
        onSwipeLeft: () => onDateChange?.(addDays(startOfDay(date), 1)),
        onSwipeRight: () => onDateChange?.(addDays(startOfDay(date), -1)),
        restraint: 50,
    });

    const buildSlotDate = (hour: number): Date => {
        const slot = startOfDay(date);
        slot.setHours(hour, 0, 0, 0);
        return slot;
    };

    const gridHeight = hours.length * hourHeight;

    return (
        <Modal
            className={['day-agenda', className ?? ''].filter(Boolean).join(' ')}
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={onClose}
            primary={onAdd ? { text: addLabel, icon: 'plus', onClick: () => onAdd(startOfDay(date)) } : undefined}
            size="small"
            title={formatDate(date, 'DD MMM YYYY')}
            usePortal
        >
            <div className="day-agenda__weekday">
                <span>{date.toLocaleDateString(undefined, { weekday: 'long' })}</span>
                {bucket.allDay.length === 0 && bucket.timed.length === 0 && <span className="day-agenda__empty">{emptyLabel}</span>}
            </div>

            {bucket.allDay.length > 0 && (
                <div className="day-agenda__all-day">
                    <div className="day-agenda__gutter-label">All day</div>
                    <div className="day-agenda__all-day-cell">
                        {bucket.allDay.map(event => (
                            <EventCalendarChip
                                dragEnabled={false}
                                event={event}
                                isDragging={false}
                                key={event.id}
                                onClick={onEventClick}
                                onDragEnd={noop}
                                onDragStart={noop}
                                renderEvent={renderEvent}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="day-agenda__body" ref={bodyRef} {...swipe}>
                <div className="day-agenda__gutter" style={{ height: gridHeight }}>
                    {hours.map(hour => (
                        <div
                            className={['day-agenda__gutter-hour', isActiveHour(hour, activeHours) ? '' : 'day-agenda__gutter-hour--inactive']
                                .filter(Boolean)
                                .join(' ')}
                            key={hour}
                            style={{ height: hourHeight }}
                        >
                            <span>{formatHourLabel(hour)}</span>
                        </div>
                    ))}
                </div>

                <div className="day-agenda__column" style={{ height: gridHeight }}>
                    {hours.map(hour => (
                        <div
                            className={[
                                'day-agenda__slot',
                                isActiveHour(hour, activeHours) ? '' : 'day-agenda__slot--inactive',
                                onAdd ? 'day-agenda__slot--clickable' : '',
                            ]
                                .filter(Boolean)
                                .join(' ')}
                            key={hour}
                            onClick={() => onAdd?.(buildSlotDate(hour))}
                            style={{ height: hourHeight }}
                        />
                    ))}

                    {positioned.map(item => (
                        <EventCalendarChip
                            className="event-calendar__chip--positioned day-agenda__chip"
                            dragEnabled={false}
                            event={item.event}
                            isDragging={false}
                            key={item.event.id}
                            onClick={onEventClick}
                            onDragEnd={noop}
                            onDragStart={noop}
                            renderEvent={renderEvent}
                            showTime
                            style={{
                                top: `${item.top}%`,
                                height: `${item.height}%`,
                                left: `calc(${item.left}% + var(--spacing-2))`,
                                width: `calc(${item.width}% - var(--spacing-4))`,
                            }}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
}
