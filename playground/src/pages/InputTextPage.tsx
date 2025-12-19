import React, { useState } from 'react';

import { InputText } from '../../../src';

export const InputTextPage: React.FC = () => {
    const [textField, setTextField] = useState<string>('This is a text field');

    return (
        <div className="input-text-page">
            <h1>Input Text Component</h1>
            <p>A text input component for single-line text entry.</p>

            <section className="page-section">
                <h2>Basic Text Input</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <InputText value={textField} onChange={value => setTextField(value)} />
                    </div>
                </div>
            </section>
        </div>
    );
};
