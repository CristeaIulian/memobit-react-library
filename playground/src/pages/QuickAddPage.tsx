import React, { useState } from 'react';

import { QuickAdd } from '../../../src';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const QuickAddPage: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);

    const handleSave = async (value: string) => {
        await wait(400);
        setItems(prev => [...prev, value]);
    };

    return (
        <div className="component-page">
            <h1>Quick Add Component</h1>
            <p>Button-triggered modal for quick text input.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Create a new tag</h3>
                    <div className="component-group">
                        <QuickAdd
                            buttonText="Add Tag"
                            buttonVariant="info"
                            placeholder="Tag name"
                            title="New tag"
                            icon="+"
                            onSave={handleSave}
                        />
                    </div>
                    <p>Saved: {items.length > 0 ? items.join(', ') : 'No tags yet'}</p>
                </div>
            </section>
        </div>
    );
};
