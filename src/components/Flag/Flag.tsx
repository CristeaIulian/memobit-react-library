import React from 'react';

import './Flag.scss';

interface FlagsProps {
    code: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    className?: string;
}

export const Flag: React.FC<FlagsProps> = ({ code, size = 'md', className = '' }) => {
    // Fallback for unsupported country codes
    if (!code) {
        return (
            <div className={`flags flags--fallback flags--${size} ${className}`} title={`Unsupported country code: ${code}`}>
                ?
            </div>
        );
    }

    const flagUrl = `https://flagcdn.com/w80/${code}.png`;
    const flagUrlWebp = `https://flagcdn.com/w80/${code}.webp`;

    return (
        <picture className={`flag flag--${size} ${className}`}>
            <source srcSet={flagUrlWebp} type="image/webp" />
            <img
                src={flagUrl}
                alt={`${code.toUpperCase()} flag`}
                title={`Country: ${code.toUpperCase()}`}
                loading="lazy"
                onError={e => {
                    // Fallback to PNG if WebP fails
                    const target = e.target as HTMLImageElement;

                    if (target.src !== flagUrl) {
                        target.src = flagUrl;
                    }
                }}
            />
        </picture>
    );
};
