import React, { useState } from 'react';

import { Button, ProgressRing } from '../../../src';

export const ProgressRingPage: React.FC = () => {
    const [progress, setProgress] = useState(42);

    const updateProgress = (delta: number) => {
        setProgress(current => Math.min(Math.max(current + delta, 0), 100));
    };

    return (
        <div className="progress-ring-page">
            <h1>Progress Ring Component</h1>
            <p>A circular progress component for compact completion, score, and usage indicators.</p>

            <section className="page-section">
                <h2>Progress Ring Examples</h2>

                <div className="showcase-group">
                    <h3>States</h3>
                    <div className="component-group">
                        <ProgressRing value={24} label="Default" />
                        <ProgressRing value={82} label="Success" state="success" />
                        <ProgressRing value={58} label="Info" state="info" />
                        <ProgressRing value={72} label="Warning" state="warning" />
                        <ProgressRing value={34} label="Danger" state="danger" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group" style={{ alignItems: 'center' }}>
                        <ProgressRing value={68} size="small" label="Small" state="info" />
                        <ProgressRing value={68} size="medium" label="Medium" state="info" />
                        <ProgressRing value={68} size="large" label="Large" state="info" />
                        <ProgressRing value={68} size={156} label="Custom" state="info" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Labels</h3>
                    <div className="component-group">
                        <ProgressRing value={91} label="Below label" state="success" />
                        <ProgressRing value={76} label="Inside" labelPosition="inside" state="warning" />
                        <ProgressRing value={100} label="Done" showPercentage={false} state="success" />
                        <ProgressRing value={15} label="Custom content" state="danger">
                            3/20
                        </ProgressRing>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Interactive</h3>
                    <div className="component-group" style={{ alignItems: 'center' }}>
                        <ProgressRing
                            value={progress}
                            label="Sync"
                            labelPosition="inside"
                            state={progress >= 80 ? 'success' : progress >= 60 ? 'info' : 'warning'}
                        />
                        <Button size="small" variant="ghost" onClick={() => updateProgress(-10)}>
                            Decrease
                        </Button>
                        <Button size="small" variant="info" onClick={() => updateProgress(10)}>
                            Increase
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Stroke Options</h3>
                    <div className="component-group">
                        <ProgressRing value={62} label="Square caps" rounded={false} thickness={12} state="default" />
                        <ProgressRing value={62} label="Thin stroke" thickness={4} state="info" />
                    </div>
                </div>
            </section>
        </div>
    );
};
