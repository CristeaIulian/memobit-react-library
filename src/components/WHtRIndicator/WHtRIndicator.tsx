import React from 'react';

import './WHtRIndicator.scss';

interface WHtRRange {
    max: number;
    label: string;
    color: string;
    percentage: number;
}

interface WHtRIndicatorProps {
    belly: number;
    height: number;
    showLabels?: boolean;
    showIndicator?: boolean;
}

const RANGES: WHtRRange[] = [
    { max: 0.4,  label: 'UNDERWEIGHT', color: '#00BFFF', percentage: 20 },
    { max: 0.5,  label: 'HEALTHY',     color: '#7ED321', percentage: 25 },
    { max: 0.6,  label: 'AT RISK',     color: '#FFD700', percentage: 25 },
    { max: 0.7,  label: 'HIGH RISK',   color: '#FF8C00', percentage: 15 },
    { max: 1.0,  label: 'VERY HIGH',   color: '#FF4444', percentage: 15 },
];

const getCategory = (whtr: number): { label: string; color: string } => {
    for (const range of RANGES) {
        if (whtr <= range.max) return { label: range.label, color: range.color };
    }
    return { label: RANGES[RANGES.length - 1].label, color: RANGES[RANGES.length - 1].color };
};

const getIndicatorPosition = (whtr: number): number => {
    const mins = [0, 0.4, 0.5, 0.6, 0.7];
    let current = 0;
    for (let i = 0; i < RANGES.length; i++) {
        const min = mins[i];
        const max = RANGES[i].max;
        if (whtr <= max) {
            return current + ((whtr - min) / (max - min)) * RANGES[i].percentage;
        }
        current += RANGES[i].percentage;
    }
    return 100;
};

export const WHtRIndicator: React.FC<WHtRIndicatorProps> = ({ belly, height, showLabels = true, showIndicator = true }) => {
    const whtr = Math.round((belly / height) * 100) / 100;
    const category = getCategory(whtr);
    const indicatorPosition = getIndicatorPosition(whtr);

    const rangeLabels = ['<0.4', '0.4-0.5', '0.5-0.6', '0.6-0.7', '>0.7'];

    return (
        <div className="whtr-container">
            {showIndicator && (
                <div className="whtr-indicator-section">
                    <div className="whtr-indicator-pointer" style={{ left: `${indicatorPosition}%` }}>
                        <div className="whtr-indicator-value" style={{ color: category.color }}>
                            {whtr.toFixed(2)}
                        </div>
                        <div className="whtr-pointer-arrow"></div>
                    </div>
                </div>
            )}

            <div className="whtr-horizontal-bar">
                {RANGES.map((range, index) => (
                    <div
                        key={index}
                        className="whtr-bar-segment"
                        style={{ backgroundColor: range.color, width: `${range.percentage}%` }}
                    >
                        <div className="whtr-range-text">{rangeLabels[index]}</div>
                    </div>
                ))}
            </div>

            {showLabels && (
                <div className="whtr-labels-row">
                    {RANGES.map((range, index) => (
                        <div key={index} className="whtr-label-segment" style={{ width: `${range.percentage}%` }}>
                            <div className="whtr-label-text">{range.label}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
