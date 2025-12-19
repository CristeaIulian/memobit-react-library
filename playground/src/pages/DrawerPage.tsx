import React, { useState } from 'react';

import { Drawer, Button } from '../../../src';

export const DrawerPage: React.FC = () => {
    const [isLeftDrawerOpen, setLeftDrawerOpen] = useState<boolean>(false);
    const [isRightDrawerOpen, setRightDrawerOpen] = useState<boolean>(false);
    const [isLeftDrawerWithTitleOpen, setLeftDrawerWithTitleOpen] = useState<boolean>(false);
    const [isRightDrawerWithTitleOpen, setRightDrawerWithTitleOpen] = useState<boolean>(false);
    const [isWideDrawerOpen, setWideDrawerOpen] = useState<boolean>(false);
    const [isNarrowDrawerOpen, setNarrowDrawerOpen] = useState<boolean>(false);
    const [isNoOverlayDrawerOpen, setNoOverlayDrawerOpen] = useState<boolean>(false);

    return (
        <div className="drawer-page">
            <h1>Drawer Component</h1>
            <p>A drawer component that slides in from the left or right side of the screen.</p>

            <section className="page-section">
                <h2>Basic Drawers</h2>

                <div className="showcase-group">
                    <h3>Left Drawer</h3>
                    <div className="component-group">
                        <Button onClick={() => setLeftDrawerOpen(true)}>Open Left Drawer</Button>
                        <Drawer isOpen={isLeftDrawerOpen} onClose={() => setLeftDrawerOpen(false)} position="left">
                            <h3>Left Drawer Content</h3>
                            <p>This is a drawer that slides in from the left side.</p>
                            <p>You can put any content here.</p>
                            <ul>
                                <li>Navigation links</li>
                                <li>Settings</li>
                                <li>User profile</li>
                                <li>Filters</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Drawer</h3>
                    <div className="component-group">
                        <Button onClick={() => setRightDrawerOpen(true)}>Open Right Drawer</Button>
                        <Drawer isOpen={isRightDrawerOpen} onClose={() => setRightDrawerOpen(false)} position="right">
                            <h3>Right Drawer Content</h3>
                            <p>This is a drawer that slides in from the right side.</p>
                            <p>Commonly used for:</p>
                            <ul>
                                <li>Shopping cart</li>
                                <li>Notifications</li>
                                <li>Settings panel</li>
                                <li>Details view</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Drawers with Titles</h2>

                <div className="showcase-group">
                    <h3>Left Drawer with Title</h3>
                    <div className="component-group">
                        <Button onClick={() => setLeftDrawerWithTitleOpen(true)}>Open Left Drawer with Title</Button>
                        <Drawer isOpen={isLeftDrawerWithTitleOpen} onClose={() => setLeftDrawerWithTitleOpen(false)} position="left" title="Navigation Menu">
                            <nav>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#home">Home</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#products">Products</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#about">About</a>
                                    </li>
                                    <li style={{ padding: '8px 0' }}>
                                        <a href="#contact">Contact</a>
                                    </li>
                                </ul>
                            </nav>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Right Drawer with Title</h3>
                    <div className="component-group">
                        <Button onClick={() => setRightDrawerWithTitleOpen(true)}>Open Right Drawer with Title</Button>
                        <Drawer isOpen={isRightDrawerWithTitleOpen} onClose={() => setRightDrawerWithTitleOpen(false)} position="right" title="Settings">
                            <div>
                                <h4>Appearance</h4>
                                <p>Configure your appearance settings.</p>
                                <h4>Notifications</h4>
                                <p>Manage your notification preferences.</p>
                                <h4>Privacy</h4>
                                <p>Control your privacy settings.</p>
                            </div>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Width Drawers</h2>

                <div className="showcase-group">
                    <h3>Wide Drawer (500px)</h3>
                    <div className="component-group">
                        <Button onClick={() => setWideDrawerOpen(true)}>Open Wide Drawer</Button>
                        <Drawer isOpen={isWideDrawerOpen} onClose={() => setWideDrawerOpen(false)} position="right" width="500px" title="Wide Panel">
                            <p>This drawer has a custom width of 500px.</p>
                            <p>Perfect for detailed content or forms.</p>
                            <div style={{ marginTop: '20px' }}>
                                <h4>Example Form</h4>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Name:</label>
                                    <input type="text" style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Email:</label>
                                    <input type="email" style={{ width: '100%', padding: '8px' }} />
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px' }}>Message:</label>
                                    <textarea style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
                                </div>
                            </div>
                        </Drawer>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Narrow Drawer (240px)</h3>
                    <div className="component-group">
                        <Button onClick={() => setNarrowDrawerOpen(true)}>Open Narrow Drawer</Button>
                        <Drawer isOpen={isNarrowDrawerOpen} onClose={() => setNarrowDrawerOpen(false)} position="left" width="240px" title="Quick Links">
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                <li style={{ padding: '8px 0' }}>Dashboard</li>
                                <li style={{ padding: '8px 0' }}>Profile</li>
                                <li style={{ padding: '8px 0' }}>Settings</li>
                                <li style={{ padding: '8px 0' }}>Help</li>
                                <li style={{ padding: '8px 0' }}>Logout</li>
                            </ul>
                        </Drawer>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Special Configurations</h2>

                <div className="showcase-group">
                    <h3>Drawer without Overlay</h3>
                    <div className="component-group">
                        <Button onClick={() => setNoOverlayDrawerOpen(true)}>Open Drawer without Overlay</Button>
                        <Drawer isOpen={isNoOverlayDrawerOpen} onClose={() => setNoOverlayDrawerOpen(false)} position="right" showOverlay={false} title="No Overlay">
                            <p>This drawer doesn't have a backdrop overlay.</p>
                            <p>You can still interact with the page content behind it.</p>
                            <p>Use the close button or press ESC to close.</p>
                        </Drawer>
                    </div>
                </div>
            </section>
        </div>
    );
};
