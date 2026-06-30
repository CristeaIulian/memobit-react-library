import React, { useMemo, useState } from 'react';

import { Badge, Button, DataView, InputSearch, ToggleButtons, type DataViewColumn, type DataViewDisplayMode, type SortDirection } from '../../../src';

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
    const [desktopView, setDesktopView] = useState<DataViewDisplayMode>('table');
    const [controlledPage, setControlledPage] = useState(1);
    const [controlledPageSize, setControlledPageSize] = useState(3);
    const [controlledSortKey, setControlledSortKey] = useState<string | null>('score');
    const [controlledSortDirection, setControlledSortDirection] = useState<SortDirection>('desc');
    const [expandedUserId, setExpandedUserId] = useState<number | null>(2);
    const [pinnedUserIds, setPinnedUserIds] = useState<Array<string | number>>([3, 7]);
    const [pinnedSortKey, setPinnedSortKey] = useState<string | null>('score');
    const [pinnedSortDirection, setPinnedSortDirection] = useState<SortDirection>('desc');

    // ── Column selector example ─────────────────────────────────────────
    const columnSelectorOptions = [
        { key: 'name', label: 'Name' },
        { key: 'role', label: 'Role' },
        { key: 'score', label: 'Score' },
        { key: 'status', label: 'Status' },
    ];
    const [visibleColumnKeys, setVisibleColumnKeys] = useState<string[]>(['name', 'role', 'score']);

    const togglePinned = (id: number) => {
        setPinnedUserIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    // ── Filters + Sorting example ───────────────────────────────────────
    const [nameFilter, setNameFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchName = !nameFilter || u.name.toLowerCase().includes(nameFilter.toLowerCase());
            const matchRole = !roleFilter || u.role.toLowerCase().includes(roleFilter.toLowerCase());
            const matchStatus = !statusFilter || u.status.toLowerCase().includes(statusFilter.toLowerCase());
            return matchName && matchRole && matchStatus;
        });
    }, [nameFilter, roleFilter, statusFilter]);

    const controlledSortedUsers = useMemo(() => {
        const next = [...users];
        if (controlledSortKey) {
            next.sort((a, b) => {
                const left = a[controlledSortKey as keyof UserRow];
                const right = b[controlledSortKey as keyof UserRow];
                const comparison = String(left).localeCompare(String(right), undefined, { numeric: true });
                return controlledSortDirection === 'asc' ? comparison : -comparison;
            });
        }
        return next;
    }, [controlledSortDirection, controlledSortKey]);

    const controlledPageUsers = controlledSortedUsers.slice((controlledPage - 1) * controlledPageSize, controlledPage * controlledPageSize);

    const filterColumns: DataViewColumn<UserRow>[] = [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            filter: <InputSearch placeholder="Search name…" value={nameFilter} onChange={setNameFilter} />,
        },
        {
            key: 'role',
            header: 'Role',
            sortable: true,
            filter: <InputSearch placeholder="Search role…" value={roleFilter} onChange={setRoleFilter} />,
        },
        {
            key: 'score',
            header: 'Score',
            sortable: true,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            filter: <InputSearch placeholder="Search status…" value={statusFilter} onChange={setStatusFilter} />,
        },
        {
            key: 'joinedAt',
            header: 'Joined',
            sortable: true,
            hideInCard: true,
        },
    ];

    // ── Basic columns ───────────────────────────────────────────────────

    const basicColumns: DataViewColumn<UserRow>[] = [
        { key: 'name', header: 'Name', icon: 'user', sortable: true },
        { key: 'role', header: 'Role', icon: 'briefcase', sortable: true },
        { key: 'score', header: 'Score', icon: 'speedometer', sortable: true },
        { key: 'status', header: 'Status', icon: 'status' },
    ];

    // ── Card config columns ─────────────────────────────────────────────

    const cardColumns: DataViewColumn<UserRow>[] = [
        { key: 'role', header: 'Role', sortable: true },
        { key: 'score', header: 'Score', sortable: true },
        { key: 'joinedAt', header: 'Joined', hideInCard: true },
    ];

    // ── Medical columns ─────────────────────────────────────────────────

    const medicalColumns: DataViewColumn<TestResult>[] = [
        { key: 'testName', header: 'Test', icon: 'laboratory', sortable: true, hideInCard: true },
        {
            key: 'value',
            header: 'Value',
            icon: 'report',
            accessor: row => `${row.value} ${row.unit}`,
        },
        {
            key: 'status',
            header: 'Status',
            icon: 'status',
            accessor: row => <Badge variant={statusVariantMap[row.status]}>{row.status}</Badge>,
            hideInCard: true,
        },
        { key: 'date', header: 'Date', icon: 'calendar', sortable: true },
        { key: 'clinic', header: 'Clinic', icon: 'building', hideInCard: true },
    ];

    return (
        <div className="component-page">
            <h1>DataView Component</h1>
            <p>
                Responsive data display with table mode (desktop) and card mode (mobile). Supports sorting, selection, column resizing, pagination, timeline
                markers, actions, and card configuration.
            </p>

            {/* Filters + Sorting */}
            <section className="page-section">
                <h2>Filters &amp; Sorting</h2>
                <p>
                    Each column optionally accepts a <code>filter</code> node rendered in a dedicated filter row below the headers. Sorting is built in — click
                    any sortable column header to toggle asc/desc, or expose configured one-way quick sorts with <code>miniSort</code>.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={filterColumns}
                            data={filteredUsers}
                            rowKey={row => row.id}
                            card={{
                                title: row => row.name,
                                subtitle: row => `${row.role} · ${row.status}`,
                                badges: row => (
                                    <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Hold' ? 'warning' : 'danger'}>{row.status}</Badge>
                                ),
                            }}
                            empty={{
                                title: 'No results',
                                description: 'Try changing the filter values.',
                            }}
                            miniSort={{
                                columns: [
                                    { column: 'name' },
                                    { column: 'score', direction: 'desc', icon: 'trend-up', label: 'Top score' },
                                    { column: 'joinedAt', direction: 'desc', icon: 'calendar', label: 'Newest' },
                                ],
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* Column selector */}
            <section className="page-section">
                <h2>Column Selector</h2>
                <p>
                    Pass <code>columnSelector</code> to render a top-row button that opens a checkbox list of selectable column keys. The parent owns the
                    selected keys and is notified via <code>onChange</code>. The button is hidden entirely when <code>options</code> is empty.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns.filter(col => visibleColumnKeys.includes(col.key))}
                            data={users}
                            rowKey={row => row.id}
                            columnSelector={{
                                options: columnSelectorOptions,
                                selectedKeys: visibleColumnKeys,
                                onChange: setVisibleColumnKeys,
                            }}
                            showPageSize={false}
                        />
                    </div>
                    <p>Visible columns: {visibleColumnKeys.join(', ') || '(none)'}</p>
                </div>
            </section>

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

            {/* Desktop view mode */}
            <section className="page-section">
                <h2>Desktop View Toggle</h2>
                <p>
                    Desktop can be forced to table or cards with <code>desktopView</code>. Mobile still renders cards when responsive mode is enabled.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <ToggleButtons
                            state={desktopView}
                            onToggleChange={mode => setDesktopView(mode as DataViewDisplayMode)}
                            states={[
                                { key: 'table', label: 'Table', icon: 'table' },
                                { key: 'cards', label: 'Cards', icon: 'grid' },
                            ]}
                        />
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={users}
                            rowKey={row => row.id}
                            desktopView={desktopView}
                            cardMaxWidth={320}
                            initialSortKey="score"
                            initialSortDirection="desc"
                            card={{
                                title: row => row.name,
                                subtitle: row => `${row.role} / Score ${row.score}`,
                                badges: row => (
                                    <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Hold' ? 'warning' : 'danger'}>{row.status}</Badge>
                                ),
                            }}
                            showPageSize={false}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Controlled Pagination, Sorting and Grouping</h2>
                <p>Controlled props allow server-backed lists to own sorting, page, page size, and selected ids while DataView renders the current slice.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={controlledPageUsers}
                            rowKey={row => row.id}
                            selectable
                            selectedIds={[1, 4]}
                            actionsWidth={180}
                            currentPage={controlledPage}
                            totalItems={controlledSortedUsers.length}
                            totalCount={users.length}
                            initialPageSize={controlledPageSize}
                            pageSizeOptions={[2, 3, 4]}
                            onPageChange={setControlledPage}
                            onPageSizeChange={pageSize => {
                                setControlledPageSize(pageSize);
                                setControlledPage(1);
                            }}
                            sortKey={controlledSortKey}
                            sortDirection={controlledSortDirection}
                            onSortChange={({ key, direction }) => {
                                setControlledSortKey(key);
                                setControlledSortDirection(direction);
                            }}
                            showResultsCount
                            showCardSortControls
                            desktopView="cards"
                            cardMaxWidth={340}
                            itemNoun="team members"
                            rowClassName={row => (row.score >= 90 ? 'is-highlighted' : '')}
                            group={{
                                groupBy: row => row.status,
                                groupLabel: status => status ?? 'No status',
                                collapsible: true,
                            }}
                            card={{
                                title: row => row.name,
                                subtitle: row => `${row.role} / Score ${row.score}`,
                                badges: row => (
                                    <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Hold' ? 'warning' : 'danger'}>{row.status}</Badge>
                                ),
                            }}
                            actions={row => (
                                <Button size="small" variant="ghost" onClick={() => alert(`Queued ${row.name}`)}>
                                    Queue
                                </Button>
                            )}
                        />
                    </div>
                </div>
            </section>

            {/* Pinned rows */}
            <section className="page-section">
                <h2>Pinned Rows</h2>
                <p>
                    Pass <code>pinnedIds</code> to keep specific rows at the top of the list regardless of sorting. Pinned rows appear in the order given in the
                    array and are clearly marked. Use the Pin/Unpin action to toggle, then sort by any column — the pinned rows stay at the top.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={users}
                            rowKey={row => row.id}
                            pinnedIds={pinnedUserIds}
                            sortKey={pinnedSortKey}
                            sortDirection={pinnedSortDirection}
                            onSortChange={({ key, direction }) => {
                                setPinnedSortKey(key);
                                setPinnedSortDirection(direction);
                            }}
                            actions={row => (
                                <Button size="small" variant="ghost" onClick={() => togglePinned(row.id)}>
                                    {pinnedUserIds.includes(row.id) ? 'Unpin' : 'Pin'}
                                </Button>
                            )}
                            showPageSize={false}
                            initialPageSize={5}
                        />
                    </div>
                </div>
            </section>

            {/* Pinned cards */}
            <section className="page-section">
                <h2>Pinned Cards</h2>
                <p>Pinning works in cards mode too — pinned cards display a pin badge and remain first regardless of the active sort order.</p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={users}
                            rowKey={row => row.id}
                            pinnedIds={pinnedUserIds}
                            desktopView="cards"
                            cardMaxWidth={280}
                            initialSortKey="score"
                            initialSortDirection="desc"
                            card={{
                                title: row => row.name,
                                subtitle: row => `${row.role} / Score ${row.score}`,
                                badges: row => (
                                    <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Hold' ? 'warning' : 'danger'}>{row.status}</Badge>
                                ),
                            }}
                            actions={row => (
                                <Button size="small" variant="ghost" onClick={() => togglePinned(row.id)}>
                                    {pinnedUserIds.includes(row.id) ? 'Unpin' : 'Pin'}
                                </Button>
                            )}
                            showPageSize={false}
                            initialPageSize={6}
                        />
                    </div>
                </div>
            </section>

            {/* Row detail */}
            <section className="page-section">
                <h2>Row Detail (Expandable)</h2>
                <p>
                    Pass <code>rowDetail</code> to render an extra row spanning all columns directly below the matching row. Useful for inline players, expanded
                    summaries, or nested content. Table mode only — return <code>null</code> to skip a row. Click a row to toggle the detail.
                </p>
                <div className="showcase-group">
                    <div className="component-group">
                        <DataView<UserRow>
                            columns={basicColumns}
                            data={users.slice(0, 5)}
                            rowKey={row => row.id}
                            onRowClick={row => setExpandedUserId(prev => (prev === row.id ? null : row.id))}
                            rowDetail={row => {
                                if (row.id !== expandedUserId) return null;
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                                        <strong>{row.name}</strong>
                                        <span style={{ color: 'var(--body-color-muted)' }}>
                                            {row.role} · joined {row.joinedAt} · score {row.score}
                                        </span>
                                        <div style={{ display: 'flex', gap: 'var(--spacing-8)', marginTop: 'var(--spacing-8)' }}>
                                            <Button size="small" onClick={() => alert(`Message ${row.name}`)}>
                                                Message
                                            </Button>
                                            <Button size="small" variant="ghost" onClick={() => setExpandedUserId(null)}>
                                                Collapse
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }}
                            showPageSize={false}
                        />
                    </div>
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
                                primary: {
                                    text: 'Add Member',
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
                        <DataView<UserRow> columns={basicColumns} data={users.slice(0, 4)} rowKey={row => row.id} showPageSize={false} />
                    </div>
                </div>
            </section>
        </div>
    );
};
