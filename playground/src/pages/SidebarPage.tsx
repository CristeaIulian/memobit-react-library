import React, { useState } from 'react';

import { Sidebar, SidebarSection, Button } from '../../../src';

export const SidebarPage: React.FC = () => {
    const [activeItem, setActiveItem] = useState<string>('home');
    const [libraryActiveItem, setLibraryActiveItem] = useState<string>('all-books');
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

    const workspaceSections: SidebarSection[] = [
        {
            id: 'workspace',
            title: 'Workspace',
            description: 'Pinned areas and product surfaces.',
            items: [
                {
                    id: 'overview',
                    label: 'Overview',
                    icon: 'O',
                    count: 12,
                    isActive: activeItem === 'overview',
                    onClick: () => setActiveItem('overview'),
                },
                {
                    id: 'roadmap',
                    label: 'Roadmap',
                    emoji: '\u{1F680}',
                    count: 4,
                    isActive: activeItem === 'roadmap',
                    onClick: () => setActiveItem('roadmap'),
                },
                {
                    id: 'blocked',
                    label: 'Blocked',
                    bulletColor: '#f97316',
                    count: 2,
                    isActive: activeItem === 'blocked',
                    onClick: () => setActiveItem('blocked'),
                },
            ],
            showDivider: true,
        },
        {
            id: 'groups',
            title: 'Groups',
            icon: '#',
            items: [
                {
                    id: 'design',
                    label: 'Design',
                    bulletColor: '#38bdf8',
                    count: 8,
                    isActive: activeItem === 'design',
                    onClick: () => setActiveItem('design'),
                },
                {
                    id: 'engineering',
                    label: 'Engineering',
                    bulletColor: '#22c55e',
                    count: 16,
                    isActive: activeItem === 'engineering',
                    onClick: () => setActiveItem('engineering'),
                },
                {
                    id: 'research',
                    label: 'Research',
                    emoji: '\u{1F52C}',
                    count: 5,
                    isActive: activeItem === 'research',
                    onClick: () => setActiveItem('research'),
                },
            ],
        },
    ];

    const librarySections: SidebarSection[] = [
        {
            id: 'library',
            title: 'Library',
            items: [
                {
                    id: 'all-books',
                    label: 'All books',
                    icon: '□',
                    count: 26,
                    isActive: libraryActiveItem === 'all-books',
                    onClick: () => setLibraryActiveItem('all-books'),
                },
                {
                    id: 'reading',
                    label: 'Reading',
                    bulletColor: '#d97729',
                    count: 6,
                    isActive: libraryActiveItem === 'reading',
                    onClick: () => setLibraryActiveItem('reading'),
                },
                {
                    id: 'finished',
                    label: 'Finished',
                    bulletColor: '#3d8b50',
                    count: 10,
                    isActive: libraryActiveItem === 'finished',
                    onClick: () => setLibraryActiveItem('finished'),
                },
                {
                    id: 'want-to-read',
                    label: 'Want to read',
                    bulletColor: '#9a7440',
                    count: 4,
                    isActive: libraryActiveItem === 'want-to-read',
                    onClick: () => setLibraryActiveItem('want-to-read'),
                },
                {
                    id: 'paused',
                    label: 'Paused',
                    bulletColor: '#817b65',
                    count: 2,
                    isActive: libraryActiveItem === 'paused',
                    onClick: () => setLibraryActiveItem('paused'),
                },
                {
                    id: 'abandoned',
                    label: 'Abandoned',
                    bulletColor: '#c77b7b',
                    count: 1,
                    isActive: libraryActiveItem === 'abandoned',
                    onClick: () => setLibraryActiveItem('abandoned'),
                },
                {
                    id: 're-reading',
                    label: 'Re-reading',
                    bulletColor: '#a9652a',
                    count: 3,
                    isActive: libraryActiveItem === 're-reading',
                    onClick: () => setLibraryActiveItem('re-reading'),
                },
            ],
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
                <h2>Rich Navigation</h2>

                <div className="showcase-group">
                    <h3>Groups, Counts and Sections</h3>
                    <div style={{ display: 'flex', minHeight: '420px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <Sidebar
                            sections={workspaceSections}
                            isOpen={true}
                            width="280px"
                            borderRadius="8px 0 0 8px"
                            shadow="0 8px 24px rgba(0, 0, 0, 0.18)"
                        />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Workspace Content</h3>
                            <p>Active Item: {activeItem}</p>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Card Style Sidebar</h3>
                    <div style={{ display: 'flex', height: '420px', background: 'var(--body-background)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                        <Sidebar
                            sections={workspaceSections}
                            isOpen={true}
                            width="280px"
                            margin="16px"
                            borderRadius="8px"
                            shadow="0 4px 18px rgba(0, 0, 0, 0.2)"
                        />
                        <div style={{ flex: 1, padding: '32px 16px', background: 'var(--body-background)' }}>
                            <h3>Decorated Sidebar</h3>
                            <p>Uses the borderRadius, margin and shadow props.</p>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Library Sidebar</h3>
                    <div style={{ display: 'flex', minHeight: '560px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <Sidebar
                            sections={librarySections}
                            isOpen={true}
                            width="280px"
                            borderRadius="18px"
                            margin="24px"
                            shadow="0 16px 32px rgba(0, 0, 0, 0.16)"
                        />
                        <div style={{ flex: 1, padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Reading Shelf</h3>
                            <p>Selected shelf: {libraryActiveItem}</p>
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
                                showOverlay={false}
                                contained
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
