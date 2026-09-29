import { FC, useId } from 'react';

export type RatingIconType = 'star' | 'bullet' | 'bar' | 'emoji';
export type RatingVariant = 'success' | 'info' | 'warning' | 'danger';
export type RatingFilled = 'full' | 'half' | 'empty';

interface RatingIconProps {
    type: RatingIconType;
    filled: RatingFilled;
    variant: RatingVariant;
    size?: number;
    /** Emoji only: where this face sits on the sad (0) → happy (1) scale. */
    mood?: number;
}

const VARIANT_COLORS: Record<RatingVariant, string> = {
    success: 'var(--rating-color-success)',
    info: 'var(--rating-color-info)',
    warning: 'var(--rating-color-warning)',
    danger: 'var(--rating-color-danger)',
};

// Mouth geometry for the emoji face. The ends stay put and only the curve's control point
// travels, so a single quadratic bends from a frown through flat to a smile.
const MOUTH_START_X = 7.5;
const MOUTH_END_X = 16.5;
const MOUTH_Y = 15.5;
const MOUTH_FROWN_OFFSET = -4;
const MOUTH_SMILE_OFFSET = 4.5;

export const RatingIcon: FC<RatingIconProps> = ({ type, filled, variant, size = 16, mood = 1 }) => {
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
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <HalfGradient />
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={fill} />
            </svg>
        );
    }

    if (type === 'bullet') {
        return (
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <HalfGradient />
                <circle cx="12" cy="12" r="10" fill={fill} />
            </svg>
        );
    }

    if (type === 'emoji') {
        const clampedMood = Math.min(1, Math.max(0, mood));
        const controlY = MOUTH_Y + (MOUTH_FROWN_OFFSET + (MOUTH_SMILE_OFFSET - MOUTH_FROWN_OFFSET) * clampedMood);
        // The features are punched out in the surface colour so they read against both the
        // lit face and the muted one.
        const features = 'var(--card-background-color)';

        return (
            <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill={fill} />
                <circle cx="8.5" cy="9.5" r="1.2" fill={features} />
                <circle cx="15.5" cy="9.5" r="1.2" fill={features} />
                <path
                    d={`M ${MOUTH_START_X} ${MOUTH_Y} Q 12 ${controlY} ${MOUTH_END_X} ${MOUTH_Y}`}
                    fill="none"
                    stroke={features}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    if (type === 'bar') {
        // Wider aspect ratio pill — matches the bar segments in the screenshot
        const barWidth = Math.round(size * 1.75);
        const barHeight = Math.round(size * 0.5625);
        const radius = barHeight / 2;

        return (
            <svg width={barWidth} height={barHeight} viewBox={`0 0 ${barWidth} ${barHeight}`} xmlns="http://www.w3.org/2000/svg">
                <HalfGradient />
                <rect x="0" y="0" width={barWidth} height={barHeight} rx={radius} fill={fill} />
            </svg>
        );
    }

    return null;
};
