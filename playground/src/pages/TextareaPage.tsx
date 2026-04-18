import React, { useState } from 'react';

import { Textarea } from '../../../src';

export const TextareaPage: React.FC = () => {
    const [textareaField, setTextareaField] = useState<string>('This is a textarea field');
    const [emptyField, setEmptyField] = useState<string>('');
    const [validField, setValidField] = useState<string>('This is a valid description with enough content.');

    return (
        <div className="textarea-page">
            <h1>Textarea Component</h1>
            <p>A textarea component for multi-line text entry.</p>

            <section className="page-section">
                <h2>Basic Textarea</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <Textarea value={textareaField} onChange={value => setTextareaField(value)} />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Validation States</h2>
                <div className="showcase-group">
                    <h3>Error State</h3>
                    <div className="component-group">
                        <Textarea
                            label="Description"
                            required
                            value={emptyField}
                            onChange={setEmptyField}
                            error={!emptyField ? 'Description is required' : undefined}
                        />
                    </div>
                </div>
                <div className="showcase-group">
                    <h3>Success State</h3>
                    <div className="component-group">
                        <Textarea
                            label="Description"
                            value={validField}
                            onChange={setValidField}
                            success="Description meets requirements"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
