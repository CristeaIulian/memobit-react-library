import React, { useState } from 'react';

import { Radio } from '../../../src';

export const RadioPage: React.FC = () => {
    const [radioValue, setRadioValue] = useState<number>(1);

    return (
        <div className="radio-page">
            <h1>Radio Component</h1>
            <p>A radio button component for single selection from multiple options.</p>

            <section className="page-section">
                <h2>Radio Buttons</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Radio checked={radioValue === 1} onChange={() => setRadioValue(1)} label="Radio 1" />
                        <Radio checked={radioValue === 2} onChange={() => setRadioValue(2)} label="Radio 2" />
                    </div>
                </div>
            </section>
        </div>
    );
};
