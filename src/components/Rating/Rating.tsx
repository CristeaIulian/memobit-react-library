import './Rating.scss';
import { FC, ReactElement, useCallback } from 'react';

interface RatingProps {
    align?: 'left' | 'right' | 'space-between';
    icon?: 'star' | 'bullet';
    maxRate?: number;
    onSelect?: (value: number) => void;
    rating: number;
    selectable?: boolean;
    useHalf?: boolean;
    variant?: 'success' | 'info' | 'warning' | 'danger';
}

export const Rating: FC<RatingProps> = ({
    align = 'left',
    icon = 'star',
    maxRate = 10,
    onSelect,
    rating,
    selectable = false,
    useHalf = false,
    variant = 'warning',
}: RatingProps): ReactElement => {
    const rateEmoji = icon === 'star' ? '★' : '●';

    const onRateClick = useCallback((value: number) => {
        if (selectable && !useHalf) {
            onSelect?.(value + 1);
        }
    }, [selectable, useHalf, onSelect]);

    if (useHalf && selectable) {
        // Half-star selectable input: 5 stars × 2 halves = 10 steps (stored as 1-10)
        return (
            <div className={`rating rating--half rating--half-selectable align-${align} is-selectable`}>
                <span className="rating-rates">
                    {Array.from({ length: 5 }, (_, i) => {
                        const leftValue = i * 2 + 1;
                        const rightValue = i * 2 + 2;
                        const isFull = rating >= rightValue;
                        const isHalf = !isFull && rating >= leftValue;

                        const starClass = isFull
                            ? `rate--full rate-variant-${variant}`
                            : isHalf
                            ? `rate--half-gradient rate-variant-${variant}`
                            : 'rate--empty';

                        return (
                            <span key={i} className={`rate rate--half-select ${starClass}`}>
                                {rateEmoji}
                                <span className="rate-click-left" onClick={() => onSelect?.(leftValue)} />
                                <span className="rate-click-right" onClick={() => onSelect?.(rightValue)} />
                            </span>
                        );
                    })}
                </span>
            </div>
        );
    }

    if (useHalf) {
        // Display-only half stars: convert 1-10 to 0.5-5 scale
        const ratingItem = rating / 2;
        const fullRate = Math.floor(ratingItem);
        const hasHalfRate = ratingItem % 1 >= 0.5;
        const emptyRating = 5 - fullRate - (hasHalfRate ? 1 : 0);

        return (
            <div className={`rating rating--half align-${align}`}>
                <span className="rating-rates">
                    {Array.from({ length: fullRate }, (_, index) => (
                        <span key={`full-${index}`} className={`rate rate--full rate-variant-${variant}`}>
                            {rateEmoji}
                        </span>
                    ))}

                    {hasHalfRate && (
                        <span className="rate rate--half">
                            <span className="rate-half-container">
                                <span className={`rate-half-fill rate-variant-${variant}`}>{rateEmoji}</span>
                                <span className="rate-half-empty">{rateEmoji}</span>
                            </span>
                        </span>
                    )}

                    {Array.from({ length: emptyRating }, (_, index) => (
                        <span key={`empty-${index}`} className="rate rate--empty">
                            {rateEmoji}
                        </span>
                    ))}
                </span>

                <span className="rating-values">({String(rating / 2)}/5)</span>
            </div>
        );
    }

    // Original 1-10 representation
    return (
        <div className={`rating rating--full align-${align} ${selectable ? 'is-selectable' : ''}`}>
            <span className="rating-rates">
                {Array.from({ length: maxRate }, (_, index) => (
                    <span
                        key={index}
                        className={`rate ${index < rating ? 'rate--filled' : 'rate--empty'} rate-variant-${variant}`}
                        onClick={() => onRateClick(index)}
                    >
                        {rateEmoji}
                    </span>
                ))}
            </span>
            <span className="rating-values">
                ({rating}/{maxRate})
            </span>
        </div>
    );
};
