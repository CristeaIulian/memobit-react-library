import React, { useState } from 'react';

import { InputNumber } from '../../../src';

export const InputNumberPage: React.FC = () => {
    const [numberField, setNumberField] = useState<number>(30);
    const [emptyNumber, setEmptyNumber] = useState<number | undefined>(undefined);
    const [validNumber, setValidNumber] = useState<number>(25);

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

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Age"
                            required
                            value={emptyNumber}
                            onChange={setEmptyNumber}
                            error={!emptyNumber ? 'Age is required' : undefined}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Age"
                            value={validNumber}
                            onChange={setValidNumber}
                            success="Valid age entered"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
