import React from 'react';

import { ProgressBar } from '../../../src';

export const ProgressBarPage: React.FC = () => {
    return (
        <div className="progress-bar-page">
            <h1>Progress Bar Component</h1>
            <p>A progress bar component for visualizing completion status.</p>

            <section className="page-section">
                <h2>Progress Bar States</h2>

                <div className="showcase-group">
                    <h3>Default</h3>
                    <div style={{ width: '150px' }}>
                        <ProgressBar state="default" value={23} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Warning</h3>
                    <div style={{ width: '150px' }}>
                        <ProgressBar state="warning" value={54} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Success</h3>
                    <div style={{ width: '150px' }}>
                        <ProgressBar state="success" value={23} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Danger</h3>
                    <div style={{ width: '150px' }}>
                        <ProgressBar state="danger" value={66} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info</h3>
                    <div style={{ width: '150px' }}>
                        <ProgressBar state="info" value={92} />
                    </div>
                </div>
            </section>
        </div>
    );
};
