import './Stars.scss';

export const Stars: React.FC<{ rating: number; maxStars?: number; useHalf?: boolean }> = ({ rating, maxStars = 10, useHalf = false }) => {
    if (useHalf) {
        // Convert 1-10 rating to 0.5-5 stars scale
        const starsRating = rating / 2;
        const fullStars = Math.floor(starsRating);
        const hasHalfStar = starsRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="stars stars--half">
                {/* Full stars */}
                {Array.from({ length: fullStars }, (_, index) => (
                    <span key={`full-${index}`} className="star star--full">
                        ★
                    </span>
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <span className="star star--half">
                        <span className="star-half-container">
                            <span className="star-half-fill">★</span>
                            <span className="star-half-empty">★</span>
                        </span>
                    </span>
                )}

                {/* Empty stars */}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <span key={`empty-${index}`} className="star star--empty">
                        ★
                    </span>
                ))}

                <span className="rating">({rating}/10)</span>
            </div>
        );
    }

    // Original 1-10 representation
    return (
        <div className="stars stars--full">
            {Array.from({ length: maxStars }, (_, index) => (
                <span key={index} className={`star ${index < rating ? 'star--filled' : 'star--empty'}`}>
                    ★
                </span>
            ))}
            <span className="rating">
                ({rating}/{maxStars})
            </span>
        </div>
    );
};
