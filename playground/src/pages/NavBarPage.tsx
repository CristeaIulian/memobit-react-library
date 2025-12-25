import React, { useState } from 'react';

import { NavBar, NavBarItem, Button } from '../../../src';

export const NavBarPage: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('home');

    const basicItems: NavBarItem[] = [
        {
            id: 'home',
            label: 'Home',
            isActive: activeItem === 'home',
            onClick: () => setActiveItem('home'),
        },
        {
            id: 'about',
            label: 'About',
            isActive: activeItem === 'about',
            onClick: () => setActiveItem('about'),
        },
        {
            id: 'services',
            label: 'Services',
            isActive: activeItem === 'services',
            onClick: () => setActiveItem('services'),
        },
        {
            id: 'contact',
            label: 'Contact',
            isActive: activeItem === 'contact',
            onClick: () => setActiveItem('contact'),
        },
    ];

    const itemsWithIcons: NavBarItem[] = [
        {
            id: 'home',
            label: 'Home',
            icon: '🏠',
            isActive: activeItem === 'home',
            onClick: () => setActiveItem('home'),
        },
        {
            id: 'explore',
            label: 'Explore',
            icon: '🔍',
            isActive: activeItem === 'explore',
            onClick: () => setActiveItem('explore'),
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: '🔔',
            isActive: activeItem === 'notifications',
            onClick: () => setActiveItem('notifications'),
        },
        {
            id: 'messages',
            label: 'Messages',
            icon: '💬',
            isActive: activeItem === 'messages',
            onClick: () => setActiveItem('messages'),
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: '⚙️',
            isActive: activeItem === 'settings',
            disabled: true,
            onClick: () => setActiveItem('settings'),
        },
    ];

    return (
        <div className="navbar-page">
            <h1>NavBar Component</h1>
            <p>A flexible navigation bar component for building app headers and navigation menus.</p>

            <section className="page-section">
                <h2>Basic Example</h2>

                <div className="showcase-group">
                    <h3>Simple NavBar</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <NavBar items={basicItems} />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Page Content</h3>
                            <p>Active Item: <strong>{activeItem}</strong></p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Logo and Actions</h2>

                <div className="showcase-group">
                    <h3>Full NavBar</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <NavBar
                            items={basicItems}
                            logo={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '24px' }}>🚀</span>
                                    <span style={{ fontWeight: 'bold' }}>MyApp</span>
                                </div>
                            }
                            actions={
                                <>
                                    <Button variant="secondary">Login</Button>
                                    <Button>Sign Up</Button>
                                </>
                            }
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Application Content</h3>
                            <p>Navigation bar with logo on the left and action buttons on the right.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Icons and Disabled Items</h2>

                <div className="showcase-group">
                    <h3>NavBar with Icons</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <NavBar
                            items={itemsWithIcons}
                            logo={<span style={{ fontSize: '24px' }}>📱</span>}
                            actions={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>👤</span>
                                </div>
                            }
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Dashboard</h3>
                            <p>Current section: <strong>{activeItem}</strong></p>
                            <p style={{ fontSize: '14px', color: 'var(--body-color-muted)' }}>
                                Note: Settings is disabled
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Position Variants</h2>

                <div className="showcase-group">
                    <h3>Sticky NavBar</h3>
                    <div style={{ height: '300px', border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'auto' }}>
                        <NavBar items={basicItems} position="sticky" />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Content Area</h3>
                            <p>Scroll down to see the sticky behavior.</p>
                            <div style={{ height: '500px', padding: '16px', background: 'var(--card-background-color)', borderRadius: '8px', marginTop: '16px' }}>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                <p style={{ marginTop: '100px' }}>Keep scrolling...</p>
                                <p style={{ marginTop: '100px' }}>The navbar stays at the top!</p>
                                <p style={{ marginTop: '100px' }}>End of content.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Rendering</h2>

                <div className="showcase-group">
                    <h3>Custom Item Renderer</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <NavBar
                            items={itemsWithIcons}
                            logo={<span style={{ fontSize: '24px' }}>🎨</span>}
                            renderItem={item => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`navbar__item ${item.isActive ? 'navbar__item--active' : ''}`}
                                    onClick={e => {
                                        e.preventDefault();
                                        if (item.onClick) {
                                            item.onClick();
                                        }
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        textDecoration: 'none',
                                        borderRadius: 'var(--radius)',
                                    }}
                                >
                                    {item.icon && <span>{item.icon}</span>}
                                    <span>{item.label}</span>
                                </a>
                            )}
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Custom Rendered Items</h3>
                            <p>Items are rendered as anchor tags with custom styling.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Responsive Behavior</h2>

                <div className="showcase-group">
                    <h3>Mobile-Friendly NavBar</h3>
                    <p style={{ fontSize: '14px', color: 'var(--body-color-muted)', marginBottom: '16px' }}>
                        Resize your browser window to see the responsive behavior. Items will scroll horizontally on smaller screens.
                    </p>
                    <div style={{ border: '1px solid var(--delimiter-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <NavBar
                            items={[
                                ...itemsWithIcons,
                                {
                                    id: 'profile',
                                    label: 'Profile',
                                    icon: '👤',
                                    isActive: activeItem === 'profile',
                                    onClick: () => setActiveItem('profile'),
                                },
                                {
                                    id: 'analytics',
                                    label: 'Analytics',
                                    icon: '📊',
                                    isActive: activeItem === 'analytics',
                                    onClick: () => setActiveItem('analytics'),
                                },
                            ]}
                            logo={<span style={{ fontSize: '24px' }}>📱</span>}
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Responsive Content</h3>
                            <p>The navbar adapts to different screen sizes automatically.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
