import React, { useState } from 'react';

import { Radio } from '../../../src';

export const RadioPage: React.FC = () => {
    const [selectedOption, setSelectedOption] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<string>('medium');
    const [selectedPayment, setSelectedPayment] = useState<string>('credit-card');
    const [selectedPlan, setSelectedPlan] = useState<string>('free');

    return (
        <div className="radio-page">
            <h1>Radio Component</h1>
            <p>A radio button component for single selection from multiple options.</p>

            <section className="page-section">
                <h2>Basic Examples</h2>

                <div className="showcase-group">
                    <h3>Basic Radio Group</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Radio checked={selectedOption === 1} onChange={() => setSelectedOption(1)} label="Option 1" name="basic-options" value={1} />
                        <Radio checked={selectedOption === 2} onChange={() => setSelectedOption(2)} label="Option 2" name="basic-options" value={2} />
                        <Radio checked={selectedOption === 3} onChange={() => setSelectedOption(3)} label="Option 3" name="basic-options" value={3} />
                        <p style={{ marginTop: '8px', fontSize: '14px', color: 'var(--body-color-muted)' }}>Selected: Option {selectedOption}</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Horizontal Layout</h3>
                    <div className="component-group" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        <Radio checked={selectedSize === 'small'} onChange={() => setSelectedSize('small')} label="Small" name="size-options" value="small" />
                        <Radio
                            checked={selectedSize === 'medium'}
                            onChange={() => setSelectedSize('medium')}
                            label="Medium"
                            name="size-options"
                            value="medium"
                        />
                        <Radio checked={selectedSize === 'large'} onChange={() => setSelectedSize('large')} label="Large" name="size-options" value="large" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Radio Without Labels</h3>
                    <div className="component-group" style={{ display: 'flex', gap: '12px' }}>
                        <Radio checked={selectedOption === 1} onChange={() => setSelectedOption(1)} name="no-label" value={1} />
                        <Radio checked={selectedOption === 2} onChange={() => setSelectedOption(2)} name="no-label" value={2} />
                        <Radio checked={selectedOption === 3} onChange={() => setSelectedOption(3)} name="no-label" value={3} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>

                <div className="showcase-group">
                    <h3>Disabled State</h3>
                    <div className="component-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <Radio checked={false} label="Disabled unchecked" disabled />
                        <Radio checked={true} label="Disabled checked" disabled />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Examples</h2>

                <div className="showcase-group">
                    <h3>Payment Method Selection</h3>
                    <div
                        className="component-group"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '8px' }}>Choose Payment Method</h4>
                        <Radio
                            checked={selectedPayment === 'credit-card'}
                            onChange={() => setSelectedPayment('credit-card')}
                            label="Credit Card"
                            name="payment"
                            value="credit-card"
                        />
                        <Radio
                            checked={selectedPayment === 'paypal'}
                            onChange={() => setSelectedPayment('paypal')}
                            label="PayPal"
                            name="payment"
                            value="paypal"
                        />
                        <Radio
                            checked={selectedPayment === 'bank-transfer'}
                            onChange={() => setSelectedPayment('bank-transfer')}
                            label="Bank Transfer"
                            name="payment"
                            value="bank-transfer"
                        />
                        <Radio
                            checked={selectedPayment === 'crypto'}
                            onChange={() => setSelectedPayment('crypto')}
                            label="Cryptocurrency"
                            name="payment"
                            value="crypto"
                        />
                        <div
                            style={{
                                marginTop: '8px',
                                padding: '12px',
                                backgroundColor: 'var(--card-background-accent-color)',
                                borderRadius: '4px',
                            }}
                        >
                            <strong>Selected:</strong> {selectedPayment.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Subscription Plan Selector</h3>
                    <div
                        className="component-group"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <h4 style={{ marginTop: 0, marginBottom: '8px' }}>Select Your Plan</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedPlan === 'free' ? '2px solid var(--body-accent-color)' : '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Radio
                                    checked={selectedPlan === 'free'}
                                    onChange={() => setSelectedPlan('free')}
                                    label="Free Plan - $0/month"
                                    name="plan"
                                    value="free"
                                />
                                <p style={{ marginLeft: '28px', marginTop: '4px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                                    Basic features, limited to 10 projects
                                </p>
                            </div>
                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedPlan === 'pro' ? '2px solid var(--body-accent-color)' : '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Radio
                                    checked={selectedPlan === 'pro'}
                                    onChange={() => setSelectedPlan('pro')}
                                    label="Pro Plan - $19/month"
                                    name="plan"
                                    value="pro"
                                />
                                <p style={{ marginLeft: '28px', marginTop: '4px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                                    Advanced features, unlimited projects
                                </p>
                            </div>
                            <div
                                style={{
                                    padding: '12px',
                                    border: selectedPlan === 'enterprise' ? '2px solid var(--body-accent-color)' : '1px solid var(--border-color)',
                                    borderRadius: '4px',
                                }}
                            >
                                <Radio
                                    checked={selectedPlan === 'enterprise'}
                                    onChange={() => setSelectedPlan('enterprise')}
                                    label="Enterprise Plan - Contact Sales"
                                    name="plan"
                                    value="enterprise"
                                />
                                <p style={{ marginLeft: '28px', marginTop: '4px', fontSize: '12px', color: 'var(--body-color-muted)' }}>
                                    Custom solutions, dedicated support
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
