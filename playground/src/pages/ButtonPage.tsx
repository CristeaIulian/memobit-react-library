import React from 'react';

import { Button } from '../../../src';

export const ButtonPage: React.FC = () => {
    return (
        <div className="button-page">
            <h1>Button Component</h1>
            <p>A versatile button component with multiple sizes, variants, and states.</p>

            <section className="page-section">
                <h2>Basic Buttons</h2>
                <div className="showcase-group">
                    <h3>Default Buttons</h3>
                    <div className="component-group">
                        <Button>Default Button</Button>
                        <Button disabled>Disabled</Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Button Sizes</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button size="small">Small</Button>
                        <Button size="medium">Medium</Button>
                        <Button size="large">Large</Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Button Variants</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Button variant="plain">Plain</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="default">Default</Button>
                        <Button variant="warning">Warning</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="info">Info</Button>
                        <Button variant="success">Success</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
