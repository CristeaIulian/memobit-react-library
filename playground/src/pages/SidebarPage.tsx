import React, { useState } from 'react';

import { Sidebar, SidebarSection, Button } from '../../../src';

export const SidebarPage: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const dashboardSections: SidebarSection[] = [
        {
            items: [
                {
                    id: 'home',
                    label: 'Home',
                    icon: '🏠',
                    isActive: activeItem === 'home',
                    onClick: () => setActiveItem('home'),
                },
                {
                    id: 'dashboard',
                    label: 'Dashboard',
                    icon: '📊',
                    isActive: activeItem === 'dashboard',
                    onClick: () => setActiveItem('dashboard'),
                },
            ],
            showDivider: true,
        },
        {
            items: [
                {
                    id: 'projects',
                    label: 'Projects',
                    icon: '📁',
                    isActive: activeItem === 'projects',
                    onClick: () => setActiveItem('projects'),
                },
                {
                    id: 'tasks',
                    label: 'Tasks',
                    icon: '✅',
                    isActive: activeItem === 'tasks',
                    onClick: () => setActiveItem('tasks'),
                },
                {
                    id: 'calendar',
                    label: 'Calendar',
                    icon: '📅',
                    isActive: activeItem === 'calendar',
                    onClick: () => setActiveItem('calendar'),
                },
            ],
            showDivider: true,
        },
        {
            items: [
                {
                    id: 'settings',
                    label: 'Settings',
                    icon: '⚙️',
                    isActive: activeItem === 'settings',
                    onClick: () => setActiveItem('settings'),
                },
                {
                    id: 'profile',
                    label: 'Profile',
                    icon: '👤',
                    isActive: activeItem === 'profile',
                    onClick: () => setActiveItem('profile'),
                },
            ],
            showDivider: false,
        },
    ];

    const simpleSections: SidebarSection[] = [
        {
            items: [
                {
                    id: 'item1',
                    label: 'Menu Item 1',
                    isActive: activeItem === 'item1',
                    onClick: () => setActiveItem('item1'),
                },
                {
                    id: 'item2',
                    label: 'Menu Item 2',
                    isActive: activeItem === 'item2',
                    onClick: () => setActiveItem('item2'),
                },
                {
                    id: 'item3',
                    label: 'Menu Item 3',
                    isActive: activeItem === 'item3',
                    onClick: () => setActiveItem('item3'),
                },
            ],
            showDivider: false,
        },
    ];

    return (
        <div className="sidebar-page">
            <h1>Sidebar Component</h1>
            <p>A navigation sidebar component for organizing menu items and sections.</p>

            <section className="page-section">
                <h2>Basic Example</h2>

                <div className="showcase-group">
                    <h3>Simple Sidebar</h3>
                    <div style={{ display: 'flex', height: '400px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <Sidebar sections={simpleSections} isOpen={true} />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Content Area</h3>
                            <p>Active Item: {activeItem}</p>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Sidebar with Icons and Dividers</h3>
                    <div style={{ display: 'flex', height: '500px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <Sidebar sections={dashboardSections} isOpen={true} />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Dashboard Content</h3>
                            <p>Selected: {activeItem}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Toggle Sidebar</h2>

                <div className="showcase-group">
                    <h3>Collapsible Sidebar</h3>
                    <div>
                        <Button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ marginBottom: '16px' }}>
                            {isSidebarOpen ? 'Hide' : 'Show'} Sidebar
                        </Button>
                        <div style={{ display: 'flex', height: '400px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                            <Sidebar sections={dashboardSections} isOpen={isSidebarOpen} />
                            <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                                <h3>Main Content</h3>
                                <p>The sidebar can be toggled on and off.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Mobile Sidebar</h2>

                <div className="showcase-group">
                    <h3>Mobile Overlay Sidebar</h3>
                    <div>
                        <Button onClick={() => setMobileSidebarOpen(!isMobileSidebarOpen)} style={{ marginBottom: '16px' }}>
                            Toggle Mobile Sidebar
                        </Button>
                        <div
                            style={{
                                position: 'relative',
                                height: '400px',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                overflow: 'hidden',
                            }}
                        >
                            {isMobileSidebarOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0, 0, 0, 0.5)',
                                        zIndex: 999,
                                    }}
                                    onClick={() => setMobileSidebarOpen(false)}
                                />
                            )}
                            <Sidebar
                                sections={dashboardSections}
                                isOpen={isMobileSidebarOpen}
                                onClose={() => setMobileSidebarOpen(false)}
                                isMobile={true}
                            />
                            <div style={{ padding: '16px', background: 'var(--body-background)', height: '100%' }}>
                                <h3>Mobile Layout</h3>
                                <p>Sidebar slides in from the left on mobile devices.</p>
                                <p>Click the overlay to close.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Custom Width</h2>

                <div className="showcase-group">
                    <h3>Narrow Sidebar (200px)</h3>
                    <div style={{ display: 'flex', height: '400px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <Sidebar sections={simpleSections} isOpen={true} width="200px" />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Content with Narrow Sidebar</h3>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Wide Sidebar (350px)</h3>
                    <div style={{ display: 'flex', height: '400px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <Sidebar sections={dashboardSections} isOpen={true} width="350px" />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Content with Wide Sidebar</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
