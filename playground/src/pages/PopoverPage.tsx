import React from 'react';

import { Button, Popover, usePopover } from '../../../src';

export const PopoverPage: React.FC = () => {
    const popover = usePopover();

    return (
        <div className="popover-page">
            <h1>Popover Component</h1>
            <p>A popover component for displaying contextual content with flexible positioning.</p>

            <section className="page-section">
                <h2>Basic Examples</h2>

                <div className="showcase-group">
                    <h3>Simple Content</h3>
                    <div className="component-group">
                        <Button onClick={e => popover.toggle('basic', e)}>Click me</Button>
                        <Popover visible={popover.isVisible('basic')} anchorEl={popover.getAnchorEl('basic')} onClose={() => popover.hide('basic')}>
                            This is a basic popover with simple text content.
                        </Popover>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Rich Content</h3>
                    <div className="component-group">
                        <Button onClick={e => popover.toggle('rich', e)}>Show Details</Button>
                        <Popover visible={popover.isVisible('rich')} anchorEl={popover.getAnchorEl('rich')} onClose={() => popover.hide('rich')}>
                            <div>
                                <strong style={{ display: 'block', marginBottom: '8px' }}>User Information</strong>
                                <p style={{ margin: '4px 0' }}>Name: John Doe</p>
                                <p style={{ margin: '4px 0' }}>Email: john@example.com</p>
                                <p style={{ margin: '4px 0' }}>Role: Administrator</p>
                            </div>
                        </Popover>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Placement Options</h2>
                <p>Control where the popover appears relative to the trigger element.</p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="showcase-group">
                        <h3>Auto (Default)</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('auto', e)}>Auto Placement</Button>
                            <Popover placement="auto" visible={popover.isVisible('auto')} anchorEl={popover.getAnchorEl('auto')} onClose={() => popover.hide('auto')}>
                                Automatically picks the best position based on available space.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Top</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('top', e)}>Top Placement</Button>
                            <Popover placement="top" visible={popover.isVisible('top')} anchorEl={popover.getAnchorEl('top')} onClose={() => popover.hide('top')}>
                                Positioned above the trigger element.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Bottom</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('bottom', e)}>Bottom Placement</Button>
                            <Popover placement="bottom" visible={popover.isVisible('bottom')} anchorEl={popover.getAnchorEl('bottom')} onClose={() => popover.hide('bottom')}>
                                Positioned below the trigger element.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Left</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('left', e)}>Left Placement</Button>
                            <Popover placement="left" visible={popover.isVisible('left')} anchorEl={popover.getAnchorEl('left')} onClose={() => popover.hide('left')}>
                                Positioned to the left of the trigger.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Right</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('right', e)}>Right Placement</Button>
                            <Popover placement="right" visible={popover.isVisible('right')} anchorEl={popover.getAnchorEl('right')} onClose={() => popover.hide('right')}>
                                Positioned to the right of the trigger.
                            </Popover>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Offset Examples</h2>
                <p>Control the distance between the popover and the trigger element.</p>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="showcase-group">
                        <h3>Default Offset (8px)</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('offset-default', e)}>Default</Button>
                            <Popover visible={popover.isVisible('offset-default')} anchorEl={popover.getAnchorEl('offset-default')} onClose={() => popover.hide('offset-default')}>
                                Standard 8px offset from trigger.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Small Offset (4px)</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('offset-small', e)}>Small Offset</Button>
                            <Popover offset={4} visible={popover.isVisible('offset-small')} anchorEl={popover.getAnchorEl('offset-small')} onClose={() => popover.hide('offset-small')}>
                                Closer to trigger with 4px offset.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Large Offset (16px)</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('offset-large', e)}>Large Offset</Button>
                            <Popover offset={16} visible={popover.isVisible('offset-large')} anchorEl={popover.getAnchorEl('offset-large')} onClose={() => popover.hide('offset-large')}>
                                Further from trigger with 16px offset.
                            </Popover>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Use Cases</h2>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div className="showcase-group">
                        <h3>Warning Message</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('warn', e)}>Show Warning</Button>
                            <Popover visible={popover.isVisible('warn')} anchorEl={popover.getAnchorEl('warn')} onClose={() => popover.hide('warn')}>
                                <strong style={{ color: 'orange' }}>Warning:</strong> This action cannot be undone.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Success Message</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('success', e)}>Show Success</Button>
                            <Popover visible={popover.isVisible('success')} anchorEl={popover.getAnchorEl('success')} onClose={() => popover.hide('success')}>
                                <strong style={{ color: 'green' }}>Success:</strong> Operation completed successfully!
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Error Message</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('error', e)}>Show Error</Button>
                            <Popover visible={popover.isVisible('error')} anchorEl={popover.getAnchorEl('error')} onClose={() => popover.hide('error')}>
                                <strong style={{ color: 'red' }}>Error:</strong> Something went wrong. Please try again.
                            </Popover>
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Help Text</h3>
                        <div className="component-group">
                            <Button onClick={e => popover.toggle('help', e)}>Need Help?</Button>
                            <Popover placement="top" visible={popover.isVisible('help')} anchorEl={popover.getAnchorEl('help')} onClose={() => popover.hide('help')}>
                                Click the button to perform the action. You can undo this later in settings.
                            </Popover>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
