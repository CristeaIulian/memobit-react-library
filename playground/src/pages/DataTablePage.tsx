import React, { useState } from 'react';

import { DataTable, type DataTableColumn } from '../../../src';

interface UserRow {
    id: number;
    name: string;
    role: string;
    score: number;
    status: string;
}

const data: UserRow[] = [
    { id: 1, name: 'Alex Morgan', role: 'Designer', score: 92, status: 'Active' },
    { id: 2, name: 'Jamie Lee', role: 'Engineer', score: 81, status: 'Active' },
    { id: 3, name: 'Sam Patel', role: 'Product', score: 76, status: 'On Hold' },
    { id: 4, name: 'Morgan Yu', role: 'Engineer', score: 88, status: 'Active' },
    { id: 5, name: 'Taylor Reed', role: 'Support', score: 69, status: 'Inactive' },
    { id: 6, name: 'Jordan Blake', role: 'Marketing', score: 73, status: 'Active' },
    { id: 7, name: 'Riley Chen', role: 'Finance', score: 95, status: 'Active' },
    { id: 8, name: 'Casey Ortiz', role: 'Engineer', score: 84, status: 'On Hold' },
];

export const DataTablePage: React.FC = () => {
    const [selectedCount, setSelectedCount] = useState(0);

    const columns: DataTableColumn<UserRow>[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'role', header: 'Role', sortable: true },
        { key: 'score', header: 'Score', sortable: true },
        { key: 'status', header: 'Status' },
    ];

    return (
        <div className="component-page">
            <h1>Data Table Component</h1>
            <p>Sortable, selectable, resizable columns with pagination.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Team performance</h3>
                    <div className="component-group">
                        <DataTable<UserRow>
                            columns={columns}
                            data={data}
                            rowKey={row => row.id}
                            selectable
                            onSelectionChange={rows => setSelectedCount(rows.length)}
                        />
                    </div>
                    <p>Selected rows: {selectedCount}</p>
                </div>
            </section>
        </div>
    );
};
