import React, { useState } from 'react';

import { List } from '../../../src';

const fruits = [
    { id: 1, label: 'Apple' },
    { id: 2, label: 'Banana' },
    { id: 3, label: 'Cherry', disabled: true },
    { id: 4, label: 'Date' },
];

const filters = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This week' },
    { id: 'month', label: 'This month' },
];

export const ListPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<(typeof fruits)[number] | null>(fruits[0]);

    return (
        <div className="component-page">
            <h1>List Component</h1>
            <p>Vertical or horizontal lists with optional selection behavior.</p>

            <section className="page-section">
                <h2>Selectable List</h2>
                <div className="showcase-group">
                    <h3>With active selection</h3>
                    <div className="component-group">
                        <List
                            items={fruits}
                            selectable
                            defaultSelectedId={selectedItem?.id}
                            onSelect={item => setSelectedItem(item)}
                        />
                    </div>
                    <p>Selected: {selectedItem?.label ?? 'None'}</p>
                </div>
            </section>

            <section className="page-section">
                <h2>Horizontal Layout</h2>
                <div className="showcase-group">
                    <h3>Inline filters</h3>
                    <div className="component-group">
                        <List items={filters} direction="horizontal" selectable defaultSelectedId="today" />
                    </div>
                </div>
            </section>
        </div>
    );
};
