import React from 'react';
import { Flag } from '../Flag/Flag';

import './CountryWithFlag.scss';

interface CountryWithFlagProps {
    code: string;
    label?: string;
    size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    className?: string;
}

export const CountryWithFlag: React.FC<CountryWithFlagProps> = ({
    code,
    label,
    size = 'md',
    className = '',
}) => {
    const displayLabel = label || code?.toUpperCase();

    return (
        <div className={`country-with-flag country-with-flag--${size} ${className}`}>
            <Flag code={code} size={size} />
            <span className="country-with-flag__label">{displayLabel}</span>
        </div>
    );
};
