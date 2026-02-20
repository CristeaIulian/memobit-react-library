import React, { useState } from 'react';

import { Button, QuickOptionUpdate } from '../../../src';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const STATUS_OPTIONS = [
    { key: 'todo', label: 'To do' },
    { key: 'progress', label: 'In progress' },
    { key: 'review', label: 'In review' },
    { key: 'done', label: 'Done' },
];

export const QuickOptionUpdatePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState('todo');

    const handleSave = async (value: string | number) => {
        await wait(400);
        if (typeof value === 'string') {
            setStatus(value);
        }
        setIsOpen(false);
    };

    return (
        <div className="component-page">
            <h1>Quick Option Update Component</h1>
            <p>Modal picker for selecting from a short list of options.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Update task status</h3>
                    <div className="component-group">
                        <Button variant="info" onClick={() => setIsOpen(true)}>
                            Change status
                        </Button>
                        <span>Current: {status}</span>
                    </div>
                </div>
            </section>

            <QuickOptionUpdate
                isOpen={isOpen}
                list={STATUS_OPTIONS}
                title="Task status"
                icon="*"
                value={status}
                onClose={() => setIsOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
};
