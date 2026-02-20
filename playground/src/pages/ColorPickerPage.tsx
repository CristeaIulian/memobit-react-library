import React, { useState } from 'react';

import { ColorPicker } from '../../../src';

export const ColorPickerPage: React.FC = () => {
    const [color, setColor] = useState('#4e79a7');

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
            </section>
        </div>
    );
};
