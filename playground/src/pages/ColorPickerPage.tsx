import React, { useState } from 'react';

import { ColorPicker } from '../../../src';

export const ColorPickerPage: React.FC = () => {
    const [color, setColor] = useState('#4e79a7');
    const [panelColor, setPanelColor] = useState('#e15759');

    return (
        <div className="component-page">
            <h1>Color Picker</h1>
            <p>HSV picker with hex and RGB entry.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Pick a brand color</h3>
                    <div className="component-group">
                        <ColorPicker value={color} onChange={setColor} />
                    </div>
                    <p>Selected color: {color}</p>
                </div>

                <div className="showcase-group">
                    <h3>Bare, in a side panel</h3>
                    <p>
                        <code>bare</code> drops the card around the picker and lets it fill its container. The gradient&apos;s height follows the{' '}
                        <code>--color-picker-field-height</code> custom property.
                    </p>
                    <div
                        className="component-group"
                        style={{
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            width: 'var(--spacing-300)',
                            padding: 'var(--spacing-12)',
                            background: 'var(--card-background-color)',
                            border: '1px solid var(--border-color)',
                            ['--color-picker-field-height' as string]: 'var(--spacing-100)',
                        }}
                    >
                        <strong>Colors</strong>
                        <ColorPicker value={panelColor} onChange={setPanelColor} bare />
                    </div>
                </div>
            </section>
        </div>
    );
};
