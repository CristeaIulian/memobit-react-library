import React from 'react';

import { Flag } from '../../../src';

export const FlagPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Flag Component</h1>
            <p>Country flag imagery with multiple size presets.</p>

            <section className="page-section">
                <h2>Sizes</h2>
                <div className="showcase-group">
                    <h3>From tiny to extra large</h3>
                    <div className="component-group">
                        <Flag code="us" size="xxs" />
                        <Flag code="us" size="xs" />
                        <Flag code="us" size="sm" />
                        <Flag code="us" size="md" />
                        <Flag code="us" size="lg" />
                        <Flag code="us" size="xl" />
                        <Flag code="us" size="xxl" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Fallback</h2>
                <div className="showcase-group">
                    <h3>Unsupported or missing code</h3>
                    <div className="component-group">
                        <Flag code="" size="md" />
                    </div>
                </div>
            </section>
        </div>
    );
};
