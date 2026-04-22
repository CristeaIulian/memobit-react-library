import React, { useState } from 'react';

import { Button, ThemeSettings } from '../../../src';

export const ThemeSettingsPage: React.FC = () => {
    const [isThemeSettingsOpen, setThemeSettingsOpen] = useState<boolean>(false);

    return (
        <div className="theme-settings-page">
            <h1>Theme Settings Component</h1>
            <p>A drawer component for theme selection and customization.</p>

            <section className="page-section">
                <h2>Theme Settings</h2>

                <div className="showcase-group">
                    <h3>Theme Settings with Effects</h3>
                    <div className="component-group">
                        <Button onClick={() => setThemeSettingsOpen(true)}>Open Theme Settings</Button>
                        <ThemeSettings isOpen={isThemeSettingsOpen} onClose={() => setThemeSettingsOpen(false)} />
                    </div>
                </div>
            </section>
        </div>
    );
};
