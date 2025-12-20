import React from 'react';
import { Card } from '../Card/Card';
import './MiniStatsCard.scss';

export type MiniStatsCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface MiniStatsCardProps {
    /** The label/title of the stat */
    label: string;
    /** The main value to display */
    value: string | number;
    /** Color variant for the value */
    variant?: MiniStatsCardVariant;
    /** Additional CSS class */
    className?: string;
}

export const MiniStatsCard: React.FC<MiniStatsCardProps> = ({
    label,
    value,
    variant = 'default',
    className = '',
}) => {
    return (
        <Card className={`mini-stats-card ${className}`} noPadding>
            <div className="mini-stats-card__content">
                <div className={`mini-stats-card__value mini-stats-card__value--${variant}`}>
                    {value}
                </div>
                <div className="mini-stats-card__label">{label}</div>
            </div>
        </Card>
    );
};
