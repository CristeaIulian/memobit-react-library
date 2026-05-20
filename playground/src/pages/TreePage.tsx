import React, { useState } from 'react';

import { Tree, TreeNode } from '../../../src';
import { categories } from '../../../src/icons/categories';
import { earth } from '../../../src/icons/earth';
import { file } from '../../../src/icons/file';
import { filetypeSass } from '../../../src/icons/filetype-sass';
import { filetypeTypescript } from '../../../src/icons/filetype-typescript';
import { folder } from '../../../src/icons/folder';
import { folderOpen } from '../../../src/icons/folder-open';
import { lock } from '../../../src/icons/lock';
import { user } from '../../../src/icons/user';

// ── Data sets ─────────────────────────────────────────────────────────────────

const fileExplorerNodes: TreeNode[] = [
    {
        id: 'src',
        label: 'src',
        icon: folderOpen,
        defaultExpanded: true,
        badge: 12,
        children: [
            {
                id: 'components',
                label: 'components',
                icon: folder,
                defaultExpanded: true,
                badge: 6,
                children: [
                    { id: 'timeline', label: 'Timeline.tsx', icon: filetypeTypescript },
                    { id: 'timeline-scss', label: 'Timeline.scss', icon: filetypeSass },
                    { id: 'tree', label: 'Tree.tsx', icon: filetypeTypescript, variant: 'info' },
                    { id: 'tree-scss', label: 'Tree.scss', icon: filetypeSass },
                    { id: 'button', label: 'Button.tsx', icon: filetypeTypescript },
                    { id: 'modal', label: 'Modal.tsx', icon: filetypeTypescript },
                ],
            },
            {
                id: 'styles',
                label: 'styles',
                icon: folder,
                children: [
                    { id: 'vars', label: 'variables.scss', icon: filetypeSass },
                    { id: 'arctic', label: 'arctic-blue.scss', icon: filetypeSass, variant: 'info' },
                ],
            },
            {
                id: 'utils',
                label: 'utils',
                icon: folder,
                children: [
                    { id: 'hooks', label: 'hooks.ts', icon: filetypeTypescript },
                    { id: 'helpers', label: 'helpers.ts', icon: filetypeTypescript },
                ],
            },
            { id: 'index', label: 'index.ts', icon: filetypeTypescript },
        ],
    },
    {
        id: 'public',
        label: 'public',
        icon: folder,
        children: [
            { id: 'index-html', label: 'index.html', icon: file },
            { id: 'favicon', label: 'favicon.svg', icon: file },
        ],
    },
    { id: 'pkg', label: 'package.json', icon: file },
    { id: 'tsconfig', label: 'tsconfig.json', icon: file, disabled: true },
];

const orgChartNodes: TreeNode[] = [
    {
        id: 'ceo',
        label: 'Alice Chen — CEO',
        icon: user,
        variant: 'info',
        defaultExpanded: true,
        children: [
            {
                id: 'vp-eng',
                label: 'Bob Torres — VP Engineering',
                icon: user,
                variant: 'success',
                defaultExpanded: true,
                badge: 4,
                children: [
                    { id: 'fe-lead', label: 'Clara Kim — Frontend Lead', icon: user, badge: 3 },
                    { id: 'be-lead', label: 'David Osei — Backend Lead', icon: user, badge: 5 },
                    { id: 'devops', label: 'Elena Rossi — DevOps', icon: user },
                    { id: 'sec', label: 'Frank Müller — Security', icon: lock, variant: 'warning' },
                ],
            },
            {
                id: 'vp-product',
                label: 'Grace Liu — VP Product',
                icon: user,
                variant: 'success',
                badge: 2,
                children: [
                    { id: 'pm1', label: 'Hiro Tanaka — Product Manager', icon: user },
                    { id: 'ux', label: 'Iris Patel — UX Designer', icon: user },
                ],
            },
            {
                id: 'vp-mkt',
                label: 'James Park — VP Marketing',
                icon: user,
                variant: 'success',
                children: [
                    { id: 'content', label: 'Kaia Andersen — Content', icon: user },
                    { id: 'growth', label: 'Liam Souza — Growth', icon: user },
                ],
            },
        ],
    },
];

const categoryNodes: TreeNode[] = [
    {
        id: 'frontend',
        label: 'Frontend',
        icon: earth,
        defaultExpanded: true,
        badge: 9,
        children: [
            {
                id: 'react',
                label: 'React',
                icon: categories,
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
                icon: categories,
                badge: 3,
                children: [
                    { id: 'grid', label: 'Grid & Flexbox', badge: 7 },
                    { id: 'animations', label: 'Animations', badge: 4 },
                    { id: 'tokens', label: 'Design Tokens', badge: 6, variant: 'info' },
                ],
            },
            { id: 'a11y', label: 'Accessibility', icon: categories, badge: 2, variant: 'success' },
        ],
    },
    {
        id: 'backend',
        label: 'Backend',
        icon: earth,
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
        icon: earth,
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

            <section className="page-section">
                <h2>Preselected and Non-Animated</h2>
                <p className="section-description">
                    Use <code>defaultSelectedId</code> to preselect a node and <code>animated=&#123;false&#125;</code> for instant expand/collapse.
                </p>
                <div className="showcase-group">
                    <Tree nodes={fileExplorerNodes} selectable defaultSelectedId="tree" animated={false} />
                </div>
            </section>
        </div>
    );
};
