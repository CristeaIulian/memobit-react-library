import React, { useState } from 'react';

import { InputNumber } from '../../../src';

export const InputNumberPage: React.FC = () => {
    const [numberField, setNumberField] = useState<number>(30);

    return (
        <div className="input-number-page">
            <h1>Input Number Component</h1>
            <p>A numeric input component with increment/decrement controls.</p>

            <section className="page-section">
                <h2>Basic Number Input</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputNumber value={numberField} onChange={value => setNumberField(value || 0)} />
                    </div>
                </div>
            </section>
        </div>
    );
};
