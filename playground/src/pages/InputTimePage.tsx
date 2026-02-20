import React, { useState } from 'react';

import { InputTime } from '../../../src';

export const InputTimePage: React.FC = () => {
    const [timeValue, setTimeValue] = useState<string>('09:00');
    const [boundedTime, setBoundedTime] = useState<string>('12:30');

    return (
        <div className="component-page">
            <h1>Input Time Component</h1>
            <p>Time input with labels, constraints, and inline errors.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>Time input</h3>
                    <div className="component-group">
                        <InputTime
                            id="basic-time"
                            label="Start time"
                            value={timeValue}
                            onChange={value => setTimeValue(value ?? '')}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Constraints</h2>
                <div className="showcase-group">
                    <h3>Min and max</h3>
                    <div className="component-group">
                        <InputTime
                            id="bounded-time"
                            label="Office hours"
                            value={boundedTime}
                            min="08:00"
                            max="18:00"
                            onChange={value => setBoundedTime(value ?? '')}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <InputTime id="disabled-time" label="Disabled" value="14:00" disabled />
                    </div>
                </div>
            </section>
        </div>
    );
};
