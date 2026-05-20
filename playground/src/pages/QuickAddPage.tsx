import React, { useState } from 'react';

import { Button, QuickAdd } from '../../../src';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const QuickAddPage: React.FC = () => {
    const [items, setItems] = useState<string[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);
    const [showQuickEdit, setShowQuickEdit] = useState<boolean>(false);

    const handleSave = async (value: string | undefined) => {
        await wait(400);
        setItems(prev => [...prev, value || '']);
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
                        <Button onClick={() => setShowQuickAdd(!showQuickAdd)}>{showQuickAdd ? 'Hide' : 'Show'} Quick Add</Button>
                        {showQuickAdd && (
                            <QuickAdd
                                placeholder="Tag name"
                                title="New tag"
                                titleIcon="plus"
                                isOpen={showQuickAdd}
                                onSave={handleSave}
                                onClose={() => setShowQuickAdd(false)}
                            />
                        )}
                    </div>
                    <p>Saved: {items.length > 0 ? items.join(', ') : 'No tags yet'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Prefilled Portal Modal</h2>
                <div className="showcase-group">
                    <h3>Edit an existing tag</h3>
                    <div className="component-group">
                        <Button onClick={() => setShowQuickEdit(true)}>Open Prefilled Quick Add</Button>
                        {showQuickEdit && (
                            <QuickAdd
                                placeholder="Tag name"
                                title="Rename tag"
                                titleIcon="edit"
                                value="Roadmap"
                                isOpen={showQuickEdit}
                                usePortal
                                onSave={handleSave}
                                onClose={() => setShowQuickEdit(false)}
                            />
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
