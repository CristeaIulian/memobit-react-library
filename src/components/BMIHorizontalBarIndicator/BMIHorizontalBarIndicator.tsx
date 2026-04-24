import React from 'react';

import './BMIHorizontalBarIndicator.scss';
import {
    ADULT_RANGES,
    PEDIATRIC_THRESHOLDS,
    calculateBMI,
    getIndicatorColor,
    getIndicatorPosition,
    getPediatricRanges,
    getRangeLabel,
} from './bmiUtils';

interface BMIBarProps {
    weight: number;
    height: number;
    age?: number;
    sex?: 'male' | 'female';
    showLabels?: boolean;
    showIndicator?: boolean;
}

export const BMIHorizontalBarIndicator: React.FC<BMIBarProps> = ({
    weight,
    height,
    age,
    sex,
    showLabels = true,
    showIndicator = true,
}) => {
    const bmi = calculateBMI(weight, height);

    const isPediatric = age !== undefined && sex !== undefined && age >= 2 && age <= 17;
    const ranges = isPediatric
        ? getPediatricRanges(...PEDIATRIC_THRESHOLDS[sex][age])
        : ADULT_RANGES;

    const indicatorPosition = getIndicatorPosition(bmi, ranges);
    const indicatorColor = getIndicatorColor(bmi, ranges);

    return (
        <div className="horizontal-bar-container">
            {showIndicator && (
                <div className="indicator-section">
                    <div className="indicator-pointer" style={{ left: `${indicatorPosition}%` }}>
                        <div className="indicator-value" style={{ color: indicatorColor }}>
                            {Math.round(bmi * 10) / 10}
                        </div>
                        <div className="pointer-arrow"></div>
                    </div>
                </div>
            )}

            <div className="horizontal-bar">
                {ranges.map((range, index) => (
                    <div
                        key={index}
                        className="bar-segment"
                        style={{ backgroundColor: range.color, width: `${range.percentage}%` }}
                    >
                        <div className="range-text">{getRangeLabel(range, index, ranges.length)}</div>
                    </div>
                ))}
            </div>

            {showLabels && (
                <div className="labels-row">
                    {ranges.map((range, index) => (
                        <div key={index} className="label-segment" style={{ width: `${range.percentage}%` }}>
                            <div className="label-text">{range.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
