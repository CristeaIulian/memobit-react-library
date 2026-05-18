import React, { useMemo } from 'react';

import { format2Digits } from '../../helpers/Numbers';

import './ProgressRing.scss';

export type ProgressRingState = 'default' | 'danger' | 'success' | 'warning' | 'info';
export type ProgressRingSize = 'small' | 'medium' | 'large' | number;

export interface ProgressRingProps {
    children?: React.ReactNode;
    className?: string;
    label?: React.ReactNode;
    labelPosition?: 'inside' | 'below';
    rounded?: boolean;
    showPercentage?: boolean;
    size?: ProgressRingSize;
    state?: ProgressRingState;
    thickness?: number;
    value: number;
}

const sizeMap: Record<Exclude<ProgressRingSize, number>, number> = {
    small: 64,
    medium: 96,
    large: 128,
};

const getSizeValue = (size: ProgressRingSize): number => (typeof size === 'number' ? size : sizeMap[size]);

export const ProgressRing: React.FC<ProgressRingProps> = ({
    children,
    className = '',
    label,
    labelPosition = 'below',
    rounded = true,
    showPercentage = true,
    size = 'medium',
    state = 'default',
    thickness,
    value,
}: ProgressRingProps) => {
    const clampedValue = Math.min(Math.max(Number.isFinite(value) ? value : 0, 0), 100);
    const sizeValue = getSizeValue(size);
    const strokeWidth = thickness ?? (sizeValue <= sizeMap.small ? 6 : 8);
    const radius = Math.max((sizeValue - strokeWidth) / 2, 1);
    const circumference = 2 * Math.PI * radius;
    const strokeOffset = circumference - (clampedValue / 100) * circumference;

    const percentage = useMemo(() => `${format2Digits(clampedValue)}%`, [clampedValue]);
    const centerContent = children || (showPercentage ? percentage : labelPosition === 'inside' ? label : null);
    const showInsideLabel = labelPosition === 'inside' && label && showPercentage && !children;

    return (
        <div
            className={`progress-ring progress-ring--${state} ${className}`}
            style={
                {
                    '--progress-ring-size': `${sizeValue}px`,
                } as React.CSSProperties
            }
        >
            <div className="progress-ring__frame">
                <svg className="progress-ring__svg" viewBox={`0 0 ${sizeValue} ${sizeValue}`}>
                    <circle className="progress-ring__track" cx={sizeValue / 2} cy={sizeValue / 2} r={radius} strokeWidth={strokeWidth} />
                    <circle
                        className="progress-ring__value"
                        cx={sizeValue / 2}
                        cy={sizeValue / 2}
                        r={radius}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap={rounded ? 'round' : 'butt'}
                        strokeWidth={strokeWidth}
                    />
                </svg>
                {centerContent && (
                    <div className="progress-ring__content">
                        <span className="progress-ring__value-text">{centerContent}</span>
                        {showInsideLabel && <span className="progress-ring__label progress-ring__label--inside">{label}</span>}
                    </div>
                )}
            </div>
            {labelPosition === 'below' && label && <div className="progress-ring__label">{label}</div>}
        </div>
    );
};
