import React, { useState } from 'react';

import { SignalStrength, Slider } from '../../../src';

export const SignalStrengthPage: React.FC = () => {
    const [signalValue, setSignalValue] = useState(62);

    return (
        <div className="component-page">
            <h1>Signal Strength Component</h1>
            <p>Visual indicator for connectivity quality.</p>

            <section className="page-section">
                <h2>Interactive</h2>
                <div className="showcase-group">
                    <h3>Adjust the signal value</h3>
                    <div className="component-group">
                        <SignalStrength value={signalValue} size={32} />
                        <div style={{ minWidth: '220px' }}>
                            <Slider value={signalValue} onChange={setSignalValue} min={0} max={100} />
                        </div>
                    </div>
                    <p>Value: {signalValue}%</p>
                </div>
            </section>

            <section className="page-section">
                <h2>States</h2>
                <div className="showcase-group">
                    <h3>Explicit state overrides</h3>
                    <div className="component-group">
                        <SignalStrength value={100} state="excellent" size={28} />
                        <SignalStrength value={70} state="good" size={28} />
                        <SignalStrength value={45} state="fair" size={28} />
                        <SignalStrength value={20} state="weak" size={28} />
                        <SignalStrength value={0} state="unknown" size={28} />
                    </div>
                </div>
            </section>
        </div>
    );
};
