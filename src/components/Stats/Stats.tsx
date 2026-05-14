import React, { ReactNode } from 'react';

import './Stats.scss';

export type StatsAlign = 'left' | 'center';
export type StatsSize = 'small' | 'medium';

export interface StatsItem {
    label: string;
    value: ReactNode;
}

export interface StatsProps {
    items: StatsItem[];
    /** Show vertical dividers between items. Default: true. */
    dividers?: boolean;
    /** Content alignment within the strip. Default: 'left'. */
    align?: StatsAlign;
    /** Visual size. Default: 'medium'. */
    size?: StatsSize;
    className?: string;
}

export const Stats: React.FC<StatsProps> = ({
    items,
    dividers = true,
    align = 'left',
    size = 'medium',
    className = '',
}) => {
    if (items.length === 0) {
        return null;
    }

    const classes = [
        'stats',
        `stats--align-${align}`,
        `stats--size-${size}`,
        dividers ? 'stats--dividers' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes}>
            {items.map((item, i) => (
                <div key={`${item.label}-${i}`} className="stats__item">
                    <span className="stats__label">{item.label}</span>
                    <span className="stats__value">{item.value}</span>
                </div>
            ))}
        </div>
    );
};
