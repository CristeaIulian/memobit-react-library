import React, { useState } from 'react';

import { QuantitySelector } from '../../../src';

export const QuantitySelectorPage: React.FC = () => {
    const [quantity1, setQuantity1] = useState<number>(1);
    const [quantity2, setQuantity2] = useState<number>(5);
    const [quantity3, setQuantity3] = useState<number>(0);
    const [quantity4, setQuantity4] = useState<number>(10);
    const [quantity5, setQuantity5] = useState<number>(3);
    const [quantity6, setQuantity6] = useState<number>(50);
    const [quantity7, setQuantity7] = useState<number>(500);
    const [quantity8, setQuantity8] = useState<number>(1);
    const [quantity9, setQuantity9] = useState<number>(15);
    const [quantity10, setQuantity10] = useState<number | undefined>(undefined);

    return (
        <div className="quantity-selector-page">
            <h1>Quantity Selector Component</h1>
            <p>A component for selecting numeric quantities with increment/decrement buttons.</p>

            <section className="page-section">
                <h2>Basic Quantity Selector</h2>
                <div className="showcase-group">
                    <h3>Default (3 digits)</h3>
                    <div className="component-group">
                        <QuantitySelector value={quantity1} onChange={value => setQuantity1(value || 0)} />
                        <p>Current value: {quantity1}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Label</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <QuantitySelector label="Quantity" value={quantity2} onChange={value => setQuantity2(value || 0)} />
                        <p>Current value: {quantity2}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Auto-sizing Based on Min/Max Values</h2>
                <div className="showcase-group">
                    <h3>Min: 1, Max: 10 (auto-sized to 2 digits)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Items (1-10)" min={1} max={10} value={quantity3} onChange={value => setQuantity3(value || 1)} />
                        <p>Current value: {quantity3}</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Min: 0, Max: 99 (auto-sized to 2 digits)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Items (0-99)" min={0} max={99} value={quantity6} onChange={value => setQuantity6(value || 0)} />
                        <p>Current value: {quantity6}</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Min: 0, Max: 999 (auto-sized to 3 digits)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Items (0-999)" min={0} max={999} value={quantity7} onChange={value => setQuantity7(value || 0)} />
                        <p>Current value: {quantity7}</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Min: 10, Max: 50 (auto-sized to 2 digits based on max)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Temperature (10-50°C)" min={10} max={50} value={quantity9} onChange={value => setQuantity9(value || 10)} />
                        <p>Current value: {quantity9}°C</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Step</h2>
                <div className="showcase-group">
                    <h3>Step: 5 (0-50)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Count by 5" step={5} min={0} max={50} value={quantity4} onChange={value => setQuantity4(value || 0)} />
                        <p>Current value: {quantity4}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Input Width</h2>
                <div className="showcase-group">
                    <h3>Fixed to 5 digits (overrides auto-sizing)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Custom width" inputWidth={5} value={quantity8} onChange={value => setQuantity8(value || 1)} />
                        <p>Current value: {quantity8}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Read-Only Input</h2>
                <div className="showcase-group">
                    <h3>Buttons Only</h3>
                    <div className="component-group">
                        <QuantitySelector
                            label="Use buttons only"
                            readOnlyInput
                            min={1}
                            max={10}
                            value={quantity5}
                            onChange={value => setQuantity5(value || 1)}
                        />
                        <p>Current value: {quantity5}</p>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <QuantitySelector
                            label="Quantity"
                            required
                            value={quantity10}
                            onChange={setQuantity10}
                            error={!quantity10 ? 'This field is required' : undefined}
                        />
                        <p>Current value: {quantity10 ?? 'empty'}</p>
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <QuantitySelector label="Quantity" min={1} max={10} value={5} onChange={() => {}} success="Quantity is valid" />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Disabled</h3>
                    <div className="component-group">
                        <QuantitySelector label="Disabled" disabled value={5} />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Required (with value)</h3>
                    <div className="component-group">
                        <QuantitySelector label="Required Quantity" required value={1} onChange={() => {}} />
                    </div>
                </div>
            </section>
        </div>
    );
};
