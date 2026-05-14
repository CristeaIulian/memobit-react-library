import { useState } from 'react';

import { Button, Icon, ThemeSettings } from '../../../src';

import './Header.scss';

interface HeaderProps {
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
}

export const Header = ({ isSidebarOpen = false, onToggleSidebar }: HeaderProps) => {
    const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);

    return (
        <div className="appHeader">
            <header className="mobile">
                {onToggleSidebar && (
                    <button className="appHeader__sidebar-toggle" onClick={onToggleSidebar} aria-label="Toggle navigation" aria-expanded={isSidebarOpen}>
                        <Icon name="menu-hamburger" />
                    </button>
                )}
            </header>
            <header className="not-mobile">
                <h1>Component Library Playground</h1>
                <p>Test and preview components before building</p>
            </header>

            <div>
                <Button icon="theme-picker" onClick={() => setIsThemeSettingsOpen(true)}></Button>
            </div>

            <ThemeSettings isOpen={isThemeSettingsOpen} onClose={() => setIsThemeSettingsOpen(false)} />
        </div>
    );
};
