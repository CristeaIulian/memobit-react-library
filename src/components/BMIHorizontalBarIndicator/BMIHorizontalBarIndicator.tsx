import React from 'react';

import './BMIHorizontalBarIndicator.scss';

interface BMIRange {
    min: number;
    max: number;
    label: string;
    color: string;
    percentage: number;
}

interface BMIBarProps {
    weight: number;
    height: number;
    age?: number;
    sex?: 'male' | 'female';
    showLabels?: boolean;
    showIndicator?: boolean;
}

// CDC BMI-for-age percentile thresholds [P5, P85, P95] for ages 2–17
const PEDIATRIC_THRESHOLDS: Record<'male' | 'female', Record<number, [number, number, number]>> = {
    male: {
        2: [14.7, 17.4, 18.4],
        3: [14.0, 16.7, 17.9],
        4: [13.7, 16.3, 17.6],
        5: [13.5, 16.2, 17.7],
        6: [13.4, 16.4, 18.0],
        7: [13.5, 16.9, 18.7],
        8: [13.7, 17.5, 19.7],
        9: [14.0, 18.3, 20.9],
        10: [14.4, 19.1, 22.1],
        11: [14.9, 20.1, 23.3],
        12: [15.4, 21.0, 24.5],
        13: [15.9, 21.9, 25.6],
        14: [16.5, 22.7, 26.5],
        15: [17.0, 23.4, 27.3],
        16: [17.5, 24.0, 27.9],
        17: [17.8, 24.5, 28.3],
    },
    female: {
        2: [14.2, 17.1, 18.0],
        3: [13.7, 16.6, 17.6],
        4: [13.4, 16.3, 17.4],
        5: [13.2, 16.3, 17.7],
        6: [13.1, 16.6, 18.2],
        7: [13.2, 17.1, 19.1],
        8: [13.4, 17.9, 20.3],
        9: [13.8, 18.8, 21.6],
        10: [14.2, 19.8, 23.0],
        11: [14.8, 20.9, 24.4],
        12: [15.4, 21.9, 25.7],
        13: [16.0, 22.8, 26.8],
        14: [16.5, 23.5, 27.7],
        15: [17.0, 24.1, 28.4],
        16: [17.4, 24.5, 28.9],
        17: [17.7, 24.8, 29.1],
    },
};

const ADULT_RANGES: BMIRange[] = [
    { min: 0, max: 18.5, label: 'UNDERWEIGHT', color: '#00BFFF', percentage: 16.7 },
    { min: 18.5, max: 24.9, label: 'NORMAL', color: '#7ED321', percentage: 16.7 },
    { min: 25, max: 29.9, label: 'OVERWEIGHT', color: '#FFD700', percentage: 16.7 },
    { min: 30, max: 34.9, label: 'OBESE', color: '#FF8C00', percentage: 16.7 },
    { min: 35, max: 39.9, label: 'SEVERELY OBESE', color: '#FF4444', percentage: 16.7 },
    { min: 40, max: 50, label: 'MORBIDLY OBESE', color: '#8B0000', percentage: 16.6 },
];

const getPediatricRanges = (p5: number, p85: number, p95: number): BMIRange[] => {
    const p95Max = p95 + 8;
    return [
        { min: p5 - 5, max: p5, label: 'UNDERWEIGHT', color: '#00BFFF', percentage: 20 },
        { min: p5, max: p85, label: 'HEALTHY', color: '#7ED321', percentage: 40 },
        { min: p85, max: p95, label: 'OVERWEIGHT', color: '#FFD700', percentage: 20 },
        { min: p95, max: p95Max, label: 'OBESE', color: '#FF4444', percentage: 20 },
    ];
};

const getIndicatorPosition = (bmi: number, ranges: BMIRange[]): number => {
    let currentPosition = 0;

    for (const range of ranges) {
        if (bmi <= range.max) {
            const positionInRange = (bmi - range.min) / (range.max - range.min);
            return currentPosition + Math.min(Math.max(positionInRange, 0), 1) * range.percentage;
        }
        currentPosition += range.percentage;
    }

    return 100;
};

const getIndicatorColor = (bmi: number, ranges: BMIRange[]): string => {
    for (const range of ranges) {
        if (bmi <= range.max) return range.color;
    }
    return ranges[ranges.length - 1].color;
};

const getRangeLabel = (range: BMIRange, index: number, total: number): string => {
    if (index === 0) return `<${range.max}`;
    if (index === total - 1) return `>${range.min}`;
    return `${range.min}–${range.max}`;
};

export const BMIHorizontalBarIndicator: React.FC<BMIBarProps> = ({
    weight,
    height,
    age,
    sex,
    showLabels = true,
    showIndicator = true,
}) => {
    const bmi = weight / (height / 100) ** 2;

    const isPediatric = age !== undefined && sex !== undefined && age >= 2 && age <= 17;
    let ranges: BMIRange[];

    if (isPediatric) {
        const [p5, p85, p95] = PEDIATRIC_THRESHOLDS[sex][age];
        ranges = getPediatricRanges(p5, p85, p95);
    } else {
        ranges = ADULT_RANGES;
    }

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
