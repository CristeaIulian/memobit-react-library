import React, { useState } from 'react';

import { Tree, TreeNode } from '../../../src';

// ── Icons (inline SVG — swap for your icon library) ───────────────────────────

const Icon = {
    Folder: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 4H8.621a1.5 1.5 0 0 1-1.06-.44L6.439 2.44A1.5 1.5 0 0 0 5.379 2H1.5Z" />
        </svg>
    ),
    FolderOpen: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M1 3.5A1.5 1.5 0 0 1 2.5 2h2.764c.958 0 1.76.56 2.311 1.184C7.985 3.648 8.48 4 9 4h4.5A1.5 1.5 0 0 1 15 5.5v.64c.57.265.94.876.856 1.546l-.64 5.124A2.5 2.5 0 0 1 12.733 15H3.266a2.5 2.5 0 0 1-2.481-2.19l-.64-5.124A1.5 1.5 0 0 1 1 6.14V3.5z" />
        </svg>
    ),
    File: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5.414A2 2 0 0 0 13.414 4L10 .586A2 2 0 0 0 8.586 0H4zm0 1h4.586a1 1 0 0 1 .707.293L12.707 4.707A1 1 0 0 1 13 5.414V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
        </svg>
    ),
    Ts: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="#3b82f6">
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm5.5 8.5H8V13H7V8.5H5.5V7.5h4v1z" />
        </svg>
    ),
    Scss: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="#f472b6">
            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4zm2 7h4v1H6V7zm0 2h4v1H6V9zm0 2h2v1H6v-1z" />
        </svg>
    ),
    User: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.029 10 8 10c-2.029 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
        </svg>
    ),
    Team: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
    ),
    Tag: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z" />
            <path d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z" />
        </svg>
    ),
    Lock: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
        </svg>
    ),
    Globe: () => (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539c.142-.384.304-.744.481-1.078a6.7 6.7 0 0 1 .597-.933A7.01 7.01 0 0 0 3.051 3.05c.362.184.763.349 1.198.49zM3.509 7.5c.036-1.07.188-2.087.436-3.008a9.124 9.124 0 0 1-1.565-.667A6.964 6.964 0 0 0 1.018 7.5h2.49zm1.4-2.741a12.344 12.344 0 0 0-.4 2.741H7.5V5.091c-.91-.03-1.783-.145-2.591-.332zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5c.035.987.176 1.914.399 2.741A13.612 13.612 0 0 1 7.5 10.91V8.5H4.51zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696c.12.312.252.604.395.872.552 1.035 1.218 1.65 1.887 1.855V12.41a8.96 8.96 0 0 1-2.282.287zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964A13.36 13.36 0 0 1 3.508 8.5h-2.49a6.963 6.963 0 0 0 1.362 3.675c.47-.258.995-.482 1.565-.667zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 12.41v2.112c.67-.204 1.335-.82 1.887-1.855.143-.268.276-.56.395-.872A8.963 8.963 0 0 1 8.5 12.41zm3.324-.865c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.992 8.5h-2.49a13.36 13.36 0 0 1-.436 3.008zm.168-4.008h2.49a6.964 6.964 0 0 0-1.362-3.675c-.47.258-.995.482-1.565.667.248.92.4 1.937.437 3.008z" />
        </svg>
    ),
};

// ── Data sets ─────────────────────────────────────────────────────────────────

const fileExplorerNodes: TreeNode[] = [
    {
        id: 'src',
        label: 'src',
        icon: <Icon.FolderOpen />,
        defaultExpanded: true,
        badge: 12,
        children: [
            {
                id: 'components',
                label: 'components',
                icon: <Icon.Folder />,
                defaultExpanded: true,
                badge: 6,
                children: [
                    { id: 'timeline', label: 'Timeline.tsx', icon: <Icon.Ts /> },
                    { id: 'timeline-scss', label: 'Timeline.scss', icon: <Icon.Scss /> },
                    { id: 'tree', label: 'Tree.tsx', icon: <Icon.Ts />, variant: 'info' },
                    { id: 'tree-scss', label: 'Tree.scss', icon: <Icon.Scss /> },
                    { id: 'button', label: 'Button.tsx', icon: <Icon.Ts /> },
                    { id: 'modal', label: 'Modal.tsx', icon: <Icon.Ts /> },
                ],
            },
            {
                id: 'styles',
                label: 'styles',
                icon: <Icon.Folder />,
                children: [
                    { id: 'vars', label: 'variables.scss', icon: <Icon.Scss /> },
                    { id: 'arctic', label: 'arctic-blue.scss', icon: <Icon.Scss />, variant: 'info' },
                ],
            },
            {
                id: 'utils',
                label: 'utils',
                icon: <Icon.Folder />,
                children: [
                    { id: 'hooks', label: 'hooks.ts', icon: <Icon.Ts /> },
                    { id: 'helpers', label: 'helpers.ts', icon: <Icon.Ts /> },
                ],
            },
            { id: 'index', label: 'index.ts', icon: <Icon.Ts /> },
        ],
    },
    {
        id: 'public',
        label: 'public',
        icon: <Icon.Folder />,
        children: [
            { id: 'index-html', label: 'index.html', icon: <Icon.File /> },
            { id: 'favicon', label: 'favicon.svg', icon: <Icon.File /> },
        ],
    },
    { id: 'pkg', label: 'package.json', icon: <Icon.File /> },
    { id: 'tsconfig', label: 'tsconfig.json', icon: <Icon.File />, disabled: true },
];

const orgChartNodes: TreeNode[] = [
    {
        id: 'ceo',
        label: 'Alice Chen — CEO',
        icon: <Icon.User />,
        variant: 'info',
        defaultExpanded: true,
        children: [
            {
                id: 'vp-eng',
                label: 'Bob Torres — VP Engineering',
                icon: <Icon.User />,
                variant: 'success',
                defaultExpanded: true,
                badge: 4,
                children: [
                    { id: 'fe-lead', label: 'Clara Kim — Frontend Lead', icon: <Icon.User />, badge: 3 },
                    { id: 'be-lead', label: 'David Osei — Backend Lead', icon: <Icon.User />, badge: 5 },
                    { id: 'devops', label: 'Elena Rossi — DevOps', icon: <Icon.User /> },
                    { id: 'sec', label: 'Frank Müller — Security', icon: <Icon.Lock />, variant: 'warning' },
                ],
            },
            {
                id: 'vp-product',
                label: 'Grace Liu — VP Product',
                icon: <Icon.User />,
                variant: 'success',
                badge: 2,
                children: [
                    { id: 'pm1', label: 'Hiro Tanaka — Product Manager', icon: <Icon.User /> },
                    { id: 'ux', label: 'Iris Patel — UX Designer', icon: <Icon.User /> },
                ],
            },
            {
                id: 'vp-mkt',
                label: 'James Park — VP Marketing',
                icon: <Icon.User />,
                variant: 'success',
                children: [
                    { id: 'content', label: 'Kaia Andersen — Content', icon: <Icon.User /> },
                    { id: 'growth', label: 'Liam Souza — Growth', icon: <Icon.User /> },
                ],
            },
        ],
    },
];

const categoryNodes: TreeNode[] = [
    {
        id: 'frontend',
        label: 'Frontend',
        icon: <Icon.Globe />,
        defaultExpanded: true,
        badge: 9,
        children: [
            {
                id: 'react',
                label: 'React',
                icon: <Icon.Tag />,
                badge: 4,
                children: [
                    { id: 'hooks', label: 'Hooks', badge: 12 },
                    { id: 'context', label: 'Context API', badge: 5 },
                    { id: 'perf', label: 'Performance', badge: 8, variant: 'warning' },
                    { id: 'testing', label: 'Testing', badge: 3 },
                ],
            },
            {
                id: 'css',
                label: 'CSS / SCSS',
                icon: <Icon.Tag />,
                badge: 3,
                children: [
                    { id: 'grid', label: 'Grid & Flexbox', badge: 7 },
                    { id: 'animations', label: 'Animations', badge: 4 },
                    { id: 'tokens', label: 'Design Tokens', badge: 6, variant: 'info' },
                ],
            },
            { id: 'a11y', label: 'Accessibility', icon: <Icon.Tag />, badge: 2, variant: 'success' },
        ],
    },
    {
        id: 'backend',
        label: 'Backend',
        icon: <Icon.Globe />,
        badge: 5,
        children: [
            { id: 'api', label: 'REST & GraphQL', badge: 9 },
            { id: 'db', label: 'Databases', badge: 11 },
            { id: 'auth', label: 'Auth & Security', badge: 6, variant: 'danger' },
        ],
    },
    {
        id: 'devops-cat',
        label: 'DevOps',
        icon: <Icon.Globe />,
        badge: 3,
        children: [
            { id: 'ci', label: 'CI/CD', badge: 5 },
            { id: 'docker', label: 'Containers', badge: 4 },
            { id: 'monitoring', label: 'Monitoring', badge: 7, variant: 'warning' },
        ],
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export const TreePage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

    return (
        <div className="component-page">
            <h1>Tree Component</h1>
            <p>Hierarchical expandable nodes — useful for file explorers, org charts, and nested categories.</p>

            {/* ── File explorer ──────────────────────────────────────── */}
            <section className="page-section">
                <h2>File Explorer</h2>
                <p className="section-description">
                    Selectable nodes with typed file icons. The active file is highlighted with an accent bar. Disabled nodes (e.g. <code>tsconfig.json</code>)
                    are non-interactive.
                </p>
                <div className="showcase-group">
                    <Tree nodes={fileExplorerNodes} selectable showGuides onSelect={n => setSelectedFile(String(n.label))} />
                    {selectedFile && (
                        <p style={{ marginTop: 'var(--spacing-12)', fontSize: 'var(--font-size-xs)', color: 'var(--body-color-muted)' }}>
                            Selected: <strong style={{ color: 'var(--body-accent-color)' }}>{selectedFile}</strong>
                        </p>
                    )}
                </div>
            </section>

            {/* ── Org chart ──────────────────────────────────────────── */}
            <section className="page-section">
                <h2>Org Chart</h2>
                <p className="section-description">
                    Uses <code>variant</code> on branch nodes and numeric <code>badge</code> to show report counts. Selecting a node fires <code>onSelect</code>
                    .
                </p>
                <div className="showcase-group">
                    <Tree nodes={orgChartNodes} selectable showGuides onSelect={n => setSelectedPerson(String(n.label))} />
                    {selectedPerson && (
                        <p style={{ marginTop: 'var(--spacing-12)', fontSize: 'var(--font-size-xs)', color: 'var(--body-color-muted)' }}>
                            Selected: <strong style={{ color: 'var(--body-accent-color)' }}>{selectedPerson}</strong>
                        </p>
                    )}
                </div>
            </section>

            {/* ── Nested categories ──────────────────────────────────── */}
            <section className="page-section">
                <h2>Nested Categories</h2>
                <p className="section-description">
                    Read-only tree (<code>selectable=&#123;false&#125;</code>) with <code>badge</code> counts and status variants for at-a-glance category
                    health.
                </p>
                <div className="showcase-group">
                    <Tree nodes={categoryNodes} selectable={false} showGuides />
                </div>
            </section>

            {/* ── No guides ──────────────────────────────────────────── */}
            <section className="page-section">
                <h2>Without Indent Guides</h2>
                <p className="section-description">
                    Set <code>showGuides=&#123;false&#125;</code> for a cleaner, less structured look suited to sparse hierarchies.
                </p>
                <div className="showcase-group">
                    <Tree nodes={fileExplorerNodes.slice(0, 2)} showGuides={false} selectable />
                </div>
            </section>
        </div>
    );
};
