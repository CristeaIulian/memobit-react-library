import React, { useState } from 'react';

import { NavBar, NavBarItem, Button, Icon } from '../../../src';

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
            icon: 'home',
            isActive: activeItem === 'home',
            onClick: () => setActiveItem('home'),
        },
        {
            id: 'explore',
            label: 'Explore',
            icon: 'search',
            isActive: activeItem === 'explore',
            onClick: () => setActiveItem('explore'),
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: 'bell',
            isActive: activeItem === 'notifications',
            onClick: () => setActiveItem('notifications'),
        },
        {
            id: 'messages',
            label: 'Messages',
            icon: 'mail',
            isActive: activeItem === 'messages',
            onClick: () => setActiveItem('messages'),
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
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
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar items={basicItems} />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Page Content</h3>
                            <p>
                                Active Item: <strong>{activeItem}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Basic Example with no padding</h2>

                <div className="showcase-group">
                    <h3>Simple NavBar</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar items={basicItems} noPadding />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Page Content</h3>
                            <p>
                                Active Item: <strong>{activeItem}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>With Logo and Actions</h2>

                <div className="showcase-group">
                    <h3>Full NavBar</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar
                            items={basicItems}
                            logo={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Icon name="rocket" size="xxl" />
                                    <span style={{ fontWeight: 'bold' }}>MyApp</span>
                                </div>
                            }
                            actions={
                                <>
                                    <Button variant="warning">Login</Button>
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
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar
                            items={itemsWithIcons}
                            logo={<Icon name="smartphone" size="xxl" />}
                            actions={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '20px', cursor: 'pointer' }}>
                                        <Icon name="user" />
                                    </span>
                                </div>
                            }
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Dashboard</h3>
                            <p>
                                Current section: <strong>{activeItem}</strong>
                            </p>
                            <p style={{ fontSize: '14px', color: 'var(--body-color-muted)' }}>Note: Settings is disabled</p>
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
                            <div
                                style={{ height: '500px', padding: '16px', background: 'var(--card-background-color)', borderRadius: '8px', marginTop: '16px' }}
                            >
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                                <p style={{ marginTop: '100px' }}>Keep scrolling...</p>
                                <p style={{ marginTop: '100px' }}>The navbar stays at the top!</p>
                                <p style={{ marginTop: '100px' }}>End of content.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Static and Fixed NavBars</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar items={basicItems} position="static" />
                    </div>
                    <div style={{ position: 'relative', minHeight: 120, border: '1px solid var(--delimiter-color)', overflow: 'hidden', marginTop: 16 }}>
                        <NavBar items={basicItems} position="fixed" logo={<strong>Fixed demo</strong>} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Rendering</h2>

                <div className="showcase-group">
                    <h3>Custom Item Renderer</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar
                            items={itemsWithIcons}
                            logo={<Icon name="theme-picker" size="xxl" />}
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
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar
                            items={[
                                ...itemsWithIcons,
                                {
                                    id: 'profile',
                                    label: 'Profile',
                                    icon: 'user',
                                    isActive: activeItem === 'profile',
                                    onClick: () => setActiveItem('profile'),
                                },
                                {
                                    id: 'analytics',
                                    label: 'Analytics',
                                    icon: 'chart',
                                    isActive: activeItem === 'analytics',
                                    onClick: () => setActiveItem('analytics'),
                                },
                            ]}
                            logo={<Icon name="smartphone" size="xxl" />}
                        />
                        <div style={{ padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Responsive Content</h3>
                            <p>The navbar adapts to different screen sizes automatically.</p>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Collapsible NavBar</h3>
                    <div style={{ border: '1px solid var(--delimiter-color)', overflow: 'hidden' }}>
                        <NavBar items={[...itemsWithIcons, ...basicItems.map(item => ({ ...item, id: `extra-${item.id}` }))]} collapsible />
                        <div style={{ padding: '24px', background: 'var(--body-background)' }}>
                            <p>Extra items collapse behind the more button until expanded.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
