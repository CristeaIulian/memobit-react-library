import React from 'react';

import { MenuHamburger, MenuHamburgerItem } from '../../../src';

export const MenuHamburgerPage: React.FC = () => {
    const hamburgerMenuItems: MenuHamburgerItem[] = [
        {
            label: 'Notes',
            icon: '📚',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Stats',
            icon: '📊',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Theme',
            icon: '🎨',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Logout',
            icon: '🚪',
            onClick: () => {},
            isActive: false,
        },
    ];

    const hamburgerMenuItemsWithSeparators: MenuHamburgerItem[] = [
        {
            label: 'Profile',
            icon: '👤',
            onClick: () => {},
            isActive: true,
        },
        {
            label: 'Settings',
            icon: '⚙️',
            onClick: () => {},
            isActive: false,
        },
        {
            label: 'Theme',
            icon: '🎨',
            onClick: () => {},
            isActive: false,
            separator: true,
        },
        {
            label: 'Help',
            icon: '❓',
            onClick: () => {},
            isActive: false,
            separator: true,
        },
        {
            label: 'Logout',
            icon: '🚪',
            onClick: () => {},
            isActive: false,
        },
    ];

    return (
        <div className="menu-hamburger-page">
            <h1>Menu Hamburger Component</h1>
            <p>A hamburger menu component for navigation.</p>

            <section className="page-section">
                <h2>Menu Hamburger Examples</h2>

                <div className="showcase-group">
                    <h3>MenuHamburger Simple</h3>
                    <div className="component-group">
                        <MenuHamburger items={hamburgerMenuItems} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>MenuHamburger Custom (IsCompact / Mobile)</h3>
                    <div className="component-group">
                        <MenuHamburger items={hamburgerMenuItems} isCompact showLabel={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>MenuHamburger Custom</h3>
                    <div className="component-group">
                        <MenuHamburger items={hamburgerMenuItems} icon="🍓" label="Fruits" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>MenuHamburger with Separators</h3>
                    <div className="component-group">
                        <MenuHamburger items={hamburgerMenuItemsWithSeparators} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>MenuHamburger with Separators (Compact)</h3>
                    <div className="component-group">
                        <MenuHamburger items={hamburgerMenuItemsWithSeparators} isCompact showLabel={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
