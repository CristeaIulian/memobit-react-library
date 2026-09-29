import { FC, ReactElement, useCallback } from 'react';

import { RatingIcon, RatingIconType, RatingVariant } from './RatingIcon';

import './Rating.scss';

interface RatingProps {
    align?: 'left' | 'right' | 'space-between';
    /**
     * Emoji only: tint the chosen face by where it sits on the scale — red at the sad end,
     * amber in the middle, green at the happy end — instead of using `variant` throughout.
     */
    emojiColorByMood?: boolean;
    /** Emoji only: pixel size of each face. Faces need more room than a star to stay readable. */
    emojiSize?: number;
    icon?: RatingIconType;
    maxRate?: number;
    onHover?: (value: number) => void;
    onHoverEnd?: () => void;
    onSelect?: (value: number) => void;
    rating: number;
    selectable?: boolean;
    showValue?: boolean;
    useHalf?: boolean;
    variant?: RatingVariant;
}

// A mood scale reads best when the colour carries the sentiment too, so the lit face picks
// its variant from its own position rather than from a single `variant` for the whole row.
const getMoodVariant = (mood: number): RatingVariant => (mood < 0.3 ? 'danger' : mood < 0.6 ? 'warning' : 'success');

export const Rating: FC<RatingProps> = ({
    align = 'left',
    emojiColorByMood = true,
    emojiSize = 28,
    icon = 'star',
    maxRate = 10,
    onHover,
    onHoverEnd,
    onSelect,
    rating,
    selectable = false,
    showValue = true,
    useHalf = false,
    variant = 'warning',
}: RatingProps): ReactElement => {
    const onRateClick = useCallback(
        (value: number) => {
            if (selectable && !useHalf) {
                onSelect?.(value + 1);
            }
        },
        [selectable, useHalf, onSelect]
    );

    // ─── Emoji mood scale ─────────────────────────────────────────────────────
    // One face per step, spanning sad → happy. Unlike the other icons this is a pick-one
    // scale rather than a cumulative fill: exactly the chosen face lights up.
    if (icon === 'emoji') {
        return (
            <div className={`rating rating--emoji align-${align} ${selectable ? 'is-selectable' : ''}`} onMouseLeave={onHoverEnd}>
                <span className="rating-rates">
                    {Array.from({ length: maxRate }, (_, index) => {
                        const faceValue = index + 1;
                        const mood = maxRate === 1 ? 1 : index / (maxRate - 1);
                        const isSelected = rating === faceValue;

                        return (
                            <span
                                className={`rate rate--emoji${isSelected ? ' is-selected' : ''}`}
                                key={index}
                                onClick={() => selectable && onSelect?.(faceValue)}
                                onMouseEnter={() => onHover?.(faceValue)}
                            >
                                <RatingIcon
                                    filled={isSelected ? 'full' : 'empty'}
                                    mood={mood}
                                    size={emojiSize}
                                    type="emoji"
                                    variant={emojiColorByMood ? getMoodVariant(mood) : variant}
                                />
                            </span>
                        );
                    })}
                </span>

                {showValue && (
                    <span className="rating-values">
                        ({rating}/{maxRate})
                    </span>
                )}
            </div>
        );
    }

    // ─── Half-star selectable input ───────────────────────────────────────────
    // 5 icons × 2 halves = 10 steps (stored as 1–10)
    if (useHalf && selectable) {
        return (
            <div className={`rating rating--half rating--half-selectable align-${align} is-selectable`} onMouseLeave={onHoverEnd}>
                <span className="rating-rates">
                    {Array.from({ length: 5 }, (_, i) => {
                        const leftValue = i * 2 + 1;
                        const rightValue = i * 2 + 2;
                        const isFull = rating >= rightValue;
                        const isHalf = !isFull && rating >= leftValue;

                        const filled = isFull ? 'full' : isHalf ? 'half' : 'empty';

                        return (
                            <span key={i} className="rate rate--half-select">
                                <RatingIcon type={icon} filled={filled} variant={variant} size={24} />
                                <span className="rate-click-left" onClick={() => onSelect?.(leftValue)} onMouseEnter={() => onHover?.(leftValue)} />
                                <span className="rate-click-right" onClick={() => onSelect?.(rightValue)} onMouseEnter={() => onHover?.(rightValue)} />
                            </span>
                        );
                    })}
                </span>
            </div>
        );
    }

    // ─── Half-star display only ───────────────────────────────────────────────
    // Converts 1–10 rating to a 0.5–5 scale
    if (useHalf) {
        const ratingItem = rating / 2;
        const fullRate = Math.floor(ratingItem);
        const hasHalfRate = ratingItem % 1 >= 0.5;
        const emptyRate = 5 - fullRate - (hasHalfRate ? 1 : 0);

        return (
            <div className={`rating rating--half align-${align}`} onMouseLeave={onHoverEnd}>
                <span className="rating-rates">
                    {Array.from({ length: fullRate }, (_, index) => (
                        <span key={`full-${index}`} className="rate">
                            <RatingIcon type={icon} filled="full" variant={variant} />
                        </span>
                    ))}

                    {hasHalfRate && (
                        <span className="rate">
                            <RatingIcon type={icon} filled="half" variant={variant} />
                        </span>
                    )}

                    {Array.from({ length: emptyRate }, (_, index) => (
                        <span key={`empty-${index}`} className="rate">
                            <RatingIcon type={icon} filled="empty" variant={variant} />
                        </span>
                    ))}
                </span>

                {showValue && <span className="rating-values">({String(rating / 2)}/5)</span>}
            </div>
        );
    }

    // ─── Full 1–maxRate representation ────────────────────────────────────────
    return (
        <div className={`rating rating--full align-${align} ${selectable ? 'is-selectable' : ''}`} onMouseLeave={onHoverEnd}>
            <span className="rating-rates">
                {Array.from({ length: maxRate }, (_, index) => (
                    <span key={index} className="rate" onClick={() => onRateClick(index)} onMouseEnter={() => onHover?.(index + 1)}>
                        <RatingIcon type={icon} filled={index < rating ? 'full' : 'empty'} variant={variant} />
                    </span>
                ))}
            </span>
            {showValue && <span className="rating-values">({rating}/{maxRate})</span>}
        </div>
    );
};
