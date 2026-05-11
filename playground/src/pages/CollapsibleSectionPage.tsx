import React, { useState } from 'react';

import { CollapsibleSection, Button } from '../../../src';

export const CollapsibleSectionPage: React.FC = () => {
    const [isCollapsed2, setIsCollapsed2] = useState(false);
    const [isCollapsed3, setIsCollapsed3] = useState(false);
    const [isCollapsed4, setIsCollapsed4] = useState(false);
    const [isCollapsed5, setIsCollapsed5] = useState(false);
    const [isCollapsed6, setIsCollapsed6] = useState(false);
    const [isCollapsed7, setIsCollapsed7] = useState(false);
    const [isCollapsed8, setIsCollapsed8] = useState(false);
    const [isCollapsed9, setIsCollapsed9] = useState(false);
    const [isCollapsed10, setIsCollapsed10] = useState(false);
    const [isCollapsed11, setIsCollapsed11] = useState(false);

    return (
        <div className="collapsible-section-page">
            <h1>Collapsible Section Component</h1>
            <p>A flexible collapsible section component with various styling options.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Self Controllable</h3>
                    <div className="component-group">
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed2} onToggle={setIsCollapsed2}>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3 style={{ margin: 0 }}>Parent Controlled</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <Button onClick={() => setIsCollapsed3(!isCollapsed3)}>Toggle</Button>
                        <CollapsibleSection isCollapsed={isCollapsed3} onToggle={setIsCollapsed3}>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Layout Options</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Space between icon & label</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed4} onToggle={setIsCollapsed4} toggleSpaceBetween>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Swap icon & label</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed5} onToggle={setIsCollapsed5} toggleSpaceBetween toggleSwap>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Toggle with details</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed6} onToggle={setIsCollapsed6} rightDetails="7 props">
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Toggle with details and toggle swap</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed7} onToggle={setIsCollapsed7} rightDetails="7 props" toggleSwap>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Styling Variants</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)', backgroundColor: '#3b3b3b' }}>
                    <h3>Toggle with highlight</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed8} onToggle={setIsCollapsed8} rightDetails="7 props" toggleHighlight>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)', backgroundColor: '#3b3b3b' }}>
                    <h3>Toggle with accent</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed9} onToggle={setIsCollapsed9} rightDetails="7 props" toggleHighlight toggleAccent>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)', backgroundColor: '#3b3b3b' }}>
                    <h3>Toggle with variant</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection title="Details" isCollapsed={isCollapsed10} onToggle={setIsCollapsed10} rightDetails="7 props" toggleHighlight toggleVariant="warning">
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)', backgroundColor: '#3b3b3b' }}>
                    <h3>Toggle with middle icon</h3>
                    <div className="component-group" style={{ padding: 'var(--spacing-16)' }}>
                        <CollapsibleSection
                            title="Details"
                            isCollapsed={isCollapsed11}
                            onToggle={setIsCollapsed11}
                            toggleHighlight
                            toggleVariant="warning"
                            toggleSpaceBetween
                            toggleMiddleIcon="checkmark"
                        >
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>
            </section>
        </div>
    );
};
