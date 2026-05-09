import React, { useState } from 'react';

import { ToggleButtons } from '../../../src';

export const ToggleButtonsPage: React.FC = () => {
    const [toggleState2, setToggleState2] = useState<string>('option1');
    const [toggleState4, setToggleState4] = useState<string>('view1');

    return (
        <div className="toggle-buttons-page">
            <h1>Toggle Buttons Component</h1>
            <p>A toggle buttons component for switching between multiple options.</p>

            <section className="page-section">
                <h2>Toggle Button Examples</h2>

                <div className="showcase-group">
                    <h3>2 Buttons Toggle</h3>
                    <div className="component-group">
                        <ToggleButtons
                            state={toggleState2}
                            onToggleChange={setToggleState2}
                            states={[
                                { key: 'option1', label: 'List View', icon: 'menu-hamburger' },
                                { key: 'option2', label: 'Grid View', icon: 'grid' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>4 Buttons Toggle</h3>
                    <div className="component-group">
                        <ToggleButtons
                            state={toggleState4}
                            onToggleChange={setToggleState4}
                            states={[
                                { key: 'view1', label: 'Day', icon: 'calendar-day' },
                                { key: 'view2', label: 'Week', icon: 'calendar-week' },
                                { key: 'view3', label: 'Month', icon: 'calendar-month' },
                                { key: 'view4', label: 'Year', icon: 'calendar-year' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
