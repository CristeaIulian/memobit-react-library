import React, { ReactNode } from 'react';

import { RollingNumber } from '../RollingNumber';
import { countDecimals } from '../RollingNumber/RollingNumber.helpers';

import './Stats.scss';

export type StatsAlign = 'left' | 'center';
export type StatsSize = 'small' | 'medium';
export type StatsValueVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface StatsItem {
    label: string;
    value: ReactNode;
    variant?: StatsValueVariant;
}

export interface StatsProps {
    items: StatsItem[];
    /** Show vertical dividers between items. Default: true. */
    dividers?: boolean;
    /** Content alignment within the strip. Default: 'left'. */
    align?: StatsAlign;
    /** Visual size. Default: 'medium'. */
    size?: StatsSize;
    /** Roll numeric values to their new figure when they change. Default: true. */
    animated?: boolean;
    className?: string;
}

export const Stats: React.FC<StatsProps> = ({ items, dividers = true, align = 'left', size = 'medium', animated = true, className = '' }) => {
    if (items.length === 0) {
        return null;
    }

    const classes = ['stats', `stats--align-${align}`, `stats--size-${size}`, dividers ? 'stats--dividers' : '', className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {items.map((item, i) => (
                <div key={`${item.label}-${i}`} className="stats__item">
                    <span className="stats__label">{item.label}</span>
                    <span className={`stats__value stats__value--${item.variant ?? 'default'}`}>
                        {animated && typeof item.value === 'number' ? (
                            <RollingNumber value={item.value} decimals={countDecimals(item.value)} groupSeparator="" inheritStyle />
                        ) : (
                            item.value
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};
