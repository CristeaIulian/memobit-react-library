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
                <Button prefixIcon="🎨" onClick={() => setIsThemeSettingsOpen(true)}>
                    Change theme
                </Button>
            </div>

            <ThemeSettings isOpen={isThemeSettingsOpen} onClose={() => setIsThemeSettingsOpen(false)} />
        </div>
    );
};
