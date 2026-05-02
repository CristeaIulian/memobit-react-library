import { FC, useId } from 'react';

export type RatingIconType = 'star' | 'bullet' | 'bar';
export type RatingVariant = 'success' | 'info' | 'warning' | 'danger';
export type RatingFilled = 'full' | 'half' | 'empty';

interface RatingIconProps {
    type: RatingIconType;
    filled: RatingFilled;
    variant: RatingVariant;
    size?: number;
}

const VARIANT_COLORS: Record<RatingVariant, string> = {
    success: 'var(--rating-color-success)',
    info: 'var(--rating-color-info)',
    warning: 'var(--rating-color-warning)',
    danger: 'var(--rating-color-danger)',
};

export const RatingIcon: FC<RatingIconProps> = ({ type, filled, variant, size = 16 }) => {
    const uid = useId();
    const gradientId = `rating-grad-${uid}`;

    const color = VARIANT_COLORS[variant];
    const empty = 'var(--rating-empty-color)';

    const fill = filled === 'full' ? color : filled === 'half' ? `url(#${gradientId})` : empty;

    const HalfGradient = () =>
        filled === 'half' ? (
            <defs>
                <linearGradient id={gradientId} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor={color} />
                    <stop offset="50%" stopColor={empty} />
                </linearGradient>
            </defs>
        ) : null;

    if (type === 'star') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <HalfGradient />
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={fill} />
            </svg>
        );
    }

    if (type === 'bullet') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <HalfGradient />
                <circle cx="12" cy="12" r="10" fill={fill} />
            </svg>
        );
    }

    if (type === 'bar') {
        // Wider aspect ratio pill — matches the bar segments in the screenshot
        const barWidth = Math.round(size * 1.75);
        const barHeight = Math.round(size * 0.5625);
        const radius = barHeight / 2;

        return (
            <svg width={barWidth} height={barHeight} viewBox={`0 0 ${barWidth} ${barHeight}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <HalfGradient />
                <rect x="0" y="0" width={barWidth} height={barHeight} rx={radius} fill={fill} />
            </svg>
        );
    }

    return null;
};
