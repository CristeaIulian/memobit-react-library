import React from 'react';

import { ADULT_RANGES, calculateBMI, getIndicatorColor, getIndicatorPosition, getPediatricRanges, getRangeLabel,PEDIATRIC_THRESHOLDS } from './bmiUtils';

import './BMI.scss';

interface BMIProps {
    weight: number;
    height: number;
    age?: number;
    sex?: 'male' | 'female';
    isSimplified?: boolean;
    showLabels?: boolean;
    showIndicator?: boolean;
}

export const BMI: React.FC<BMIProps> = ({ weight, height, age, sex, isSimplified = false, showLabels = true, showIndicator = true }) => {
    const bmi = calculateBMI(weight, height);

    const isPediatric = age !== undefined && sex !== undefined && age >= 2 && age <= 17;
    const ranges = isPediatric ? getPediatricRanges(...PEDIATRIC_THRESHOLDS[sex][age]) : ADULT_RANGES;

    const indicatorPosition = getIndicatorPosition(bmi, ranges);
    const indicatorColor = getIndicatorColor(bmi, ranges);

    return (
        <div className={`horizontal-bar-container ${isSimplified ? 'horizontal-bar-container--is-simplified' : ''}`}>
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
                    <div key={index} className="bar-segment" style={{ backgroundColor: range.color, width: `${range.percentage}%` }}>
                        <div className="range-text">{getRangeLabel(range, index, ranges.length)}</div>
                    </div>
                ))}
            </div>

            {showLabels && (
                <div className="labels-row">
                    {ranges.map((range, index) => (
                        <div key={index} className="label-segment" style={{ width: `${range.percentage}%` }}>
                            <div className="label-text">{isSimplified ? range.shortLabel || range.label : range.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
