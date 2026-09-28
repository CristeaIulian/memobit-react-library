import { DragEvent, useMemo, useState } from 'react';

import { getIsoWeek, getMonthMatrix, isSameDay, isToday, isWeekend } from '../../helpers/Datetime';

import { EventCalendarChip } from './EventCalendar.Chip';
import { bucketEventsByDay } from './EventCalendar.helpers';
import { CalendarEvent, EventCalendarViewProps } from './EventCalendar.types';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface EventCalendarMonthProps<T> extends EventCalendarViewProps<T> {
    maxEventsPerDay: number;
    emptyLabel?: string;
    /** When set, the day number and "+N more" open the day rather than expanding the cell. */
    onOpenDay?: (date: Date) => void;
}

export function EventCalendarMonth<T>({
    date,
    dragEnabled,
    draggingId,
    emptyLabel,
    events,
    firstDayOfWeek,
    maxEventsPerDay,
    onDayClick,
    onDragEnd,
    onDragStart,
    onDrop,
    onEventClick,
    onOpenDay,
    renderEvent,
    showWeekNumbers,
}: EventCalendarMonthProps<T>) {
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [dragOverDay, setDragOverDay] = useState<string | null>(null);

    const weeks = useMemo(() => getMonthMatrix(date.getFullYear(), date.getMonth(), firstDayOfWeek), [date, firstDayOfWeek]);

    const days = useMemo(() => weeks.flat(), [weeks]);
    const buckets = useMemo(() => bucketEventsByDay(events, days), [events, days]);
    const bucketByKey = useMemo(() => new Map(buckets.map(bucket => [bucket.date.toDateString(), bucket])), [buckets]);

    const headerNames = useMemo(() => (firstDayOfWeek === 1 ? [...DAY_NAMES.slice(1), DAY_NAMES[0]] : DAY_NAMES), [firstDayOfWeek]);

    const currentMonth = date.getMonth();
    const hasAnyEvent = events.length > 0;
    const today = new Date();

    const handleDrop = (dropEvent: DragEvent<HTMLDivElement>, day: Date) => {
        dropEvent.preventDefault();
        setDragOverDay(null);
        onDrop(day, true);
    };

    const handleDragOver = (dropEvent: DragEvent<HTMLDivElement>, key: string) => {
        if (!dragEnabled || draggingId === null) {
            return;
        }
        dropEvent.preventDefault();
        dropEvent.dataTransfer.dropEffect = 'move';
        setDragOverDay(key);
    };

    return (
        <div className="event-calendar__month">
            <div className="event-calendar__weekdays">
                {showWeekNumbers && <div className="event-calendar__week-number event-calendar__week-number--head">Wk</div>}
                {headerNames.map(name => (
                    <div className="event-calendar__weekday" key={name}>
                        {name}
                    </div>
                ))}
            </div>

            <div className="event-calendar__weeks">
                {weeks.map((week, weekIndex) => {
                    const isCurrentWeek = week.some(day => isSameDay(day, today));

                    return (
                    <div className={['event-calendar__week', isCurrentWeek ? 'event-calendar__week--current' : ''].filter(Boolean).join(' ')} key={weekIndex}>
                        {showWeekNumbers && <div className="event-calendar__week-number">{getIsoWeek(week[0])}</div>}
                        {week.map(day => {
                            const key = day.toDateString();
                            const bucket = bucketByKey.get(key);
                            const dayEvents: CalendarEvent<T>[] = bucket ? [...bucket.allDay, ...bucket.timed] : [];
                            const isExpanded = expandedDay === key;
                            const dayLabel =
                                day.getDate() === 1 ? `${day.toLocaleDateString(undefined, { month: 'short' })} ${day.getDate()}` : String(day.getDate());
                            const visible = isExpanded ? dayEvents : dayEvents.slice(0, maxEventsPerDay);
                            const hiddenCount = dayEvents.length - visible.length;

                            const cellClasses = [
                                'event-calendar__day',
                                day.getMonth() === currentMonth ? '' : 'event-calendar__day--outside',
                                isToday(day) ? 'event-calendar__day--today' : '',
                                isWeekend(day) ? 'event-calendar__day--weekend' : '',
                                dragOverDay === key ? 'event-calendar__day--drop-target' : '',
                                onDayClick ? 'event-calendar__day--clickable' : '',
                            ]
                                .filter(Boolean)
                                .join(' ');

                            return (
                                <div
                                    className={cellClasses}
                                    key={key}
                                    onClick={() => onDayClick?.(day)}
                                    onDragLeave={() => setDragOverDay(current => (current === key ? null : current))}
                                    onDragOver={dropEvent => handleDragOver(dropEvent, key)}
                                    onDrop={dropEvent => handleDrop(dropEvent, day)}
                                >
                                    {onOpenDay ? (
                                        <button
                                            className="event-calendar__day-number event-calendar__day-number--button"
                                            onClick={clickEvent => {
                                                clickEvent.stopPropagation();
                                                onOpenDay(day);
                                            }}
                                            type="button"
                                        >
                                            {dayLabel}
                                        </button>
                                    ) : (
                                        <div className="event-calendar__day-number">{dayLabel}</div>
                                    )}

                                    <div className="event-calendar__day-events">
                                        {visible.map(event => (
                                            <EventCalendarChip
                                                dragEnabled={dragEnabled}
                                                event={event}
                                                isDragging={draggingId === event.id}
                                                key={`${event.id}-${key}`}
                                                onClick={onEventClick}
                                                onDragEnd={onDragEnd}
                                                onDragStart={onDragStart}
                                                renderEvent={renderEvent}
                                                showTime
                                            />
                                        ))}

                                        {hiddenCount > 0 && (
                                            <button
                                                className="event-calendar__more"
                                                onClick={clickEvent => {
                                                    clickEvent.stopPropagation();
                                                    if (onOpenDay) {
                                                        onOpenDay(day);
                                                        return;
                                                    }
                                                    setExpandedDay(key);
                                                }}
                                                type="button"
                                            >
                                                +{hiddenCount} more
                                            </button>
                                        )}

                                        {isExpanded && dayEvents.length > maxEventsPerDay && (
                                            <button
                                                className="event-calendar__more"
                                                onClick={clickEvent => {
                                                    clickEvent.stopPropagation();
                                                    setExpandedDay(null);
                                                }}
                                                type="button"
                                            >
                                                Show less
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    );
                })}
            </div>

            {!hasAnyEvent && emptyLabel && <div className="event-calendar__empty">{emptyLabel}</div>}
        </div>
    );
}

