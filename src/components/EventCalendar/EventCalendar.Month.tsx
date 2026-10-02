import { CSSProperties, DragEvent, PointerEvent as ReactPointerEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { getIsoWeek, getMonthMatrix, isSameDay, isToday, isWeekend } from '../../helpers/Datetime';

import { EventCalendarChip } from './EventCalendar.Chip';
import { bucketEventsByDay, isMultiDayEvent, layoutWeekSpans, startOfDay } from './EventCalendar.helpers';
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
    onRangeSelect,
    renderEvent,
    showWeekNumbers,
}: EventCalendarMonthProps<T>) {
    const [expandedDay, setExpandedDay] = useState<string | null>(null);
    const [dragOverDay, setDragOverDay] = useState<string | null>(null);
    // Anchor is where the press landed, focus is the day under the pointer now. Both null
    // when nothing is being selected.
    const [selection, setSelection] = useState<{ anchor: Date; focus: Date } | null>(null);

    // Released anywhere — on the grid, off it, out of the window — so a selection can never
    // be left stuck to the pointer. The range is handed over only if it actually moved;
    // a press and release on one day is a click, and belongs to `onDayClick`.
    useEffect(() => {
        if (!selection) {
            return;
        }

        const finish = () => {
            // Read from the effect's own closure and fire outside the state update. Calling
            // the callback from inside a setState updater reaches the parent while React may
            // be mid-render — it warns about exactly that, and a strict-mode double-invoke
            // would fire the range twice.
            if (selection.anchor.getTime() !== selection.focus.getTime()) {
                const [start, end] = [selection.anchor, selection.focus].sort((a, b) => a.getTime() - b.getTime());
                onRangeSelect?.({ start, end });
            }

            setSelection(null);
        };

        window.addEventListener('pointerup', finish);
        window.addEventListener('pointercancel', finish);

        return () => {
            window.removeEventListener('pointerup', finish);
            window.removeEventListener('pointercancel', finish);
        };
    }, [onRangeSelect, selection]);

    const handleDayPointerDown = useCallback(
        (pointerEvent: ReactPointerEvent<HTMLDivElement>, day: Date) => {
            // Only a plain press on the cell itself. A chip is draggable in its own right,
            // and a secondary button should not start painting a range.
            if (!onRangeSelect || pointerEvent.button !== 0) {
                return;
            }

            if ((pointerEvent.target as HTMLElement).closest('.event-calendar__chip, button')) {
                return;
            }

            setSelection({ anchor: startOfDay(day), focus: startOfDay(day) });
        },
        [onRangeSelect]
    );

    const handleDayPointerEnter = useCallback((day: Date) => {
        setSelection(current => (current ? { ...current, focus: startOfDay(day) } : current));
    }, []);

    const isInSelection = useCallback(
        (day: Date): boolean => {
            if (!selection) {
                return false;
            }
            const time = startOfDay(day).getTime();
            const from = Math.min(selection.anchor.getTime(), selection.focus.getTime());
            const to = Math.max(selection.anchor.getTime(), selection.focus.getTime());
            return time >= from && time <= to;
        },
        [selection]
    );

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
                    const spans = layoutWeekSpans(events, week);
                    const laneCount = spans.reduce((highest, span) => Math.max(highest, span.lane + 1), 0);

                    return (
                    <div className={['event-calendar__week', isCurrentWeek ? 'event-calendar__week--current' : ''].filter(Boolean).join(' ')} key={weekIndex}>
                        {showWeekNumbers && <div className="event-calendar__week-number">{getIsoWeek(week[0])}</div>}
                        {/* The day cells get their own box so the span bars can be positioned
                            as percentages of the seven columns, without the week-number
                            gutter skewing every offset. */}
                        <div className="event-calendar__week-days" style={{ '--event-calendar-span-lanes': laneCount } as CSSProperties}>
                            {spans.length > 0 && (
                                <div className="event-calendar__week-spans">
                                    {spans.map(span => (
                                        <EventCalendarChip
                                            className={[
                                                'event-calendar__chip--span',
                                                span.isStart ? '' : 'event-calendar__chip--span-continues-before',
                                                span.isEnd ? '' : 'event-calendar__chip--span-continues-after',
                                            ]
                                                .filter(Boolean)
                                                .join(' ')}
                                            dragEnabled={dragEnabled}
                                            event={span.event}
                                            isDragging={draggingId === span.event.id}
                                            key={`${span.event.id}-span-${weekIndex}`}
                                            onClick={onEventClick}
                                            onDragEnd={onDragEnd}
                                            onDragStart={onDragStart}
                                            renderEvent={renderEvent}
                                            style={{
                                                left: `${(span.startIndex / week.length) * 100}%`,
                                                width: `${((span.endIndex - span.startIndex + 1) / week.length) * 100}%`,
                                                top: `calc(${span.lane} * var(--event-calendar-span-row))`,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                            {week.map(day => {
                            const key = day.toDateString();
                            const bucket = bucketByKey.get(key);
                            // The spanning ones are drawn as bars above; leaving them here too
                            // would show the same holiday as both a bar and five chips.
                            const dayEvents: CalendarEvent<T>[] = bucket ? [...bucket.allDay.filter(event => !isMultiDayEvent(event)), ...bucket.timed] : [];
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
                                isInSelection(day) ? 'event-calendar__day--selecting' : '',
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
                                    onPointerDown={pointerEvent => handleDayPointerDown(pointerEvent, day)}
                                    onPointerEnter={() => handleDayPointerEnter(day)}
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
                    </div>
                    );
                })}
            </div>

            {!hasAnyEvent && emptyLabel && <div className="event-calendar__empty">{emptyLabel}</div>}
        </div>
    );
}

