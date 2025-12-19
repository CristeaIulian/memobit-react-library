import React, { useState } from 'react';

import { ToggleSwitch } from '../../../src';

export const ToggleSwitchPage: React.FC = () => {
    const [toggleSwitch1, setToggleSwitch1] = useState<boolean>(false);
    const [toggleSwitch2, setToggleSwitch2] = useState<boolean>(true);
    const [toggleSwitch3, setToggleSwitch3] = useState<boolean>(false);
    const [toggleSwitch4, setToggleSwitch4] = useState<boolean>(true);
    const [toggleSwitch5, setToggleSwitch5] = useState<boolean>(false);
    const [toggleSwitch6, setToggleSwitch6] = useState<boolean>(true);
    const [toggleSwitch7, setToggleSwitch7] = useState<boolean>(false);

    return (
        <div className="toggle-switch-page">
            <h1>Toggle Switch Component</h1>
            <p>A toggle switch component for binary on/off states.</p>

            <section className="page-section">
                <h2>Toggle Switch Variations</h2>

                <div className="showcase-group">
                    <h3>Sizes</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="small" />
                        <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="medium" />
                        <ToggleSwitch checked={toggleSwitch1} onChange={setToggleSwitch1} size="large" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Variants</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="default" />
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="success" />
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="info" />
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="warning" />
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="danger" />
                        <ToggleSwitch checked={toggleSwitch2} onChange={setToggleSwitch2} variant="plain" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Without Labels</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="danger" />
                        <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="success" size="small" />
                        <ToggleSwitch checked={toggleSwitch3} onChange={setToggleSwitch3} showLabels={false} variant="info" size="large" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Labels</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={toggleSwitch4} onChange={setToggleSwitch4} onLabel="Yes" offLabel="No" variant="success" />
                        <ToggleSwitch checked={toggleSwitch5} onChange={setToggleSwitch5} onLabel="Active" offLabel="Inactive" variant="info" />
                        <ToggleSwitch checked={toggleSwitch6} onChange={setToggleSwitch6} onLabel="1" offLabel="0" variant="warning" size="small" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Disabled State</h3>
                    <div className="component-group">
                        <ToggleSwitch checked={false} disabled variant="danger" />
                        <ToggleSwitch checked={true} disabled variant="success" />
                        <ToggleSwitch checked={toggleSwitch7} onChange={setToggleSwitch7} disabled showLabels={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Interactive Example</h3>
                    <div className="component-group">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span>Enable Notifications:</span>
                            <ToggleSwitch checked={toggleSwitch7} onChange={setToggleSwitch7} variant="success" size="medium" />
                            <span>{toggleSwitch7 ? 'Enabled' : 'Disabled'}</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
