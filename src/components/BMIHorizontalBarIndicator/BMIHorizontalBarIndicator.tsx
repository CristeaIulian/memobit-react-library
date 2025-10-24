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
    showLabels?: boolean;
    showIndicator?: boolean;
}

enum Category {
    Underweight = 'UNDERWEIGHT',
    Normal = 'NORMAL',
    Overweight = 'OVERWEIGHT',
    Obese = 'OBESE',
    SeverelyObese = 'SEVERELY OBESE',
    MorbidlyObese = 'MORBIDLY OBESE',
}

export const BMIHorizontalBarIndicator: React.FC<BMIBarProps> = ({ weight, height, showLabels = true, showIndicator = true }) => {
    // Define BMI ranges with their percentages of the total bar
    const ranges: BMIRange[] = [
        { min: 0, max: 18.5, label: Category.Underweight, color: '#00BFFF', percentage: 16.7 },
        { min: 18.5, max: 24.9, label: Category.Normal, color: '#7ED321', percentage: 16.7 },
        { min: 25, max: 29.9, label: Category.Overweight, color: '#FFD700', percentage: 16.7 },
        { min: 30, max: 34.9, label: Category.Obese, color: '#FF8C00', percentage: 16.7 },
        { min: 35, max: 39.9, label: Category.SeverelyObese, color: '#FF4444', percentage: 16.7 },
        { min: 40, max: 50, label: Category.MorbidlyObese, color: '#8B0000', percentage: 16.6 },
    ];

    const calculateBMI = (weight: number, height: number): number => {
        return weight / (height / 100) ** 2;
    };

    const getBMICategory = (bmi: number): { category: string; color: string } => {
        if (bmi < 18.5) {
            return { category: Category.Normal, color: '#00BFFF' };
        }

        if (bmi < 25) {
            return { category: Category.Overweight, color: '#7ED321' };
        }

        if (bmi < 30) {
            return { category: Category.Obese, color: '#FFD700' };
        }

        if (bmi < 35) {
            return { category: Category.SeverelyObese, color: '#FF8C00' };
        }

        return { category: Category.MorbidlyObese, color: '#FF4444' };
    };

    const getIndicatorPosition = (bmi: number): number => {
        let currentPosition = 0;

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            if (bmi <= range.max) {
                const positionInRange = (bmi - range.min) / (range.max - range.min);
                return currentPosition + positionInRange * range.percentage;
            }
            currentPosition += range.percentage;
        }

        return 100; // If BMI exceeds all ranges
    };

    const bmi = calculateBMI(weight, height);
    const category = getBMICategory(bmi);
    const indicatorPosition = getIndicatorPosition(bmi);

    return (
        <div className="horizontal-bar-container">
            {showIndicator && (
                <div className="indicator-section">
                    <div className="indicator-pointer" style={{ left: `${indicatorPosition}%` }}>
                        <div className="indicator-value" style={{ color: category.color }}>
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
                        style={{
                            backgroundColor: range.color,
                            width: `${range.percentage}%`,
                        }}
                    >
                        <div className="range-text">
                            {index === 0 ? `<${range.max}` : index === ranges.length - 1 ? `>${range.min}` : `${range.min}-${range.max}`}
                        </div>
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
