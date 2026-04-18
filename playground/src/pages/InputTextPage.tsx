import React, { useState } from 'react';

import { InputText } from '../../../src';

export const InputTextPage: React.FC = () => {
    const [textField, setTextField] = useState<string>('This is a text field');
    const [emptyField, setEmptyField] = useState<string>('');
    const [validField, setValidField] = useState<string>('john_doe');

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

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <InputText
                            label="Username"
                            required
                            value={emptyField}
                            onChange={setEmptyField}
                            error={!emptyField ? 'Username is required' : undefined}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <InputText
                            label="Username"
                            value={validField}
                            onChange={setValidField}
                            success="Username is available"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
