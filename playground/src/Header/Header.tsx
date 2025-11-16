import { useState } from 'react';

import { Button, MenuHamburgerItem, ThemeModal } from '../../../src';

import './Header.scss';

export const Header = () => {
    const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

    return (
        <div className="appHeader">
            <header style={{ display: 'flex', flexDirection: 'column', rowGap: '8px' }}>
                <h1>Component Library Playground</h1>
                <p>Test and preview components before building</p>
            </header>

            <div>
                <Button prefixIcon="🎨" onClick={() => setIsThemeModalOpen(true)}>
                    Change theme
                </Button>
            </div>

            <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
        </div>
    );
};
