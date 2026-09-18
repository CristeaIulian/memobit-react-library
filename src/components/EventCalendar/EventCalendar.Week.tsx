import { DragEvent, useEffect, useMemo, useRef, useState } from 'react';

import { isToday, isWeekend } from '../../helpers/Datetime';

import { EventCalendarChip } from './EventCalendar.Chip';
import { bucketEventsByDay, formatHourLabel, getWeekDays, layoutDayEvents, startOfDay } from './EventCalendar.helpers';
import { EventCalendarViewProps } from './EventCalendar.types';

const DEFAULT_SCROLL_HOUR = 8;

interface EventCalendarWeekProps<T> extends EventCalendarViewProps<T> {
    dayStartHour: number;
    dayEndHour: number;
    hourHeight: number;
    defaultDurationMinutes: number;
}

export function EventCalendarWeek<T>({
    date,
    dayEndHour,
    dayStartHour,
    defaultDurationMinutes,
    dragEnabled,
    draggingId,
    events,
    firstDayOfWeek,
    hourHeight,
    onDayClick,
    onDragEnd,
    onDragStart,
    onDrop,
    onEventClick,
    renderEvent,
}: EventCalendarWeekProps<T>) {
    const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
    const bodyRef = useRef<HTMLDivElement>(null);

    const days = useMemo(() => getWeekDays(date, firstDayOfWeek), [date, firstDayOfWeek]);
    const buckets = useMemo(() => bucketEventsByDay(events, days), [events, days]);

    const hours = useMemo(
        () => Array.from({ length: Math.max(dayEndHour - dayStartHour, 1) }, (_, index) => dayStartHour + index),
        [dayStartHour, dayEndHour]
    );

    const hasAllDay = buckets.some(bucket => bucket.allDay.length > 0);
    const gridHeight = hours.length * hourHeight;

    // A full 24-hour grid otherwise opens on an empty 00:00. Park the viewport on the
    // week's earliest event, falling back to the start of the working day.
    const firstEventHour = useMemo(() => {
        const starts = buckets.flatMap(bucket => bucket.timed.map(event => event.start.getHours()));
        return starts.length > 0 ? Math.min(...starts) : DEFAULT_SCROLL_HOUR;
    }, [buckets]);

    useEffect(() => {
        if (!bodyRef.current) {
            return;
        }
        const offsetHours = Math.max(firstEventHour - dayStartHour - 1, 0);
        bodyRef.current.scrollTop = offsetHours * hourHeight;
    }, [dayStartHour, firstEventHour, hourHeight]);

    const buildSlotDate = (day: Date, hour: number): Date => {
        const slot = startOfDay(day);
        slot.setHours(hour, 0, 0, 0);
        return slot;
    };

    const handleSlotDragOver = (dropEvent: DragEvent<HTMLDivElement>, key: string) => {
        if (!dragEnabled || draggingId === null) {
            return;
        }
        dropEvent.preventDefault();
        dropEvent.dataTransfer.dropEffect = 'move';
        setDragOverSlot(key);
    };

    return (
        <div className="event-calendar__week-view">
            <div className="event-calendar__week-head">
                <div className="event-calendar__gutter-spacer" />
                {days.map(day => (
                    <div
                        className={[
                            'event-calendar__week-day-head',
                            isToday(day) ? 'event-calendar__week-day-head--today' : '',
                            isWeekend(day) ? 'event-calendar__week-day-head--weekend' : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        key={day.toDateString()}
                    >
                        <span className="event-calendar__week-day-name">{day.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                        <span className="event-calendar__week-day-number">{day.getDate()}</span>
                    </div>
                ))}
            </div>

            {hasAllDay && (
                <div className="event-calendar__all-day">
                    <div className="event-calendar__gutter-label">All day</div>
                    {buckets.map(bucket => {
                        const key = `allday-${bucket.date.toDateString()}`;

                        return (
                            <div
                                className={['event-calendar__all-day-cell', dragOverSlot === key ? 'event-calendar__all-day-cell--drop-target' : '']
                                    .filter(Boolean)
                                    .join(' ')}
                                key={key}
                                onDragLeave={() => setDragOverSlot(current => (current === key ? null : current))}
                                onDragOver={dropEvent => handleSlotDragOver(dropEvent, key)}
                                onDrop={dropEvent => {
                                    dropEvent.preventDefault();
                                    setDragOverSlot(null);
                                    onDrop(bucket.date, true);
                                }}
                            >
                                {bucket.allDay.map(event => (
                                    <EventCalendarChip
                                        dragEnabled={dragEnabled}
                                        event={event}
                                        isDragging={draggingId === event.id}
                                        key={`${event.id}-${key}`}
                                        onClick={onEventClick}
                                        onDragEnd={onDragEnd}
                                        onDragStart={onDragStart}
                                        renderEvent={renderEvent}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="event-calendar__week-body" ref={bodyRef}>
                <div className="event-calendar__gutter" style={{ height: gridHeight }}>
                    {hours.map(hour => (
                        <div className="event-calendar__gutter-hour" key={hour} style={{ height: hourHeight }}>
                            <span>{formatHourLabel(hour)}</span>
                        </div>
                    ))}
                </div>

                {buckets.map(bucket => {
                    const positioned = layoutDayEvents(bucket.timed, dayStartHour, dayEndHour, defaultDurationMinutes);

                    return (
                        <div
                            className={['event-calendar__week-column', isToday(bucket.date) ? 'event-calendar__week-column--today' : ''].filter(Boolean).join(' ')}
                            key={bucket.date.toDateString()}
                            style={{ height: gridHeight }}
                        >
                            {hours.map(hour => {
                                const key = `${bucket.date.toDateString()}-${hour}`;

                                return (
                                    <div
                                        className={[
                                            'event-calendar__slot',
                                            dragOverSlot === key ? 'event-calendar__slot--drop-target' : '',
                                            onDayClick ? 'event-calendar__slot--clickable' : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                        key={key}
                                        onClick={() => onDayClick?.(buildSlotDate(bucket.date, hour))}
                                        onDragLeave={() => setDragOverSlot(current => (current === key ? null : current))}
                                        onDragOver={dropEvent => handleSlotDragOver(dropEvent, key)}
                                        onDrop={dropEvent => {
                                            dropEvent.preventDefault();
                                            setDragOverSlot(null);
                                            onDrop(buildSlotDate(bucket.date, hour), false);
                                        }}
                                        style={{ height: hourHeight }}
                                    />
                                );
                            })}

                            {positioned.map(item => (
                                <EventCalendarChip
                                    className="event-calendar__chip--positioned"
                                    dragEnabled={dragEnabled}
                                    event={item.event}
                                    isDragging={draggingId === item.event.id}
                                    key={item.event.id}
                                    onClick={onEventClick}
                                    onDragEnd={onDragEnd}
                                    onDragStart={onDragStart}
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
                    );
                })}
            </div>
        </div>
    );
}
