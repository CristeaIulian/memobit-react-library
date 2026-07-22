import { FC, ReactElement, useCallback } from 'react';

import { RatingIcon, RatingIconType, RatingVariant } from './RatingIcon';

import './Rating.scss';

interface RatingProps {
    align?: 'left' | 'right' | 'space-between';
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

export const Rating: FC<RatingProps> = ({
    align = 'left',
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
