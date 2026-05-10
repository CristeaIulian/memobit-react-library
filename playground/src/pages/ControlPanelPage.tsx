import React, { useState } from 'react';

import {
    ControlPanel,
    ControlPanelAction,
    ControlPanelFilter,
    ControlPanelFilterChangeEvent,
    ControlPanelFilterValue,
    ControlPanelClearFiltersEvent,
    ControlPanelNavItem,
    ControlPanelOptionChangeEvent,
    ControlPanelViewMode,
} from '../../../src';

export const ControlPanelPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<ControlPanelViewMode>('cards');
    const [groupBy, setGroupBy] = useState<string | null>(null);
    const [visibleColumns, setVisibleColumns] = useState(['name', 'status', 'owner', 'priority']);
    const [activeNavItem, setActiveNavItem] = useState<string>('overview');

    const [filterValues, setFilterValues] = useState<Record<string, ControlPanelFilterValue>>({
        scope: 'all',
        status: ['in-progress', 'review'],
        owner: 'team',
        price: [undefined, undefined] as unknown as number[],
        'due-date-range': ['', ''],
    });

    const [libraryFilterValues, setLibraryFilterValues] = useState<Record<string, ControlPanelFilterValue>>({
        ownership: 'lent-out',
        categories: ['fiction', 'essays', 'non-fiction', 'sci-fi', 'poetry', 'fantasy', 'travel', 'science', 'art', 'classics'],
        languages: ['english', 'japanese', 'spanish', 'german', 'french', 'portuguese', 'italian'],
    });

    const [optionValues, setOptionValues] = useState<Record<string, ControlPanelFilterValue>>({
        priority: 'medium',
        tags: ['urgent', 'frontend'],
    });

    const workspaceFilters: ControlPanelFilter[] = [
        {
            id: 'scope',
            label: 'Scope',
            icon: 'filters',
            type: 'radio',
            value: filterValues.scope,
            options: [
                { label: 'All records', value: 'all', count: 42 },
                { label: 'Assigned to me', value: 'mine', count: 11 },
                { label: 'Watching', value: 'watching', count: 7 },
            ],
        },
        {
            id: 'status',
            label: 'Status',
            icon: 'status',
            type: 'chips',
            value: filterValues.status,
            isActive: Array.isArray(filterValues.status) && (filterValues.status as string[]).length > 0,
            options: [
                { label: 'New', value: 'new', color: '#38bdf8', count: 9 },
                { label: 'In progress', value: 'in-progress', color: '#f59e0b', count: 14 },
                { label: 'Review', value: 'review', color: '#a855f7', count: 6 },
                { label: 'Done', value: 'done', color: '#22c55e', count: 13 },
            ],
        },
        {
            id: 'price',
            label: 'Price',
            type: 'range',
            value: filterValues.price,
            min: 0,
            max: 10000,
            step: 10,
            isActive: Array.isArray(filterValues.price) && (filterValues.price as number[]).some(v => v !== undefined),
        },
        {
            id: 'due-date-range',
            label: 'Due date',
            icon: 'calendar',
            type: 'date-range',
            value: filterValues['due-date-range'],
            isActive: Array.isArray(filterValues['due-date-range']) && (filterValues['due-date-range'] as string[]).some(v => !!v),
        },
        {
            id: 'owner',
            label: 'Owner',
            icon: 'user',
            type: 'dropdown',
            value: filterValues.owner,
            isActive: !!filterValues.owner && filterValues.owner !== 'team',
            placeholder: 'Choose owner',
            options: [
                { label: 'Whole team', value: 'team' },
                { label: 'Iulia', value: 'iulia' },
                { label: 'Product', value: 'product' },
                { label: 'Engineering', value: 'engineering' },
            ],
        },
    ];

    const libraryFilters: ControlPanelFilter[] = [
        {
            id: 'ownership',
            label: 'Ownership',
            type: 'radio',
            value: libraryFilterValues.ownership,
            options: [
                { label: 'All', value: 'all', count: 26 },
                { label: 'Owned', value: 'owned', count: 20 },
                { label: 'Borrowed', value: 'borrowed', count: 2 },
                { label: 'Wishlist', value: 'wishlist', count: 4 },
                { label: 'Lent out', value: 'lent-out', count: 0 },
            ],
        },
        {
            id: 'categories',
            label: 'Categories',
            type: 'chips',
            value: libraryFilterValues.categories,
            isActive: Array.isArray(libraryFilterValues.categories) && (libraryFilterValues.categories as string[]).length > 0,
            options: [
                { label: 'Fiction', value: 'fiction', count: 9 },
                { label: 'Essays', value: 'essays', count: 6 },
                { label: 'Non-fiction', value: 'non-fiction', count: 4 },
                { label: 'Sci-Fi', value: 'sci-fi', count: 3 },
                { label: 'Poetry', value: 'poetry', count: 3 },
                { label: 'Fantasy', value: 'fantasy', count: 2 },
                { label: 'Travel', value: 'travel', count: 2 },
                { label: 'Science', value: 'science', count: 2 },
                { label: 'Art', value: 'art', count: 2 },
                { label: 'Classics', value: 'classics', count: 2 },
            ],
        },
        {
            id: 'languages',
            label: 'Languages',
            type: 'chips',
            value: libraryFilterValues.languages,
            isActive: Array.isArray(libraryFilterValues.languages) && (libraryFilterValues.languages as string[]).length > 0,
            options: [
                { label: 'English', value: 'english', count: 19 },
                { label: 'Japanese', value: 'japanese', count: 2 },
                { label: 'Spanish', value: 'spanish', count: 1 },
                { label: 'German', value: 'german', count: 1 },
                { label: 'French', value: 'french', count: 1 },
                { label: 'Portuguese', value: 'portuguese', count: 1 },
                { label: 'Italian', value: 'italian', count: 1 },
            ],
        },
    ];

    const workspaceActions: ControlPanelAction[] = [
        {
            id: 'new-record',
            label: 'New record',
            icon: 'plus',
            variant: 'info',
            onClick: () => undefined,
        },
    ];

    const libraryActions: ControlPanelAction[] = [
        {
            id: 'add-book',
            label: 'Add a book',
            icon: 'plus',
            variant: 'info',
            onClick: () => undefined,
        },
    ];

    const navigation: ControlPanelNavItem[] = [
        {
            id: 'overview',
            label: 'Overview',
            icon: 'dashboard',
            isActive: activeNavItem === 'overview',
            onClick: () => setActiveNavItem('overview'),
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: 'chart',
            isActive: activeNavItem === 'analytics',
            onClick: () => setActiveNavItem('analytics'),
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: 'settings',
            isActive: activeNavItem === 'settings',
            onClick: () => setActiveNavItem('settings'),
        },
        {
            id: 'help',
            label: 'Help',
            icon: 'information',
            isActive: activeNavItem === 'help',
            onClick: () => setActiveNavItem('help'),
        },
    ];

    const handleFilterChange = (event: ControlPanelFilterChangeEvent) => {
        setFilterValues(prev => ({ ...prev, [event.filterId]: event.value }));
    };

    const clearFilters = (_event: ControlPanelClearFiltersEvent) => {
        setFilterValues({ scope: 'all', status: [], owner: null, price: [], 'due-date-range': ['', ''] });
    };

    const handleLibraryFilterChange = (event: ControlPanelFilterChangeEvent) => {
        setLibraryFilterValues(prev => ({ ...prev, [event.filterId]: event.value }));
    };

    const handleOptionChange = (event: ControlPanelOptionChangeEvent) => {
        setOptionValues(prev => ({ ...prev, [event.optionId]: event.value as ControlPanelFilterValue }));
    };

    const activeFilterCount = Object.entries(filterValues).filter(([, v]) => {
        if (v === null || v === undefined || v === '') return false;
        if (Array.isArray(v) && v.length === 0) return false;
        if (v === 'all' || v === 'team') return false;
        return true;
    }).length;

    return (
        <div className="sidebar-page">
            <h1>ControlPanel Component</h1>
            <p>A panel component for filters, view options, grouping, and visible columns.</p>

            <section className="page-section">
                <h2>Filters with Options</h2>

                <div className="showcase-group">
                    <h3>Workspace — Filters, View Toggle, Group By, Visible Columns</h3>
                    <div style={{ display: 'flex', minHeight: '680px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <ControlPanel
                            header={{ icon: 'M', siteName: 'Memobit', heading: 'Product workspace' }}
                            actions={workspaceActions}
                            filters={workspaceFilters}
                            filtersCount={activeFilterCount}
                            onFilterChange={handleFilterChange}
                            onClearFilters={clearFilters}
                            viewToggle={{ value: viewMode, onChange: setViewMode }}
                            groupBy={{
                                value: groupBy,
                                options: [
                                    { value: 'owner', label: 'Owner' },
                                    { value: 'status', label: 'Status' },
                                    { value: 'priority', label: 'Priority' },
                                ],
                                onChange: setGroupBy,
                            }}
                            visibleColumns={{
                                value: visibleColumns,
                                options: [
                                    { value: 'name', label: 'Name' },
                                    { value: 'status', label: 'Status' },
                                    { value: 'owner', label: 'Owner' },
                                    { value: 'priority', label: 'Priority' },
                                    { value: 'due-date', label: 'Due date' },
                                    { value: 'created-at', label: 'Created at' },
                                ],
                                onChange: setVisibleColumns,
                            }}
                            isOpen={true}
                            width="320px"
                            borderRadius="8px 0 0 8px"
                            shadow="0 8px 24px rgba(0, 0, 0, 0.18)"
                        />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Workspace Content</h3>
                            <p>
                                View mode: <strong>{viewMode}</strong>
                            </p>
                            <p>
                                Group by: <strong>{groupBy ?? 'none'}</strong>
                            </p>
                            <p>
                                Visible columns: <strong>{visibleColumns.join(', ')}</strong>
                            </p>
                            <p>
                                Scope: <strong>{String(filterValues.scope ?? 'none')}</strong>
                            </p>
                            <p>
                                Status:{' '}
                                <strong>
                                    {Array.isArray(filterValues.status)
                                        ? (filterValues.status as string[]).join(', ') || 'none'
                                        : String(filterValues.status ?? 'none')}
                                </strong>
                            </p>
                            <p>
                                Owner: <strong>{String(filterValues.owner ?? 'none')}</strong>
                            </p>
                            <p>
                                Price:{' '}
                                <strong>{Array.isArray(filterValues.price) ? (filterValues.price as number[]).map(v => v ?? '—').join(' – ') : 'none'}</strong>
                            </p>
                            <p>
                                Due date:{' '}
                                <strong>
                                    {Array.isArray(filterValues['due-date-range'])
                                        ? (filterValues['due-date-range'] as string[]).map(v => v || '—').join(' → ')
                                        : 'none'}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Library — Filters Only (no Options)</h3>
                    <div style={{ display: 'flex', minHeight: '980px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <ControlPanel
                            header={{ icon: 'A', siteName: 'Armoire', heading: 'A reading life' }}
                            actions={libraryActions}
                            filters={libraryFilters}
                            onFilterChange={handleLibraryFilterChange}
                            isOpen={true}
                            width="340px"
                            borderRadius="18px"
                            margin="24px"
                            shadow="0 16px 32px rgba(0, 0, 0, 0.16)"
                        />
                        <div style={{ flex: 1, padding: '32px', background: 'var(--body-background)' }}>
                            <h3>Reading Shelf</h3>
                            <p>
                                Ownership: <strong>{String(libraryFilterValues.ownership ?? 'none')}</strong>
                            </p>
                            <p>
                                Categories:{' '}
                                <strong>
                                    {Array.isArray(libraryFilterValues.categories) ? (libraryFilterValues.categories as string[]).join(', ') : 'none'}
                                </strong>
                            </p>
                            <p>
                                Languages:{' '}
                                <strong>
                                    {Array.isArray(libraryFilterValues.languages) ? (libraryFilterValues.languages as string[]).join(', ') : 'none'}
                                </strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Options Only (no Filters)</h2>

                <div className="showcase-group">
                    <h3>Custom Options — Checkbox, Radio, Chips</h3>
                    <div style={{ display: 'flex', minHeight: '400px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <ControlPanel
                            header={{ icon: '⚙', siteName: 'Settings' }}
                            options={[
                                {
                                    id: 'priority',
                                    label: 'Priority',
                                    type: 'radio',
                                    value: optionValues.priority as string,
                                    options: [
                                        { value: 'low', label: 'Low' },
                                        { value: 'medium', label: 'Medium' },
                                        { value: 'high', label: 'High' },
                                    ],
                                },
                                {
                                    id: 'tags',
                                    label: 'Tags',
                                    type: 'chips',
                                    value: (optionValues.tags as Array<string | number>) ?? [],
                                    options: [
                                        { value: 'urgent', label: 'Urgent' },
                                        { value: 'frontend', label: 'Frontend' },
                                        { value: 'backend', label: 'Backend' },
                                        { value: 'design', label: 'Design' },
                                        { value: 'bug', label: 'Bug' },
                                    ],
                                },
                                { id: 'compact', label: 'Compact mode', type: 'checkbox', value: false },
                                { id: 'animations', label: 'Animations', type: 'checkbox', value: true },
                            ]}
                            onOptionChange={handleOptionChange}
                            isOpen={true}
                            width="280px"
                        />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Settings Preview</h3>
                            <p>
                                Priority: <strong>{String(optionValues.priority ?? 'none')}</strong>
                            </p>
                            <p>
                                Tags: <strong>{Array.isArray(optionValues.tags) ? (optionValues.tags as string[]).join(', ') || 'none' : 'none'}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Minimal — View Toggle Only</h2>

                <div className="showcase-group">
                    <h3>Just the View Toggle</h3>
                    <div style={{ display: 'flex', height: '200px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <ControlPanel viewToggle={{ value: viewMode, onChange: setViewMode }} isOpen={true} width="240px" />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <p>
                                View mode: <strong>{viewMode}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Navigation with Icons</h2>

                <div className="showcase-group">
                    <h3>Navigation Items with Icons</h3>
                    <div style={{ display: 'flex', minHeight: '320px', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
                        <ControlPanel header={{ icon: '⚡', siteName: 'Dashboard' }} navigation={navigation} isOpen={true} width="280px" />
                        <div style={{ flex: 1, padding: '16px', background: 'var(--body-background)' }}>
                            <h3>Current Section</h3>
                            <p>
                                Active: <strong>{navigation.find(item => item.isActive)?.label}</strong>
                            </p>
                            <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>
                                Navigation items now support an optional <code>icon</code> prop that accepts any IconName to display an icon before the label.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
