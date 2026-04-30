import React, { useState } from 'react';

import { Button, QuickNumberUpdate } from '../../../src';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const QuickNumberUpdatePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [weight, setWeight] = useState(72);

    const handleSave = async (value: number | undefined) => {
        await wait(400);
        if (value !== undefined) {
            setWeight(value);
        }
        setIsOpen(false);
    };

    return (
        <div className="component-page">
            <h1>Quick Number Update Component</h1>
            <p>Compact modal for updating a numeric value.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Update weight</h3>
                    <div className="component-group">
                        <Button variant="info" onClick={() => setIsOpen(true)}>
                            Update value
                        </Button>
                        <span>Current: {weight} kg</span>
                    </div>
                </div>
            </section>

            <QuickNumberUpdate
                isOpen={isOpen}
                title="Weight"
                icon="plus"
                value={weight}
                min={30}
                max={200}
                onClose={() => setIsOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};
