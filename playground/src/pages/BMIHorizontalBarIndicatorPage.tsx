import React from 'react';

import { BMIHorizontalBarIndicator, WHtRIndicator } from '../../../src';

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

            <section className="page-section">
                <h2>Default BMI Indicator (Suitable for Mobile & minimalist layouts)</h2>
                <div className="showcase-group">
                    <h3>With Indicator and Labels</h3>
                    <div className="component-group">
                        <BMIHorizontalBarIndicator height={180} weight={80} showIndicator showLabels isSimplified />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Waist-to-Height Ratio (WHtR)</h2>
                <p>A body composition indicator. Values below 0.5 are considered healthy.</p>
                <div className="showcase-group">
                    <h3>Healthy (belly 85cm, height 180cm → 0.47)</h3>
                    <div className="component-group">
                        <WHtRIndicator belly={85} height={180} />
                    </div>
                    <h3>At Risk (belly 95cm, height 180cm → 0.53)</h3>
                    <div className="component-group">
                        <WHtRIndicator belly={95} height={180} />
                    </div>
                    <h3>High Risk (belly 115cm, height 180cm → 0.64)</h3>
                    <div className="component-group">
                        <WHtRIndicator belly={115} height={180} />
                    </div>
                    <h3>Without Labels</h3>
                    <div className="component-group">
                        <WHtRIndicator belly={85} height={180} showLabels={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
