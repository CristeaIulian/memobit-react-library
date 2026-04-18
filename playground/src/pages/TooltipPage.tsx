import React from 'react';

import { Tooltip, Button } from '../../../src';

export const TooltipPage: React.FC = () => {
    return (
        <div className="tooltip-page">
            <h1>Tooltip Component</h1>
            <p>A tooltip component that displays helpful information on hover or focus.</p>

            <section className="page-section">
                <h2>Tooltip Positions</h2>

                <div className="showcase-group">
                    <h3>Top Position (Default)</h3>
                    <div className="component-group">
                        <Tooltip title="This tooltip appears on top">
                            <Button>Hover me (Top)</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Bottom Position</h3>
                    <div className="component-group">
                        <Tooltip title="This tooltip appears on bottom" position="bottom">
                            <Button>Hover me (Bottom)</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Left Position</h3>
                    <div className="component-group">
                        <Tooltip title="This tooltip appears on the left" position="left">
                            <Button>Hover me (Left)</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Position</h3>
                    <div className="component-group">
                        <Tooltip title="This tooltip appears on the right" position="right">
                            <Button>Hover me (Right)</Button>
                        </Tooltip>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Tooltip Content Variations</h2>

                <div className="showcase-group">
                    <h3>Simple Text</h3>
                    <div className="component-group">
                        <Tooltip title="Simple tooltip text">
                            <span style={{ textDecoration: 'underline dotted', cursor: 'help' }}>Hover for info</span>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Long Text</h3>
                    <div className="component-group">
                        <Tooltip title="This is a longer tooltip that demonstrates how the tooltip component handles multi-line content. It will wrap automatically.">
                            <Button>Long tooltip</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Rich Content</h3>
                    <div className="component-group">
                        <Tooltip
                            title={
                                <div>
                                    <strong>Rich Tooltip</strong>
                                    <p style={{ margin: '4px 0' }}>You can include formatted content.</p>
                                    <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                                        <li>Item 1</li>
                                        <li>Item 2</li>
                                    </ul>
                                </div>
                            }
                        >
                            <Button>Rich content</Button>
                        </Tooltip>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Delay</h2>

                <div className="showcase-group">
                    <h3>No Delay (0ms)</h3>
                    <div className="component-group">
                        <Tooltip title="Appears immediately" delay={0}>
                            <Button>Instant tooltip</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Short Delay (200ms - Default)</h3>
                    <div className="component-group">
                        <Tooltip title="Appears after 200ms">
                            <Button>Default delay</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Long Delay (1000ms)</h3>
                    <div className="component-group">
                        <Tooltip title="Appears after 1 second" delay={1000}>
                            <Button>Long delay</Button>
                        </Tooltip>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Different Elements</h2>

                <div className="showcase-group">
                    <h3>On Buttons</h3>
                    <div className="component-group">
                        <Tooltip title="Primary action">
                            <Button variant="success">Save</Button>
                        </Tooltip>
                        <Tooltip title="Cancel action" position="top">
                            <Button variant="danger">Cancel</Button>
                        </Tooltip>
                        <Tooltip title="More information" position="right">
                            <Button variant="info">Info</Button>
                        </Tooltip>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>On Text</h3>
                    <div className="component-group">
                        <p>
                            This is a paragraph with{' '}
                            <Tooltip title="Additional context about this term">
                                <span style={{ borderBottom: '1px dotted', cursor: 'help' }}>tooltips on specific words</span>
                            </Tooltip>{' '}
                            for additional context.
                        </p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>On Icons/Symbols</h3>
                    <div className="component-group">
                        <Tooltip title="Click to edit">
                            <span style={{ cursor: 'pointer', fontSize: '1.5rem' }}>✏️</span>
                        </Tooltip>
                        <Tooltip title="Click to delete" position="top">
                            <span style={{ cursor: 'pointer', fontSize: '1.5rem' }}>🗑️</span>
                        </Tooltip>
                        <Tooltip title="More information" position="right">
                            <span style={{ cursor: 'help', fontSize: '1.5rem' }}>ℹ️</span>
                        </Tooltip>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Disabled State</h2>

                <div className="showcase-group">
                    <h3>Disabled Tooltip</h3>
                    <div className="component-group">
                        <Tooltip title="This tooltip is disabled" disabled>
                            <Button>Tooltip disabled</Button>
                        </Tooltip>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Edge Cases</h2>

                <div className="showcase-group" style={{ display: 'flex', justifyContent: 'space-between', padding: '40px' }}>
                    <div>
                        <h3>Near Left Edge</h3>
                        <Tooltip title="Tooltip positioned near the left edge" position="left">
                            <Button>Left edge</Button>
                        </Tooltip>
                    </div>

                    <div>
                        <h3>Near Right Edge</h3>
                        <Tooltip title="Tooltip positioned near the right edge" position="right">
                            <Button>Right edge</Button>
                        </Tooltip>
                    </div>
                </div>
            </section>
        </div>
    );
};
