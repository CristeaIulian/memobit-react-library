import { ReactNode, useMemo } from 'react';

import type { TimelineMarkerInfo, TimelineMarkersItem } from './calculateTimelineMarkers';
import { calculateTimelineMarkers } from './calculateTimelineMarkers';

import './TimelineMarkers.scss';

interface TimelineMarkersProps<T extends TimelineMarkersItem> {
    items: T[];
    renderItem: (item: T, marker: TimelineMarkerInfo) => ReactNode;
    className?: string;
}

// ─── Marker Dot ───────────────────────────────────────────────────────────────

export const TimelineMarkerDot = ({ marker, onClick }: { marker: TimelineMarkerInfo; onClick?: (e: React.MouseEvent) => void }) => {
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick?.(e);
    };

    if (marker.showYear) {
        return (
            <div className="timeline-markers__marker timeline-markers__marker--year" onClick={handleClick}>
                <div className="timeline-markers__labels">
                    <span className="timeline-markers__label timeline-markers__label--year">{marker.yearLabel}</span>
                    <span className="timeline-markers__label timeline-markers__label--date">{marker.dateLabel}</span>
                </div>
                <div className="timeline-markers__dot timeline-markers__dot--year" />
            </div>
        );
    }

    if (marker.showDate) {
        return (
            <div className="timeline-markers__marker timeline-markers__marker--date" onClick={handleClick}>
                <span className="timeline-markers__label timeline-markers__label--date">{marker.dateLabel}</span>
                <div className="timeline-markers__dot timeline-markers__dot--date" />
            </div>
        );
    }

    return (
        <div className="timeline-markers__marker timeline-markers__marker--empty" onClick={handleClick}>
            <div className="timeline-markers__dot timeline-markers__dot--small" />
        </div>
    );
};

// ─── Mobile Separator ─────────────────────────────────────────────────────────

export const TimelineMobileSeparator = ({ marker }: { marker: TimelineMarkerInfo }) => {
    if (!marker.showYear && !marker.showDate) return null;

    return (
        <div className="timeline-markers__separator">
            <span className="timeline-markers__separator-label">{marker.showYear ? marker.yearLabel : marker.dateLabel}</span>
        </div>
    );
};

// ─── Component ────────────────────────────────────────────────────────────────

export const TimelineMarkers = <T extends TimelineMarkersItem>({ items, renderItem, className }: TimelineMarkersProps<T>) => {
    const markers = useMemo(() => calculateTimelineMarkers(items), [items]);

    return (
        <div className={`timeline-markers${className ? ` ${className}` : ''}`}>
            <div className="timeline-markers__track" />
            {items.map((item, index) => {
                const marker = markers.get(index);
                if (!marker) return null;
                return renderItem(item, marker);
            })}
        </div>
    );
};
