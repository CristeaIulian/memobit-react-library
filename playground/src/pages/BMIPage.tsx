import React from 'react';

import { BMI, WHtR } from '../../../src';

export const BMIPage: React.FC = () => {
    return (
        <div className="bmi-horizontal-bar-indicator-page">
            <h1>BMI</h1>
            <p>A visual indicator component for displaying Body Mass Index (BMI) on a horizontal scale.</p>

            <section className="page-section">
                <h2>Default BMI Indicator</h2>
                <div className="showcase-group">
                    <h3>With Indicator and Labels</h3>
                    <div className="component-group">
                        <BMI height={180} weight={80} showIndicator showLabels />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Default BMI Indicator (Suitable for Mobile & minimalist layouts)</h2>
                <div className="showcase-group">
                    <h3>With Indicator and Labels</h3>
                    <div className="component-group">
                        <BMI height={180} weight={80} showIndicator showLabels isSimplified />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Pediatric BMI</h2>
                <div className="showcase-group">
                    <h3>Female, age 12</h3>
                    <div className="component-group">
                        <BMI height={152} weight={43} age={12} sex="female" showIndicator showLabels />
                    </div>
                    <h3>Male, age 16 without labels</h3>
                    <div className="component-group">
                        <BMI height={172} weight={68} age={16} sex="male" showIndicator showLabels={false} />
                    </div>
                    <h3>Adult bar without indicator</h3>
                    <div className="component-group">
                        <BMI height={180} weight={80} showIndicator={false} showLabels />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Waist-to-Height Ratio (WHtR)</h2>
                <p>A body composition indicator. Values below 0.5 are considered healthy.</p>
                <div className="showcase-group">
                    <h3>Healthy (belly 85cm, height 180cm → 0.47)</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} />
                    </div>
                    <h3>At Risk (belly 95cm, height 180cm → 0.53)</h3>
                    <div className="component-group">
                        <WHtR belly={95} height={180} />
                    </div>
                    <h3>High Risk (belly 115cm, height 180cm → 0.64)</h3>
                    <div className="component-group">
                        <WHtR belly={115} height={180} />
                    </div>
                    <h3>Without Labels</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} showLabels={false} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Default WHtR (Suitable for Mobile & minimalist layouts)</h2>
                <div className="showcase-group">
                    <h3>With Indicator and Labels</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} showIndicator showLabels isSimplified />
                    </div>
                </div>
            </section>
        </div>
    );
};
