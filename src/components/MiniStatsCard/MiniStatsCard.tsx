import React from 'react';
import { Card } from '../Card/Card';
import './MiniStatsCard.scss';

export type MiniStatsCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type MiniStatsCardAlign = 'left' | 'center' | 'right';
export type MiniStatsCardLabelPosition = 'top' | 'bottom';
export type MiniStatsCardTrendVariant = 'success' | 'danger' | 'warning';

export interface MiniStatsCardProps {
    /** The label/title of the stat */
    label: string;
    /** The main value to display */
    value: string | number;
    /** Optional unit text (e.g., "km", "kg", "min") */
    unit?: string;
    /** Color variant for the value */
    variant?: MiniStatsCardVariant;
    /** Content alignment */
    align?: MiniStatsCardAlign;
    /** Label position */
    labelPosition?: MiniStatsCardLabelPosition;
    /** Optional trend value (percentage) */
    trend?: number;
    /** Color variant for the trend */
    trendVariant?: MiniStatsCardTrendVariant;
    /** Optional footer content */
    footer?: React.ReactNode;
    /** Additional CSS class */
    className?: string;
}

export const MiniStatsCard: React.FC<MiniStatsCardProps> = ({
    label,
    value,
    unit,
    variant = 'default',
    align = 'center',
    labelPosition = 'bottom',
    trend,
    trendVariant = 'success',
    footer,
    className = '',
}) => {
    const renderValue = () => (
        <div className={`mini-stats-card__value mini-stats-card__value--${variant}`}>
            <span className="mini-stats-card__value-number">{value}</span>
            {unit && <span className="mini-stats-card__value-unit">{unit}</span>}
        </div>
    );

    const renderLabel = () => (
        <div className="mini-stats-card__label">{label}</div>
    );

    const renderTrend = () => {
        if (trend === undefined) return null;

        const isPositive = trend > 0;
        const isNegative = trend < 0;
        const trendValue = Math.abs(trend);

        return (
            <div className={`mini-stats-card__trend mini-stats-card__trend--${trendVariant}`}>
                {isPositive && <span className="mini-stats-card__trend-arrow">↑</span>}
                {isNegative && <span className="mini-stats-card__trend-arrow">↓</span>}
                <span className="mini-stats-card__trend-value">{trendValue}%</span>
            </div>
        );
    };

    return (
        <Card className={`mini-stats-card mini-stats-card--align-${align} ${className}`} noPadding>
            <div className="mini-stats-card__content">
                {labelPosition === 'top' && renderLabel()}
                <div className="mini-stats-card__value-container">
                    {renderValue()}
                    {renderTrend()}
                </div>
                {labelPosition === 'bottom' && renderLabel()}
            </div>
            {footer && <div className="mini-stats-card__footer">{footer}</div>}
        </Card>
    );
};
