import React from 'react';

import './Timeline.scss';

export type TimelineVariant = 'default' | 'info' | 'success' | 'warning' | 'danger';
export type TimelineOrientation = 'vertical' | 'horizontal';
export type TimelineSize = 'sm' | 'md' | 'lg';

export interface TimelineItem {
    id: string | number;
    title: string;
    description?: string;
    timestamp?: string;
    variant?: TimelineVariant;
    icon?: React.ReactNode;
    badge?: string;
    /** Mark as the currently active/highlighted step */
    active?: boolean;
    /** Render item as faded/incomplete */
    muted?: boolean;
}

export interface TimelineProps {
    items: TimelineItem[];
    orientation?: TimelineOrientation;
    size?: TimelineSize;
    /** Show connector line between nodes */
    connected?: boolean;
    /** Animate items in on mount */
    animated?: boolean;
    className?: string;
}

const variantDotClass = (variant: TimelineVariant = 'default') => `timeline__dot timeline__dot--${variant}`;

export const Timeline: React.FC<TimelineProps> = ({ items, orientation = 'vertical', size = 'md', connected = true, animated = true, className = '' }) => {
    const rootClass = [
        'timeline',
        `timeline--${orientation}`,
        `timeline--${size}`,
        connected ? 'timeline--connected' : '',
        animated ? 'timeline--animated' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <ol className={rootClass}>
            {items.map((item, index) => {
                const itemClass = ['timeline__item', item.active ? 'timeline__item--active' : '', item.muted ? 'timeline__item--muted' : '']
                    .filter(Boolean)
                    .join(' ');

                return (
                    <li
                        key={item.id}
                        className={itemClass}
                        style={{ '--item-index': index } as React.CSSProperties}
                    >
                        {/* Node */}
                        <div className="timeline__node">
                            <div className={variantDotClass(item.variant)}>{item.icon ? <span className="timeline__dot-icon">{item.icon}</span> : null}</div>
                            {connected && index < items.length - 1 && <div className="timeline__connector" />}
                        </div>

                        {/* Content */}
                        <div className="timeline__content">
                            <div className="timeline__header">
                                <span className="timeline__title">{item.title}</span>
                                {item.badge && <span className={`timeline__badge timeline__badge--${item.variant ?? 'default'}`}>{item.badge}</span>}
                            </div>
                            {item.description && <p className="timeline__description">{item.description}</p>}
                            {item.timestamp && <time className="timeline__timestamp">{item.timestamp}</time>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};
