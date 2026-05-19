import React, { useState } from 'react';

import { Badge, Button, Card, SplitPanel } from '../../../src';

// ─── Sample data for the practical demo ──────────────────────────────────────

interface Article {
    id: number;
    title: string;
    category: string;
    date: string;
    content: string;
    tags: string[];
}

const ARTICLES: Article[] = [
    {
        id: 1,
        title: 'Getting Started with React 19',
        category: 'React',
        date: '2026-03-10',
        content:
            'React 19 introduces several exciting features including the new compiler, improved server components, and enhanced concurrent rendering capabilities. This release marks a significant step forward in how we build user interfaces.',
        tags: ['React', 'JavaScript', 'Frontend'],
    },
    {
        id: 2,
        title: 'TypeScript 5.4 — What\'s New',
        category: 'TypeScript',
        date: '2026-03-05',
        content:
            'TypeScript 5.4 brings improved type narrowing in closures, new utility types, and faster compilation times. The team has focused on developer experience improvements and better integration with modern tooling.',
        tags: ['TypeScript', 'Types', 'JavaScript'],
    },
    {
        id: 3,
        title: 'CSS Grid vs Flexbox in 2026',
        category: 'CSS',
        date: '2026-02-28',
        content:
            'Choosing between CSS Grid and Flexbox continues to be a common question. Grid excels at two-dimensional layouts while Flexbox shines for one-dimensional arrangements. Understanding when to use each is key to writing clean, maintainable CSS.',
        tags: ['CSS', 'Layout', 'Frontend'],
    },
    {
        id: 4,
        title: 'Building Accessible UIs',
        category: 'Accessibility',
        date: '2026-02-20',
        content:
            'Accessibility is not an afterthought — it should be built into every component from the start. This article covers ARIA roles, keyboard navigation patterns, focus management, and color contrast requirements that make applications usable by everyone.',
        tags: ['A11y', 'UX', 'Frontend'],
    },
    {
        id: 5,
        title: 'Vite 6 Performance Improvements',
        category: 'Tooling',
        date: '2026-02-14',
        content:
            'Vite 6 delivers significant performance gains through improved module pre-bundling, smarter HMR invalidation, and reduced cold start times. Projects with thousands of modules will see the most dramatic improvements.',
        tags: ['Vite', 'Build Tools', 'Performance'],
    },
];

// ─── Demo containers ──────────────────────────────────────────────────────────

interface DemoBoxProps {
    height?: number;
    children: React.ReactNode;
}

const DemoBox: React.FC<DemoBoxProps> = ({ height = 420, children }) => (
    <div
        style={{
            height,
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            position: 'relative',
        }}
    >
        {children}
    </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export const SplitPanelPage: React.FC = () => {
    // Basic demo
    const [basicOpen, setBasicOpen] = useState(false);

    // Split variants
    const [split3070Open, setSplit3070Open] = useState(false);
    const [split5050Open, setSplit5050Open] = useState(false);
    const [split7030Open, setSplit7030Open] = useState(false);

    // Practical demo — article list + detail
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    return (
        <div>
            <h1>SplitPanel</h1>
            <p>
                A resizable two-pane layout. The left pane holds the primary content; the right pane slides in as a
                detail panel. Users can drag the divider to redistribute space. Pressing <kbd>Esc</kbd> or clicking ✕
                closes the panel.
            </p>

            {/* ── Basic ── */}
            <section className="page-section">
                <h2>Basic</h2>
                <p>Click the button to open the right panel alongside the main content.</p>

                <div className="showcase-group">
                    <div className="component-group">
                        <Button onClick={() => setBasicOpen(true)} disabled={basicOpen}>
                            Open Panel
                        </Button>
                    </div>

                    <DemoBox>
                        <SplitPanel
                            isPanelOpen={basicOpen}
                            onPanelClose={() => setBasicOpen(false)}
                            panelTitle="Detail Panel"
                            panel={
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-12)' }}>
                                    <p>This is the right panel content.</p>
                                    <p>Drag the divider handle to resize both panes.</p>
                                    <p>Press <kbd>Esc</kbd> or click ✕ to close.</p>
                                </div>
                            }
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)', padding: 'var(--spacing-24)' }}>
                                <h3 style={{ margin: 0 }}>Main Content</h3>
                                <p>This is the primary content area. It remains accessible while the panel is open.</p>
                                <p>Both panes scroll independently when content overflows.</p>
                                <Button onClick={() => setBasicOpen(false)} variant="plain">
                                    Close Panel
                                </Button>
                            </div>
                        </SplitPanel>
                    </DemoBox>
                </div>
            </section>

            {/* ── Split variants ── */}
            <section className="page-section">
                <h2>Split Proportions</h2>
                <p>
                    Control the initial split via <code>defaultLeftPercent</code>. The user can always drag to
                    adjust. Use <code>minLeftPercent</code> and <code>minRightPercent</code> to set hard limits.
                </p>

                <div className="showcase-group">
                    <h3>30 / 70 (narrow left)</h3>
                    <div className="component-group">
                        <Button onClick={() => setSplit3070Open(true)} disabled={split3070Open}>
                            Open 30/70
                        </Button>
                    </div>
                    <DemoBox>
                        <SplitPanel
                            isPanelOpen={split3070Open}
                            onPanelClose={() => setSplit3070Open(false)}
                            panelTitle="Wide Detail Panel"
                            defaultLeftPercent={30}
                            panel={<p style={{ padding: 'var(--spacing-16)' }}>Wide right panel (70% by default).</p>}
                        >
                            <div style={{ padding: 'var(--spacing-24)' }}>
                                <h3 style={{ margin: 0 }}>Narrow Left (30%)</h3>
                                <p>Good for list + detail layouts where the list is compact.</p>
                            </div>
                        </SplitPanel>
                    </DemoBox>
                </div>

                <div className="showcase-group">
                    <h3>50 / 50</h3>
                    <div className="component-group">
                        <Button onClick={() => setSplit5050Open(true)} disabled={split5050Open}>
                            Open 50/50
                        </Button>
                    </div>
                    <DemoBox>
                        <SplitPanel
                            isPanelOpen={split5050Open}
                            onPanelClose={() => setSplit5050Open(false)}
                            panelTitle="Equal Split"
                            defaultLeftPercent={50}
                            panel={<p style={{ padding: 'var(--spacing-16)' }}>Right panel at 50% width.</p>}
                        >
                            <div style={{ padding: 'var(--spacing-24)' }}>
                                <h3 style={{ margin: 0 }}>Equal Split (50%)</h3>
                                <p>Both panes get the same initial width.</p>
                            </div>
                        </SplitPanel>
                    </DemoBox>
                </div>

                <div className="showcase-group">
                    <h3>70 / 30 (default)</h3>
                    <div className="component-group">
                        <Button onClick={() => setSplit7030Open(true)} disabled={split7030Open}>
                            Open 70/30
                        </Button>
                    </div>
                    <DemoBox>
                        <SplitPanel
                            isPanelOpen={split7030Open}
                            onPanelClose={() => setSplit7030Open(false)}
                            panelTitle="Narrow Panel"
                            defaultLeftPercent={70}
                            panel={<p style={{ padding: 'var(--spacing-16)' }}>Narrow right panel (30%).</p>}
                        >
                            <div style={{ padding: 'var(--spacing-24)' }}>
                                <h3 style={{ margin: 0 }}>Wide Left (70%)</h3>
                                <p>Good for dashboards where the main content is primary.</p>
                            </div>
                        </SplitPanel>
                    </DemoBox>
                </div>
            </section>

            {/* ── Practical: article list + detail ── */}
            <section className="page-section">
                <h2>Practical Example — List &amp; Detail</h2>
                <p>
                    Click any article row to open its detail in the right panel. This is the primary use case:
                    keeping the list in context while reading the detail.
                </p>

                <DemoBox height={500}>
                    <SplitPanel
                        isPanelOpen={selectedArticle !== null}
                        onPanelClose={() => setSelectedArticle(null)}
                        panelTitle={selectedArticle?.title}
                        defaultLeftPercent={38}
                        minLeftPercent={25}
                        minRightPercent={30}
                        panel={
                            selectedArticle && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
                                        {selectedArticle.tags.map((tag) => (
                                            <Badge key={tag} variant="info" size="small">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--body-sub-title-color)', margin: 0 }}>
                                        Published {selectedArticle.date}
                                    </p>
                                    <p style={{ lineHeight: 'var(--line-height-loose)', margin: 0 }}>
                                        {selectedArticle.content}
                                    </p>
                                </div>
                            )
                        }
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)', padding: 'var(--spacing-16)' }}>
                            <h3 style={{ margin: '0 0 var(--spacing-8)' }}>Articles</h3>
                            {ARTICLES.map((article) => (
                                <Card
                                    key={article.id}
                                    style={{
                                        cursor: 'pointer',
                                        outline: selectedArticle?.id === article.id ? '2px solid var(--body-accent-color)' : 'none',
                                    }}
                                    onClick={() => setSelectedArticle(article)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-8)' }}>
                                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                                            {article.title}
                                        </span>
                                        <Badge variant="default" size="small">{article.category}</Badge>
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--body-sub-title-color)', margin: 'var(--spacing-4) 0 0' }}>
                                        {article.date}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </SplitPanel>
                </DemoBox>
            </section>

            {/* ── Props ── */}
            <section className="page-section">
                <h2>Props</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                            <th style={{ padding: 'var(--spacing-8) var(--spacing-12)' }}>Prop</th>
                            <th style={{ padding: 'var(--spacing-8) var(--spacing-12)' }}>Type</th>
                            <th style={{ padding: 'var(--spacing-8) var(--spacing-12)' }}>Default</th>
                            <th style={{ padding: 'var(--spacing-8) var(--spacing-12)' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            ['children', 'ReactNode', '—', 'Left pane content (primary page).'],
                            ['panel', 'ReactNode', '—', 'Right pane content (detail panel).'],
                            ['isPanelOpen', 'boolean', '—', 'Controls whether the right panel is visible.'],
                            ['onPanelClose', '() => void', '—', 'Called when ✕ is clicked or Esc is pressed.'],
                            ['panelTitle', 'string', 'undefined', 'Optional title shown in the right pane header.'],
                            ['defaultLeftPercent', 'number', '55', 'Initial left pane width as a percentage.'],
                            ['minLeftPercent', 'number', '25', 'Minimum left pane width (drag constraint).'],
                            ['minRightPercent', 'number', '20', 'Minimum right pane width (drag constraint).'],
                            ['className', 'string', "''", 'Extra class applied to the root element.'],
                        ].map(([prop, type, def, desc]) => (
                            <tr key={prop} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: 'var(--spacing-8) var(--spacing-12)', fontFamily: 'monospace' }}>{prop}</td>
                                <td style={{ padding: 'var(--spacing-8) var(--spacing-12)', fontFamily: 'monospace', color: 'var(--body-sub-title-color)' }}>{type}</td>
                                <td style={{ padding: 'var(--spacing-8) var(--spacing-12)', fontFamily: 'monospace', color: 'var(--body-sub-title-color)' }}>{def}</td>
                                <td style={{ padding: 'var(--spacing-8) var(--spacing-12)', color: 'var(--body-sub-title-color)' }}>{desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};
