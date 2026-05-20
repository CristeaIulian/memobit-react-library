import React from 'react';

import { WHtR } from '../../../src';

export const WHtRPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>WHtR Component</h1>
            <p>Waist-to-height ratio indicator with full and compact display modes.</p>

            <section className="page-section">
                <h2>Risk Ranges</h2>
                <div className="showcase-group">
                    <h3>Healthy</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} />
                    </div>
                    <h3>At Risk</h3>
                    <div className="component-group">
                        <WHtR belly={95} height={180} />
                    </div>
                    <h3>Very High</h3>
                    <div className="component-group">
                        <WHtR belly={130} height={180} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Display Options</h2>
                <div className="showcase-group">
                    <h3>Compact Labels</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} isSimplified showIndicator showLabels />
                    </div>
                    <h3>Without Indicator</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} showIndicator={false} />
                    </div>
                    <h3>Without Labels</h3>
                    <div className="component-group">
                        <WHtR belly={85} height={180} showLabels={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
