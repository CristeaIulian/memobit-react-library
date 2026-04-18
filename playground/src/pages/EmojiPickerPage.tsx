import React, { useState } from 'react';

import { EmojiPicker } from '../../../src';

export const EmojiPickerPage: React.FC = () => {
    const [selected, setSelected] = useState('');
    const [controlled, setControlled] = useState('🎯');

    return (
        <div className="component-page">
            <h1>Emoji Picker</h1>
            <p>Categorized emoji picker with search support. Renders inline — wrap in a Popover for dropdown usage.</p>

            <section className="page-section">
                <h2>Uncontrolled</h2>
                <div className="showcase-group">
                    <h3>Pick any emoji</h3>
                    <div className="component-group">
                        <EmojiPicker onChange={setSelected} />
                    </div>
                    <p>Selected: {selected || '—'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Controlled (with value highlight)</h2>
                <div className="showcase-group">
                    <h3>Pre-selected value is highlighted</h3>
                    <div className="component-group">
                        <EmojiPicker value={controlled} onChange={setControlled} />
                    </div>
                    <p>Selected: {controlled || '—'}</p>
                </div>
            </section>
        </div>
    );
};
