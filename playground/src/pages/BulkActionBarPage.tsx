import { FC, useCallback, useMemo, useState } from 'react';

import { BulkActionBar, Checkbox, type BulkAction } from '../../../src';

interface DemoItem {
    id: number;
    name: string;
    locked?: boolean;
}

const demoItems: DemoItem[] = [
    { id: 1, name: 'Annual report.pdf' },
    { id: 2, name: 'Q4 forecast.xlsx' },
    { id: 3, name: 'Org chart.png' },
    { id: 4, name: 'Brand guidelines.pdf' },
    { id: 5, name: 'Read-only archive.zip', locked: true },
    { id: 6, name: 'Customer survey.csv' },
];

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

export const BulkActionBarPage: FC = () => {
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [running, setRunning] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ done: number; total: number; label: string } | null>(null);
    const [lastResult, setLastResult] = useState<string>('No action run yet.');

    const toggle = useCallback((id: number, checked: boolean) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => setSelected(new Set()), []);

    const runSequentially = useCallback(
        async (actionKey: string, actionLabel: string) => {
            const targets = demoItems.filter(item => selected.has(item.id));
            if (targets.length === 0) return;
            setRunning(actionKey);
            setProgress({ done: 0, total: targets.length, label: actionLabel });
            for (let i = 0; i < targets.length; i++) {
                await sleep(400);
                setProgress({ done: i + 1, total: targets.length, label: actionLabel });
            }
            setLastResult(`${actionLabel} ran on ${targets.length} item(s): ${targets.map(t => t.name).join(', ')}`);
            setRunning(null);
            setProgress(null);
        },
        [selected]
    );

    const archiveActions: BulkAction[] = useMemo(
        () => [
            { key: 'archive', label: 'Archive', icon: 'archive', variant: 'default', onClick: () => runSequentially('archive', 'Archiving') },
            { key: 'download', label: 'Download', icon: 'download', variant: 'info', onClick: () => runSequentially('download', 'Downloading') },
            { key: 'delete', label: 'Delete', icon: 'delete', variant: 'danger', onClick: () => runSequentially('delete', 'Deleting') },
        ],
        [runSequentially]
    );

    const actionsWithBusyState = useMemo<BulkAction[]>(
        () => archiveActions.map(action => ({ ...action, disabled: running !== null })),
        [archiveActions, running]
    );

    const minimalActions: BulkAction[] = useMemo(
        () => [
            { key: 'publish', label: 'Publish', icon: 'checkmark', variant: 'success', onClick: () => setLastResult('Published (no progress demo)') },
            { key: 'reject', label: 'Reject', icon: 'stop', variant: 'danger', onClick: () => setLastResult('Rejected (no progress demo)') },
        ],
        []
    );

    const renderItemList = () => (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--spacing-16)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            {demoItems.map(item => (
                <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-12)' }}>
                    <Checkbox
                        checked={selected.has(item.id)}
                        disabled={item.locked === true || running !== null}
                        onChange={checked => toggle(item.id, checked)}
                        label={item.name}
                    />
                    {item.locked && <span style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-xs)' }}>locked</span>}
                </li>
            ))}
        </ul>
    );

    return (
        <div className="bulk-action-bar-page">
            <h1>Bulk Action Bar Component</h1>
            <p>
                A sticky bar that surfaces actions across a multi-select. Hides itself when nothing is selected. Optional progress display for sequential bulk
                operations.
            </p>

            <section className="page-section">
                <h2>Standard Usage</h2>
                <div className="showcase-group">
                    <h3>Selectable list with three actions</h3>
                    <p style={{ color: 'var(--body-color-muted)', marginTop: 0 }}>
                        Select one or more rows below. Each action waits 400ms per item to simulate work and reports progress in the bar.
                    </p>
                    {renderItemList()}
                    <p style={{ color: 'var(--body-color-muted)' }}>{lastResult}</p>
                    <BulkActionBar selectionCount={selected.size} actions={actionsWithBusyState} progress={progress ?? undefined} onClear={clearSelection} />
                </div>
            </section>

            <section className="page-section">
                <h2>Forced Visible (No Selection Needed)</h2>
                <div className="showcase-group">
                    <h3>Always-visible review bar</h3>
                    <p style={{ color: 'var(--body-color-muted)', marginTop: 0 }}>
                        Pass <code>visible</code> to override the auto-hide-on-zero-selection behavior. Useful for review queues or admin panels.
                    </p>
                    <BulkActionBar selectionCount={0} visible label="Approve or reject the pending submissions" actions={minimalActions} />
                </div>
            </section>

            <section className="page-section">
                <h2>Top Position</h2>
                <div className="showcase-group">
                    <h3>Sticky to top</h3>
                    <p style={{ color: 'var(--body-color-muted)', marginTop: 0 }}>
                        Pass <code>position=&quot;top&quot;</code> to stick the bar to the top of its scroll container.
                    </p>
                    <BulkActionBar
                        selectionCount={3}
                        position="top"
                        label="3 rows selected"
                        actions={[
                            { key: 'approve', label: 'Approve', icon: 'checkmark', variant: 'success', onClick: () => setLastResult('Approved (top demo)') },
                            { key: 'flag', label: 'Flag', icon: 'warning', variant: 'warning', onClick: () => setLastResult('Flagged (top demo)') },
                        ]}
                        onClear={() => setLastResult('Cleared (top demo)')}
                    />
                </div>
            </section>

            <section className="page-section">
                <h2>Bottom Position with Custom Clear Label</h2>
                <div className="showcase-group">
                    <h3>Sticky to bottom</h3>
                    <BulkActionBar
                        selectionCount={2}
                        position="bottom"
                        label="2 previews selected"
                        clearLabel="Deselect previews"
                        actions={[
                            { key: 'export', label: 'Export', icon: 'export', variant: 'info', onClick: () => setLastResult('Exported (bottom demo)') },
                            {
                                key: 'archive-bottom',
                                label: 'Archive',
                                icon: 'archive',
                                variant: 'default',
                                onClick: () => setLastResult('Archived (bottom demo)'),
                            },
                        ]}
                        onClear={() => setLastResult('Deselected (bottom demo)')}
                    />
                </div>
            </section>
        </div>
    );
};
