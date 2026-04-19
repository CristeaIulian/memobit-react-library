import React, { useState } from 'react';

import { InputNumber } from '../../../src';

export const InputNumberPage: React.FC = () => {
    const [numberField, setNumberField] = useState<number>(30);
    const [emptyNumber, setEmptyNumber] = useState<number | undefined>(undefined);
    const [validNumber, setValidNumber] = useState<number>(25);
    const [minValue, setMinValue] = useState<number>(5);
    const [maxValue, setMaxValue] = useState<number>(95);
    const [rangeValue, setRangeValue] = useState<number>(50);
    const [stepValue, setStepValue] = useState<number>(0);

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

            <section className="page-section">
                <h2>Min/Max Constraints</h2>
                <p>Values are automatically clamped to the specified range when the input loses focus.</p>
                <div className="showcase-group">
                    <h3>Minimum Value (min: 0)</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Quantity"
                            value={minValue}
                            onChange={value => setMinValue(value || 0)}
                            min={0}
                            placeholder="Cannot be negative"
                        />
                        <p>Try entering a negative number and clicking away</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Maximum Value (max: 100)</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Percentage"
                            value={maxValue}
                            onChange={value => setMaxValue(value || 0)}
                            max={100}
                            placeholder="Cannot exceed 100"
                        />
                        <p>Try entering a value greater than 100 and clicking away</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Range (min: 0, max: 100)</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Score"
                            value={rangeValue}
                            onChange={value => setRangeValue(value || 0)}
                            min={0}
                            max={100}
                            placeholder="Between 0 and 100"
                        />
                        <p>Try entering values outside the 0-100 range and clicking away</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>With Step (min: 0, max: 100, step: 5)</h3>
                    <div className="component-group">
                        <InputNumber
                            label="Temperature"
                            value={stepValue}
                            onChange={value => setStepValue(value || 0)}
                            min={0}
                            max={100}
                            step={5}
                            placeholder="Increments of 5"
                        />
                        <p>Use the increment/decrement buttons to change by 5</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
