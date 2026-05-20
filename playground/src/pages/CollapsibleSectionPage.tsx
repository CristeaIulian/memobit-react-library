import React, { useState } from 'react';

import { CollapsibleSection, Button } from '../../../src';

export const CollapsibleSectionPage: React.FC = () => {
    const [parentCollapsed, setParentCollapsed] = useState(false);

    return (
        <div className="collapsible-section-page">
            <h1>Collapsible Section</h1>
            <p>A flexible collapsible section component with various styling options.</p>

            <section className="page-section">
                <h2>Basic Usage</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Self Controlled</h3>
                    <CollapsibleSection title="Details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Default Collapsed</h3>
                    <CollapsibleSection title="Details" defaultCollapsed>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Parent Controlled</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                        <div>
                            <Button onClick={() => setParentCollapsed(c => !c)}>Toggle</Button>
                        </div>
                        <CollapsibleSection isCollapsed={parentCollapsed} onToggle={setParentCollapsed}>
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Layout Options</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Space Between</h3>
                    <CollapsibleSection title="Details" toggleSpaceBetween>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Swap (icon left)</h3>
                    <CollapsibleSection title="Details" toggleSpaceBetween toggleSwap>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Right Details</h3>
                    <CollapsibleSection title="Details" rightDetails="7 props">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Right Details + Swap</h3>
                    <CollapsibleSection title="Details" rightDetails="7 props" toggleSwap>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>With Icon</h3>
                    <CollapsibleSection title="Details" icon="checkmark" rightDetails="3 items">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>
            </section>

            <section className="page-section">
                <h2>Size</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Small</h3>
                    <CollapsibleSection title="Small section" toggleSize="small" rightDetails="4 items">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Default</h3>
                    <CollapsibleSection title="Default section" rightDetails="4 items">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>
            </section>

            <section className="page-section">
                <h2>Header Background (toggleTint)</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Default</h3>
                    <CollapsibleSection title="Default background" toggleTint="default" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Success</h3>
                    <CollapsibleSection title="Success background" toggleTint="success" toggleVariant="success" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Info</h3>
                    <CollapsibleSection title="Info background" toggleTint="info" toggleVariant="info" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Warning</h3>
                    <CollapsibleSection title="Warning background" toggleTint="warning" toggleVariant="warning" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Danger</h3>
                    <CollapsibleSection title="Danger background" toggleTint="danger" toggleVariant="danger" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>
            </section>

            <section className="page-section">
                <h2>Styling Variants</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Highlight</h3>
                    <CollapsibleSection title="Details" rightDetails="7 props" toggleHighlight>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Highlight + Accent</h3>
                    <CollapsibleSection title="Details" rightDetails="7 props" toggleHighlight toggleAccent>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Highlight + Variant</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
                        <CollapsibleSection title="Success" rightDetails="details" toggleHighlight toggleVariant="success">
                            <p>Inner content</p>
                        </CollapsibleSection>
                        <CollapsibleSection title="Info" rightDetails="details" toggleHighlight toggleVariant="info">
                            <p>Inner content</p>
                        </CollapsibleSection>
                        <CollapsibleSection title="Warning" rightDetails="details" toggleHighlight toggleVariant="warning">
                            <p>Inner content</p>
                        </CollapsibleSection>
                        <CollapsibleSection title="Danger" rightDetails="details" toggleHighlight toggleVariant="danger">
                            <p>Inner content</p>
                        </CollapsibleSection>
                    </div>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Middle Icon</h3>
                    <CollapsibleSection title="Details" toggleHighlight toggleVariant="warning" toggleSpaceBetween toggleMiddleIcon="checkmark">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>
            </section>

            <section className="page-section">
                <h2>With Card</h2>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Default</h3>
                    <CollapsibleSection title="Card section" withCard>
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>With Right Details</h3>
                    <CollapsibleSection title="Card section" withCard rightDetails="5 items">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Success Tint</h3>
                    <CollapsibleSection title="Success header" withCard toggleTint="success" toggleVariant="success" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Info Tint</h3>
                    <CollapsibleSection title="Info header" withCard toggleTint="info" toggleVariant="info" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Warning Tint</h3>
                    <CollapsibleSection title="Warning header" withCard toggleTint="warning" toggleVariant="warning" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>

                <div className="showcase-group highlight" style={{ padding: 'var(--spacing-16)', marginBottom: 'var(--spacing-16)' }}>
                    <h3>Danger Tint</h3>
                    <CollapsibleSection title="Danger header" withCard toggleTint="danger" toggleVariant="danger" rightDetails="details">
                        <p>Inner content</p>
                    </CollapsibleSection>
                </div>
            </section>
        </div>
    );
};
