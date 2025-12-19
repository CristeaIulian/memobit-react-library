import React, { useState } from 'react';

import { Textarea } from '../../../src';

export const TextareaPage: React.FC = () => {
    const [textareaField, setTextareaField] = useState<string>('This is a textarea field');

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
        </div>
    );
};
