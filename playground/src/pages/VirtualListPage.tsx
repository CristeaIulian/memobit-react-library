import React, { useMemo, useState } from 'react';

import { Button, Card, VirtualList } from '../../../src';

interface FileRow {
    id: number;
    path: string;
    size: string;
    changedAt: string;
}

interface LogRow {
    id: number;
    level: 'info' | 'warn' | 'error';
    message: string;
}

const FOLDERS = ['photos/2024', 'photos/2025', 'documents/invoices', 'projects/site/src', 'music/live-sets'];
const LEVELS: LogRow['level'][] = ['info', 'info', 'info', 'warn', 'error'];

function buildFiles(count: number): FileRow[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        path: `${FOLDERS[index % FOLDERS.length]}/file-${index.toString().padStart(6, '0')}.${index % 3 === 0 ? 'jpg' : 'txt'}`,
        size: `${((index % 97) + 1) * 13} KB`,
        changedAt: `0${(index % 9) + 1} Aug 2026, 1${index % 10}:24:0${index % 10}`,
    }));
}

function buildLogs(count: number): LogRow[] {
    return Array.from({ length: count }, (_, index) => ({
        id: index,
        level: LEVELS[index % LEVELS.length],
        message: `[${index.toString().padStart(6, '0')}] worker finished batch in ${(index % 400) + 12}ms`,
    }));
}

export const VirtualListPage: React.FC = () => {
    const [count, setCount] = useState(50000);
    const files = useMemo(() => buildFiles(count), [count]);
    const logs = useMemo(() => buildLogs(20000), []);
    const shortList = useMemo(() => buildFiles(4), []);

    return (
        <div className="component-page">
            <h1>Virtual List</h1>
            <p>
                Renders only the rows in view, so a list of tens of thousands of items costs the same handful of DOM nodes as a short one. The rows that are not
                mounted are held open by spacer elements, so the scrollbar, scroll offsets and wheel behaviour stay identical to a fully rendered list.
            </p>

            <section className="page-section">
                <h2>When to reach for it</h2>
                <p>
                    Below a few hundred rows, plain <code>items.map()</code> is simpler and just as fast. Past that — scan results, log streams, search hits,
                    import previews — the cost is not the data but the fibers and DOM nodes React keeps for every row, and that is what this removes.
                </p>
                <p>
                    <strong>Rows must all be the same height.</strong> The list measures one row and multiplies it. Content of variable length needs a fixed
                    height in CSS: clamp text to a set number of lines, fix thumbnail sizes. Rows that disagree with each other will drift out of step with the
                    spacers.
                </p>
            </section>

            <section className="page-section">
                <h2>Basic Usage</h2>
                <div className="showcase-group">
                    <h3>{count.toLocaleString()} rows, a couple of dozen in the DOM</h3>
                    <p>Scroll the list, then inspect it — the row count stays flat no matter how far down you go.</p>
                    <div className="component-group">
                        {[1000, 50000, 250000].map(size => (
                            <Button key={size} size="small" variant={count === size ? 'info' : 'ghost'} onClick={() => setCount(size)}>
                                {size.toLocaleString()} rows
                            </Button>
                        ))}
                    </div>
                    <div className="component-group">
                        <VirtualList
                            className="playground-virtual-list"
                            items={files}
                            getKey={file => file.id}
                            renderItem={file => (
                                <div style={{ padding: 'var(--spacing-12)', border: '1px solid var(--card-border-color)', borderRadius: 'var(--radius-sm)' }}>
                                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>{file.path}</div>
                                    <div style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-xs)' }}>
                                        {file.changedAt} ({file.size})
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Fixed Row Height</h2>
                <div className="showcase-group">
                    <h3>Skipping the measurement</h3>
                    <p>
                        Pass <code>rowHeight</code> when you already know the stride (row height plus the gap below it). The list then never measures, which
                        avoids a first paint at the estimated height.
                    </p>
                    <div className="component-group">
                        <VirtualList
                            className="playground-virtual-list"
                            items={logs}
                            rowHeight={32}
                            maxHeight={260}
                            getKey={row => row.id}
                            renderItem={row => (
                                <div
                                    style={{
                                        height: 20,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-8)',
                                        fontFamily: 'ui-monospace, Consolas, monospace',
                                        fontSize: 'var(--font-size-xs)',
                                    }}
                                >
                                    <span
                                        style={{
                                            color:
                                                row.level === 'error'
                                                    ? 'var(--button-danger-border-color)'
                                                    : row.level === 'warn'
                                                      ? 'var(--button-warning-border-color)'
                                                      : 'var(--body-color-muted)',
                                        }}
                                    >
                                        {row.level.toUpperCase()}
                                    </span>
                                    <span>{row.message}</span>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Long Content</h2>
                <div className="showcase-group">
                    <h3>Clamping keeps rows uniform</h3>
                    <p>
                        The paths here are long enough to wrap. A two-line clamp with a matching fixed height keeps every row identical, and the full value stays
                        reachable through the row&apos;s <code>title</code>.
                    </p>
                    <div className="component-group">
                        <VirtualList
                            className="playground-virtual-list"
                            items={files}
                            maxHeight={240}
                            getKey={file => file.id}
                            renderItem={file => (
                                <div
                                    title={file.path}
                                    style={{
                                        display: '-webkit-box',
                                        WebkitBoxOrient: 'vertical',
                                        WebkitLineClamp: 2,
                                        overflow: 'hidden',
                                        height: 'calc(var(--font-size-sm) * var(--line-height-normal) * 2)',
                                        lineHeight: 'var(--line-height-normal)',
                                        fontSize: 'var(--font-size-sm)',
                                    }}
                                >
                                    {file.path.repeat(3)}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Empty State</h2>
                <div className="showcase-group">
                    <h3>With and without rows</h3>
                    <div className="component-group">
                        <VirtualList
                            items={[]}
                            getKey={(_, index) => index}
                            renderItem={() => null}
                            empty={<div style={{ color: 'var(--body-color-muted)', fontStyle: 'italic' }}>No files matched this filter.</div>}
                        />
                        <VirtualList
                            className="playground-virtual-list"
                            items={shortList}
                            maxHeight={200}
                            getKey={file => file.id}
                            renderItem={file => <div style={{ fontSize: 'var(--font-size-sm)' }}>{file.path}</div>}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>API Reference</h2>
                <Card>
                    <ul>
                        <li>
                            <code>items</code> — the full array. Keep its identity stable; a new array scrolls the list back to the top.
                        </li>
                        <li>
                            <code>renderItem(item, index)</code> — content of one row. The row element itself comes from the list.
                        </li>
                        <li>
                            <code>getKey(item, index)</code> — React key for a row.
                        </li>
                        <li>
                            <code>rowHeight</code> — stride in pixels. Omit to measure it from the rendered rows.
                        </li>
                        <li>
                            <code>overscan</code> — rows kept mounted beyond the viewport. Defaults to 6.
                        </li>
                        <li>
                            <code>maxHeight</code> — height cap for the scroller. Defaults to the stylesheet&apos;s value.
                        </li>
                        <li>
                            <code>empty</code> — rendered instead of the list when there are no items.
                        </li>
                        <li>
                            <code>className</code> / <code>rowClassName</code> — classes for the scroller and each row.
                        </li>
                    </ul>
                </Card>
            </section>
        </div>
    );
};
