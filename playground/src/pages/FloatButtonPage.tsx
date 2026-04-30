import React, { useState } from 'react';

import { Button, FloatButton } from '../../../src';

export const FloatButtonPage: React.FC = () => {
    const [showFloatButton1, setShowFloatButton1] = useState<boolean>(false);
    const [showFloatButton2, setShowFloatButton2] = useState<boolean>(false);

    return (
        <div className="float-button-page">
            <h1>Float Button Component</h1>
            <p>A floating action button component for quick actions.</p>

            <section className="page-section">
                <h2>Float Button Examples</h2>

                <div className="showcase-group">
                    <h3>Single Action Button</h3>
                    <div className="component-group">
                        <Button onClick={() => setShowFloatButton1(!showFloatButton1)}>{showFloatButton1 ? 'Hide' : 'Show'} Float Button</Button>
                        <div style={{ display: showFloatButton1 ? 'block' : 'none' }}>
                            <FloatButton
                                actions={[
                                    {
                                        label: 'Add Item',
                                        icon: 'plus',
                                        onClick: () => alert('One Item :: Action triggered'),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Multiple Actions Button</h3>
                    <div className="component-group">
                        <Button onClick={() => setShowFloatButton2(!showFloatButton2)}>{showFloatButton2 ? 'Hide' : 'Show'} Float Button</Button>
                        <div style={{ display: showFloatButton2 ? 'block' : 'none' }}>
                            <FloatButton
                                actions={[
                                    {
                                        label: 'Add Item',
                                        icon: 'plus',
                                        onClick: () => alert('Multiple Items :: First item triggered'),
                                    },
                                    {
                                        label: 'Import Data',
                                        icon: 'import',
                                        onClick: () => alert('Multiple Items :: Second item triggered'),
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
