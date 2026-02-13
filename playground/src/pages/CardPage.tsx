import React, { useState } from 'react';

import { Card, CollapsibleSection } from '../../../src';

export const CardPage: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="card-page">
            <h1>Card Component</h1>
            <p>A versatile card component with optional collapsible sections and footers.</p>

            <section className="page-section" style={{ backgroundColor: 'var(--card-background-accent-color)' }}>
                <h2>Card Variations</h2>

                <div className="showcase-group">
                    <h3>Simple card</h3>
                    <div className="component-group">
                        <Card title="some title">Content here</Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card Collapsable 1</h3>
                    <div className="component-group">
                        <Card title="some title as well" isCollapsible className="medium-card">
                            Content here
                        </Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card Collapsable 2</h3>
                    <div className="component-group">
                        <Card isCollapsed isCollapsible>
                            Content here
                        </Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card Active</h3>
                    <div className="component-group">
                        <Card isHighlighted>Content here</Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card with collapsible footer</h3>
                    <div className="component-group">
                        <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>}>
                            Content here
                        </Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card with always visible footer</h3>
                    <div className="component-group">
                        <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>} isFooterCollapsible={false}>
                            Content here
                        </Card>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card with collapsible area</h3>
                    <div className="component-group">
                        <Card title="some title" isCollapsible footerContent={<span>Here is some footer content</span>} isFooterCollapsible={false}>
                            always visible content
                            <CollapsibleSection title="Details" isCollapsed={isCollapsed} onToggle={setIsCollapsed}>
                                <p>Fully controlled</p>
                            </CollapsibleSection>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};
