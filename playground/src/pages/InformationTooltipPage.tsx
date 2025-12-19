import React from 'react';

import { InformationTooltip } from '../../../src';

export const InformationTooltipPage: React.FC = () => {
    return (
        <div className="information-tooltip-page">
            <h1>Information Tooltip Component</h1>
            <p>A tooltip component for displaying helpful information on hover.</p>

            <section className="page-section">
                <h2>Basic Tooltip</h2>
                <div className="showcase-group">
                    <h3>Right Direction</h3>
                    <div className="component-group">
                        <InformationTooltip title="This is the info tooltip" direction="right" />
                    </div>
                </div>
            </section>
        </div>
    );
};
