import { useState } from 'react';

import { Button, ThemeSettings } from '../../../src';

import './Header.scss';

export const Header = () => {
    const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);

    return (
        <div className="appHeader">
            <header className="mobile">Playground</header>
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
