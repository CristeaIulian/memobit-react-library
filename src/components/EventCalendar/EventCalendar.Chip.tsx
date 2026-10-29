import { CSSProperties, DragEvent, MouseEvent, ReactNode } from 'react';

import { Tooltip } from '../Tooltip';

import { formatEventTime } from './EventCalendar.helpers';
import { CalendarEvent } from './EventCalendar.types';

interface EventCalendarChipProps<T> {
    event: CalendarEvent<T>;
    /** Month cells show the start time inline; week cells get it from their position. */
    showTime?: boolean;
    dragEnabled: boolean;
    isDragging: boolean;
    onDragStart: (event: CalendarEvent<T>) => void;
    onDragEnd: () => void;
    onClick?: (event: CalendarEvent<T>) => void;
    renderEvent?: (event: CalendarEvent<T>) => ReactNode;
    style?: CSSProperties;
    className?: string;
}

export function EventCalendarChip<T>({
    className,
    dragEnabled,
    event,
    isDragging,
    onClick,
    onDragEnd,
    onDragStart,
    renderEvent,
    showTime = false,
    style,
}: EventCalendarChipProps<T>) {
    const draggable = dragEnabled && event.draggable !== false;

    const handleClick = (mouseEvent: MouseEvent<HTMLDivElement>) => {
        // Without this the click also lands on the day cell behind, which would open
        // the "add on this day" flow on top of the event the user actually wanted.
        mouseEvent.stopPropagation();
        onClick?.(event);
    };

    const handleDragStart = (dragEvent: DragEvent<HTMLDivElement>) => {
        dragEvent.dataTransfer.effectAllowed = 'move';
        // Firefox refuses to start a drag unless something is written to the payload.
        dragEvent.dataTransfer.setData('text/plain', String(event.id));
        onDragStart(event);
    };

    const classes = [
        'event-calendar__chip',
        `event-calendar__chip--${event.variant ?? 'default'}`,
        isDragging ? 'event-calendar__chip--dragging' : '',
        draggable ? 'event-calendar__chip--draggable' : '',
        onClick ? 'event-calendar__chip--clickable' : '',
        className ?? '',
    ]
        .filter(Boolean)
        .join(' ');

    // A short week-view chip has no room for its time, so the tooltip carries it instead.
    const timeLabel = event.allDay ? '' : `${formatEventTime(event.start)}${event.end ? `–${formatEventTime(event.end)}` : ''}`;
    const tooltip = timeLabel ? `${timeLabel} · ${event.title}` : event.title;

    return (
        <Tooltip title={tooltip}>
            <div
                className={classes}
                draggable={draggable}
                onClick={handleClick}
                onDragEnd={onDragEnd}
                onDragStart={handleDragStart}
                style={event.color ? ({ ...style, '--event-calendar-chip-color': event.color } as CSSProperties) : style}
            >
                {renderEvent ? (
                    renderEvent(event)
                ) : (
                    <span className="event-calendar__chip-body">
                        <span className="event-calendar__chip-head">
                            {event.leading && <span className="event-calendar__chip-leading">{event.leading}</span>}
                            {showTime && !event.allDay && <span className="event-calendar__chip-time">{formatEventTime(event.start)}</span>}
                        </span>
                        <span className="event-calendar__chip-title">{event.title}</span>
                    </span>
                )}
            </div>
        </Tooltip>
    );
}
