import React from 'react';

import { BMIHorizontalBarIndicator } from '../../../src';

export const BMIHorizontalBarIndicatorPage: React.FC = () => {
    return (
        <div className="bmi-horizontal-bar-indicator-page">
            <h1>BMI Horizontal Bar Indicator</h1>
            <p>A visual indicator component for displaying Body Mass Index (BMI) on a horizontal scale.</p>

            <section className="page-section">
                <h2>Default BMI Indicator</h2>
                <div className="showcase-group">
                    <h3>With Indicator and Labels</h3>
                    <div className="component-group">
                        <BMIHorizontalBarIndicator height={180} weight={80} showIndicator showLabels />
                    </div>
                </div>
            </section>
        </div>
    );
};
