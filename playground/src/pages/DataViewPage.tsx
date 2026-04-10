import React, { useState } from 'react';

import { Badge, Button, DataView, type DataViewColumn } from '../../../src';

// ── Basic example ───────────────────────────────────────────────────────────

interface UserRow {
    id: number;
    name: string;
    role: string;
    score: number;
    status: string;
    joinedAt: string;
}

const users: UserRow[] = [
    { id: 1, name: 'Alex Morgan', role: 'Designer', score: 92, status: 'Active', joinedAt: '2024-01-15' },
    { id: 2, name: 'Jamie Lee', role: 'Engineer', score: 81, status: 'Active', joinedAt: '2024-02-20' },
    { id: 3, name: 'Sam Patel', role: 'Product', score: 76, status: 'On Hold', joinedAt: '2024-02-20' },
    { id: 4, name: 'Morgan Yu', role: 'Engineer', score: 88, status: 'Active', joinedAt: '2024-03-10' },
    { id: 5, name: 'Taylor Reed', role: 'Support', score: 69, status: 'Inactive', joinedAt: '2024-03-10' },
    { id: 6, name: 'Jordan Blake', role: 'Marketing', score: 73, status: 'Active', joinedAt: '2024-04-05' },
    { id: 7, name: 'Riley Chen', role: 'Finance', score: 95, status: 'Active', joinedAt: '2024-04-05' },
    { id: 8, name: 'Casey Ortiz', role: 'Engineer', score: 84, status: 'On Hold', joinedAt: '2024-05-12' },
];

// ── Medical-like example ────────────────────────────────────────────────────

interface TestResult {
    id: number;
    testName: string;
    value: string;
    unit: string;
    status: 'normal' | 'high' | 'low';
    date: string;
    clinic: string;
}

const testResults: TestResult[] = [
    { id: 1, testName: 'Hemoglobin', value: '14.2', unit: 'g/dL', status: 'normal', date: '2024-06-15', clinic: 'City Lab' },
    { id: 2, testName: 'Glucose', value: '126', unit: 'mg/dL', status: 'high', date: '2024-06-15', clinic: 'City Lab' },
    { id: 3, testName: 'Cholesterol', value: '210', unit: 'mg/dL', status: 'high', date: '2024-05-20', clinic: 'MedCenter' },
    { id: 4, testName: 'Iron', value: '45', unit: 'ug/dL', status: 'low', date: '2024-05-20', clinic: 'MedCenter' },
    { id: 5, testName: 'Vitamin D', value: '32', unit: 'ng/mL', status: 'normal', date: '2024-04-10', clinic: 'City Lab' },
    { id: 6, testName: 'TSH', value: '2.1', unit: 'mIU/L', status: 'normal', date: '2024-04-10', clinic: 'MedCenter' },
];

const statusVariantMap: Record<string, 'success' | 'danger' | 'warning'> = {
    normal: 'success',
    high: 'danger',
    low: 'warning',
};

export const DataViewPage: React.FC = () => {
    const [selectedCount, setSelectedCount] = useState(0);

    // ── Basic columns ───────────────────────────────────────────────────

    const basicColumns: DataViewColumn<UserRow>[] = [
        { key: 'name', header: 'Name', sortable: true },
        { key: 'role', header: 'Role', sortable: true },
        { key: 'score', header: 'Score', sortable: true },
        { key: 'status', header: 'Status' },
    ];

    // ── Card config columns ─────────────────────────────────────────────

    const cardColumns: DataViewColumn<UserRow>[] = [
        { key: 'role', header: 'Role', sortable: true },
        { key: 'score', header: 'Score', sortable: true },
        { key: 'joinedAt', header: 'Joined', hideInCard: true },
    ];

    // ── Medical columns ─────────────────────────────────────────────────

    const medicalColumns: DataViewColumn<TestResult>[] = [
        { key: 'testName', header: 'Test', sortable: true, hideInCard: true },
        {
            key: 'value',
            header: 'Value',
            accessor: row => `${row.value} ${row.unit}`,
        },
        {
            key: 'status',
            header: 'Status',
            accessor: row => <Badge variant={statusVariantMap[row.status]}>{row.status}</Badge>,
            hideInCard: true,
        },
        { key: 'date', header: 'Date', sortable: true },
        { key: 'clinic', header: 'Clinic', hideInCard: true },
    ];

    return (
        <div className="component-page">
            <h1>DataView Component</h1>
            <p>
                Responsive data display with table mode (desktop) and card mode (mobile). Supports sorting, selection, column resizing, pagination, timeline
                markers, actions, and card configuration.
            </p>

            {/* Basic table */}
            <section className="page-section">
                <h2>Basic Table with Selection</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={users}
                            rowKey={row => row.id}
                            selectable
                            onSelectionChange={rows => setSelectedCount(rows.length)}
                        />
                    </div>
                    <p>Selected rows: {selectedCount}</p>
                </div>
            </section>

            {/* Card config with actions */}
            <section className="page-section">
                <h2>Card Config with Actions</h2>
                <p>On mobile, this renders as cards with title, subtitle, badges, and action buttons.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={cardColumns}
                            data={users}
                            rowKey={row => row.id}
                            card={{
                                title: row => row.name,
                                subtitle: row => `Joined ${row.joinedAt}`,
                                badges: row => (
                                    <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Hold' ? 'warning' : 'danger'}>{row.status}</Badge>
                                ),
                            }}
                            actions={row => (
                                <>
                                    <Button size="small" onClick={() => alert(`Edit ${row.name}`)}>
                                        Edit
                                    </Button>
                                    <Button size="small" variant="danger" onClick={() => alert(`Delete ${row.name}`)}>
                                        Delete
                                    </Button>
                                </>
                            )}
                            onRowClick={row => alert(`Clicked: ${row.name}`)}
                        />
                    </div>
                </div>
            </section>

            {/* Medical-style with timeline */}
            <section className="page-section">
                <h2>Medical Results with Timeline</h2>
                <p>Timeline markers group rows by date. Cards show test name as title with status badge.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<TestResult>
                            columns={medicalColumns}
                            data={testResults}
                            rowKey={row => row.id}
                            card={{
                                title: row => row.testName,
                                subtitle: row => row.clinic,
                                badges: row => <Badge variant={statusVariantMap[row.status]}>{row.status}</Badge>,
                            }}
                            timeline={{
                                dateAccessor: row => row.date,
                                idAccessor: row => row.id,
                            }}
                            actions={row => (
                                <Button size="small" onClick={() => alert(`View ${row.testName}`)}>
                                    View Details
                                </Button>
                            )}
                            onRowClick={row => alert(`Clicked: ${row.testName}`)}
                        />
                    </div>
                </div>
            </section>

            {/* Empty state */}
            <section className="page-section">
                <h2>Empty State</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={[]}
                            empty={{
                                title: 'No team members found',
                                description: 'Add someone to get started.',
                                primaryAction: {
                                    label: 'Add Member',
                                    onClick: () => alert('Add member'),
                                    variant: 'info',
                                },
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Non-responsive (always table) */}
            <section className="page-section">
                <h2>Non-Responsive (Always Table)</h2>
                <p>
                    With <code>responsive=false</code>, the table layout is used even on mobile.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow> columns={basicColumns} data={users.slice(0, 4)} rowKey={row => row.id} responsive={false} showPageSize={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
