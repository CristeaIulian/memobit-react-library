import React, { useMemo, useState } from 'react';

import { Badge, MiniSort, type MiniSortDirection, type MiniSortItem } from '../../../src';

import './MiniSortPage.scss';

interface TaskRow {
    id: number;
    title: string;
    owner: string;
    priority: number;
    effort: number;
    updated: string;
    status: 'Ready' | 'Blocked' | 'In Review' | 'Done';
}

const tasks: TaskRow[] = [
    { id: 1, title: 'Billing export', owner: 'Rina', priority: 92, effort: 6, updated: '2026-05-14', status: 'Ready' },
    { id: 2, title: 'Device audit', owner: 'Alex', priority: 74, effort: 3, updated: '2026-05-17', status: 'In Review' },
    { id: 3, title: 'New chart legend', owner: 'Mara', priority: 61, effort: 4, updated: '2026-05-11', status: 'Done' },
    { id: 4, title: 'Policy sync', owner: 'Toma', priority: 88, effort: 8, updated: '2026-05-18', status: 'Blocked' },
    { id: 5, title: 'Import cleanup', owner: 'Noor', priority: 67, effort: 2, updated: '2026-05-16', status: 'Ready' },
];

const quickSortItems: MiniSortItem[] = [
    { value: 'priority', label: 'Highest priority', icon: 'trend-up', direction: 'desc' },
    { value: 'updated', label: 'Recently updated', icon: 'calendar', direction: 'desc' },
    { value: 'effort', label: 'Lowest effort', icon: 'time', direction: 'asc' },
    { value: 'owner', label: 'Owner A-Z', icon: 'user', direction: 'asc' },
];

const toggleSortItems: MiniSortItem[] = [
    { value: 'title', label: 'Title', icon: 'document' },
    { value: 'priority', label: 'Priority', icon: 'trend-up' },
    { value: 'updated', label: 'Updated', icon: 'calendar' },
    { value: 'status', label: 'Status', icon: 'status' },
];

const disabledSortItems: MiniSortItem[] = [
    { value: 'priority', label: 'Priority', icon: 'trend-up', direction: 'desc' },
    { value: 'impact', label: 'Impact', icon: 'target', direction: 'desc', disabled: true },
    { value: 'updated', label: 'Updated', icon: 'calendar', direction: 'desc' },
];

const statusVariant: Record<TaskRow['status'], 'success' | 'warning' | 'info' | 'danger'> = {
    Ready: 'success',
    Blocked: 'danger',
    'In Review': 'warning',
    Done: 'info',
};

const compareValues = (a: string | number, b: string | number, direction: MiniSortDirection): number => {
    const result = typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
    return direction === 'asc' ? result : -result;
};

export const MiniSortPage: React.FC = () => {
    const [quickKey, setQuickKey] = useState('priority');
    const [quickDirection, setQuickDirection] = useState<MiniSortDirection>('desc');
    const [toggleKey, setToggleKey] = useState('updated');
    const [toggleDirection, setToggleDirection] = useState<MiniSortDirection>('desc');

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => compareValues(a[quickKey as keyof TaskRow] as string | number, b[quickKey as keyof TaskRow] as string | number, quickDirection));
    }, [quickDirection, quickKey]);

    const toggleSummary = useMemo(() => {
        const active = toggleSortItems.find(item => item.value === toggleKey);
        return `${active?.label ?? toggleKey} ${toggleDirection === 'asc' ? 'ascending' : 'descending'}`;
    }, [toggleDirection, toggleKey]);

    return (
        <div className="mini-sort-page">
            <h1>MiniSort Component</h1>
            <p>Compact sort controls for cards, toolbars, and mobile-friendly data views.</p>

            <section className="page-section">
                <h2>One-Way Quick Sorts</h2>

                <div className="showcase-group">
                    <h3>Each option owns its direction</h3>
                    <div className="mini-sort-page__toolbar">
                        <MiniSort
                            items={quickSortItems}
                            sortKey={quickKey}
                            sortDirection={quickDirection}
                            onSort={(value, direction) => {
                                setQuickKey(value);
                                setQuickDirection(direction);
                            }}
                        />
                        <span>
                            Active: <strong>{quickSortItems.find(item => item.value === quickKey)?.label}</strong>
                        </span>
                    </div>

                    <div className="mini-sort-table">
                        {sortedTasks.map(task => (
                            <div key={task.id} className="mini-sort-table__row">
                                <strong>{task.title}</strong>
                                <span>{task.owner}</span>
                                <span>Priority {task.priority}</span>
                                <span>{task.effort}h</span>
                                <span>{task.updated}</span>
                                <Badge size="small" variant={statusVariant[task.status]}>
                                    {task.status}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Direction Toggle</h2>

                <div className="showcase-group">
                    <h3>Active column plus separate direction control</h3>
                    <div className="mini-sort-page__toolbar mini-sort-page__toolbar--center">
                        <MiniSort
                            align="center"
                            items={toggleSortItems}
                            sortKey={toggleKey}
                            sortDirection={toggleDirection}
                            showDirectionToggle
                            onSort={(value, direction) => {
                                setToggleKey(value);
                                setToggleDirection(direction);
                            }}
                        />
                        <Badge variant="info">{toggleSummary}</Badge>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Alignment &amp; Disabled Items</h2>

                <div className="showcase-group">
                    <h3>Right-aligned control with an unavailable sort</h3>
                    <div className="mini-sort-page__toolbar">
                        <span>Backlog cards</span>
                        <MiniSort
                            align="right"
                            items={disabledSortItems}
                            sortKey={quickKey}
                            sortDirection={quickDirection}
                            onSort={(value, direction) => {
                                setQuickKey(value);
                                setQuickDirection(direction);
                            }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
