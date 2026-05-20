import React, { FC } from 'react';

import { Badge } from '../../../src';

export const BadgePage: FC = () => {
    return (
        <div className="float-button-page">
            <h1>Badge Component</h1>
            <p>A badge component for small information presentation.</p>

            <section className="page-section">
                <h2>Badge Examples</h2>

                <div className="showcase-group">
                    <h3>Badge Default</h3>
                    <div className="component-group">
                        <Badge>Sample</Badge>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Badge Variants</h3>
                    <div className="component-group">
                        <Badge variant="success">Success</Badge>
                        <Badge variant="info">Info</Badge>
                        <Badge variant="warning">Warning</Badge>
                        <Badge variant="danger">Danger</Badge>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Badge Sizes</h3>
                    <div className="component-group">
                        <div>
                            <Badge variant="success" size="xsmall">
                                Extra Small
                            </Badge>
                        </div>
                        <div>
                            <Badge variant="success" size="small">
                                Small
                            </Badge>
                        </div>
                        <div>
                            <Badge variant="success" size="medium">
                                Medium
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dismissible Badges</h3>
                    <div className="component-group">
                        <Badge size="small" onClear={() => alert('Cleared!')}>
                            Filter: Active
                        </Badge>
                        <Badge variant="info" size="small" onClear={() => alert('Cleared!')}>
                            Category: Science
                        </Badge>
                        <Badge variant="warning" size="medium" onClear={() => alert('Cleared!')}>
                            State: Reading
                        </Badge>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Clickable and Custom Color Badges</h3>
                    <div className="component-group">
                        <Badge customColor="#7c3aed">Custom purple</Badge>
                        <Badge customColor="#0891b2" isActive onClick={() => alert('Active badge clicked')}>
                            Active filter
                        </Badge>
                        <Badge customColor="#64748b" isActive={false} onClick={() => alert('Inactive badge clicked')}>
                            Inactive filter
                        </Badge>
                    </div>
                </div>
            </section>
        </div>
    );
};
