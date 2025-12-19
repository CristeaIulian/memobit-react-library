import React, { useState } from 'react';

import { Button, ThemeModal } from '../../../src';

export const ThemeModalPage: React.FC = () => {
    const [isThemeModalOpen, setThemeModalOpen] = useState<boolean>(false);

    return (
        <div className="theme-modal-page">
            <h1>Theme Modal Component</h1>
            <p>A modal component for theme selection and customization.</p>

            <section className="page-section">
                <h2>Theme Settings</h2>

                <div className="showcase-group">
                    <h3>Theme Settings with Effects</h3>
                    <div className="component-group">
                        <Button onClick={() => setThemeModalOpen(true)}>Open Theme Settings</Button>
                        <ThemeModal isOpen={isThemeModalOpen} onClose={() => setThemeModalOpen(false)} />
                    </div>
                </div>
            </section>
        </div>
    );
};
