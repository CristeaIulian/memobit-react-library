import React from 'react';

import { Button, Popover, usePopover } from '../../../src';

export const PopoverPage: React.FC = () => {
    const popover = usePopover();

    return (
        <div className="popover-page">
            <h1>Popover Component</h1>
            <p>A popover component for displaying contextual content.</p>

            <section className="page-section">
                <h2>Popover Examples</h2>

                <div className="showcase-group">
                    <h3>Warn</h3>
                    <div className="component-group">
                        <Button onClick={e => popover.toggle('warn', e)}>Click me</Button>
                        <Popover visible={popover.isVisible('warn')} anchorEl={popover.getAnchorEl('warn')} onClose={() => popover.hide('warn')}>
                            <strong style={{ color: 'orange' }}>Warn</strong>, my content goes here
                        </Popover>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Good</h3>
                    <div className="component-group">
                        <Button onClick={e => popover.toggle('good', e)}>Click me</Button>
                        <Popover visible={popover.isVisible('good')} anchorEl={popover.getAnchorEl('good')} onClose={() => popover.hide('good')}>
                            <strong style={{ color: 'green' }}>Good</strong>, my content goes here
                        </Popover>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Alert</h3>
                    <div className="component-group">
                        <Button onClick={e => popover.toggle('alert', e)}>Click me</Button>
                        <Popover visible={popover.isVisible('alert')} anchorEl={popover.getAnchorEl('alert')} onClose={() => popover.hide('alert')}>
                            <strong style={{ color: 'red' }}>Alert</strong>, my content goes here
                        </Popover>
                    </div>
                </div>
            </section>
        </div>
    );
};
