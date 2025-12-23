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
                            <Badge variant="success" size="small">
                                Small
                            </Badge>
                        </div>
                        <div>
                            <Badge variant="success" size="medium">
                                Medium
                            </Badge>
                        </div>
                        <div>
                            <Badge variant="success" size="large">
                                Large
                            </Badge>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
