import './Rating.scss';
import { FC, ReactElement, useCallback, useEffect } from 'react';

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

    useEffect(() => {
        if (selectable && useHalf) {
            console.warn('Rating: selectable is not only available with useHalf.');
        }
    }, []);

    const onRateClick = useCallback((value: number) => {
        if (selectable && !useHalf) {
            onSelect?.(value + 1);
        }
    }, []);

    if (useHalf) {
        // Convert 1-10 rating to 0.5-5 rating scale
        const ratingItem = rating / 2;
        const fullRate = Math.floor(ratingItem);
        const hasHalfRate = ratingItem % 1 >= 0.5;
        const emptyRating = 5 - fullRate - (hasHalfRate ? 1 : 0);

        return (
            <div className={`rating rating--half align-${align} ${selectable ? 'is-selectable' : ''}`}>
                <span className="rating-rates">
                    {/* Full rating */}
                    {Array.from({ length: fullRate }, (_, index) => (
                        <span key={`full-${index}`} className={`rate rate--full rate-variant-${variant}`}>
                            {rateEmoji}
                        </span>
                    ))}

                    {/* Half rate */}
                    {hasHalfRate && (
                        <span className={`rate rate--half`}>
                            <span className="rate-half-container">
                                <span className={`rate-half-fill rate-variant-${variant}`}>{rateEmoji}</span>
                                <span className="rate-half-empty">{rateEmoji}</span>
                            </span>
                        </span>
                    )}

                    {/* Empty rates */}
                    {Array.from({ length: emptyRating }, (_, index) => (
                        <span key={`empty-${index}`} className="rate rate--empty">
                            {rateEmoji}
                        </span>
                    ))}
                </span>

                <span className="rating-values">({rating}/10)</span>
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
