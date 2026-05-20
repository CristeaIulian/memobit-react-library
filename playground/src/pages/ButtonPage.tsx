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

            <section className="page-section">
                <h2>Loading State</h2>
                <div className="showcase-group">
                    <h3>Loading Buttons</h3>
                    <div className="component-group">
                        <Button loading>Loading...</Button>
                        <Button loading variant="success">
                            Processing
                        </Button>
                        <Button loading variant="info">
                            Saving
                        </Button>
                        <Button loading variant="warning">
                            Please Wait
                        </Button>
                        <Button loading variant="danger">
                            Deleting
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Loading Button Sizes</h3>
                    <div className="component-group">
                        <Button loading size="small">
                            Small
                        </Button>
                        <Button loading size="medium">
                            Medium
                        </Button>
                        <Button loading size="large">
                            Large
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Loading Without Text</h3>
                    <div className="component-group">
                        <Button loading />
                        <Button loading variant="success" />
                        <Button loading variant="info" />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Icon, Width and Native Type Options</h2>
                <div className="showcase-group">
                    <h3>Prefix, Suffix and Icon Variants</h3>
                    <div className="component-group">
                        <Button icon="save" iconVariant="success" title="Save changes">
                            Save
                        </Button>
                        <Button emojiIcon="AI" sufixIcon="->" variant="info">
                            Generate
                        </Button>
                        <Button icon="warning" iconVariant="warning" borders="sharp">
                            Sharp warning
                        </Button>
                        <Button type="reset" variant="ghost">
                            Reset form
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Full Width</h3>
                    <div className="component-group" style={{ width: '100%', maxWidth: 360 }}>
                        <Button fullWidth variant="success">
                            Continue
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
