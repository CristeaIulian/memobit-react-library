import React from 'react';

import { StackedBar } from '../../../src';

export const StackedBarPage: React.FC = () => {
    return (
        <div className="stacked-bar-page">
            <h1>Stacked Bar Component</h1>
            <p>
                A horizontal part-to-whole bar made of multiple labeled segments. Use it whenever you need to show how a total is split across
                categories (macronutrient breakdown, storage by file type, budget by department, etc.).
            </p>

            <section className="page-section">
                <h2>Basic — two segments</h2>

                <div className="showcase-group">
                    <h3>Used vs. remaining</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Used', value: 65, state: 'info' },
                                { label: 'Free', value: 35, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Pass vs. fail</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Passing', value: 82, state: 'success' },
                                { label: 'Failing', value: 18, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Multiple segments</h2>

                <div className="showcase-group">
                    <h3>Macronutrient split (carbs / proteins / lipids)</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Carbs', value: 50, state: 'warning' },
                                { label: 'Proteins', value: 25, state: 'success', pattern: 'hatched' },
                                { label: 'Lipids', value: 25, state: 'info', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>All states side by side</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Default', value: 20, state: 'default' },
                                { label: 'Info', value: 20, state: 'info' },
                                { label: 'Success', value: 20, state: 'success' },
                                { label: 'Warning', value: 20, state: 'warning' },
                                { label: 'Danger', value: 20, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Patterns</h2>

                <div className="showcase-group">
                    <h3>Solid (default)</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'A', value: 40, state: 'success', pattern: 'solid' },
                                { label: 'B', value: 60, state: 'success', pattern: 'solid' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Striped</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Active', value: 60, state: 'info', pattern: 'striped' },
                                { label: 'Idle', value: 40, state: 'default', pattern: 'striped' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Striped & animated</h3>
                    <div>
                        <StackedBar
                            animated
                            segments={[
                                { label: 'Uploading', value: 65, state: 'info', pattern: 'striped' },
                                { label: 'Remaining', value: 35, state: 'default', pattern: 'striped' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Hatched remainder</h3>
                    <p>
                        Useful when one segment is the &quot;rest&quot; that should fade visually. The first segment is solid; the second uses{' '}
                        <code>pattern: &apos;hatched&apos;</code>.
                    </p>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Lipids', value: 35, state: 'success' },
                                { label: 'Other nutrients', value: 65, state: 'success', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Normalization</h2>

                <div className="showcase-group">
                    <h3>Raw values, auto-normalized (default)</h3>
                    <p>
                        Values <code>120 / 80 / 50</code> sum to 250 — the component scales them so they together fill 100% of the bar.
                    </p>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Apples', value: 120, state: 'danger' },
                                { label: 'Pears', value: 80, state: 'success' },
                                { label: 'Plums', value: 50, state: 'info' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Pre-computed percents, no normalization</h3>
                    <p>
                        Pass <code>normalize=false</code> when your values are already percents and you want them rendered as-is (gaps allowed).
                    </p>
                    <div>
                        <StackedBar
                            normalize={false}
                            segments={[
                                { label: 'Done', value: 45, state: 'success' },
                                { label: 'In progress', value: 25, state: 'warning' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Labels &amp; percentages</h2>

                <div className="showcase-group">
                    <h3>Labels only (hide percentage)</h3>
                    <div>
                        <StackedBar
                            showPercentage={false}
                            segments={[
                                { label: 'Carbs', value: 50, state: 'warning' },
                                { label: 'Proteins', value: 25, state: 'success' },
                                { label: 'Lipids', value: 25, state: 'info' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>No inline labels (hover for title)</h3>
                    <div>
                        <StackedBar
                            showLabels={false}
                            segments={[
                                { label: 'Carbs', value: 50, state: 'warning' },
                                { label: 'Proteins', value: 25, state: 'success' },
                                { label: 'Lipids', value: 25, state: 'info' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Narrow segments truncate gracefully — hover any segment to read the full label</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Tiny one', value: 4, state: 'danger' },
                                { label: 'Small slice', value: 8, state: 'warning' },
                                { label: 'Main chunk', value: 70, state: 'success' },
                                { label: 'Edge bit', value: 6, state: 'info' },
                                { label: 'Other', value: 12, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Sizes</h2>

                <div className="showcase-group">
                    <h3>Default height</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'A', value: 30, state: 'success' },
                                { label: 'B', value: 40, state: 'warning' },
                                { label: 'C', value: 30, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Thin</h3>
                    <p>Inline labels are hidden in thin mode; hover still shows them.</p>
                    <div>
                        <StackedBar
                            thin
                            segments={[
                                { label: 'A', value: 30, state: 'success' },
                                { label: 'B', value: 40, state: 'warning' },
                                { label: 'C', value: 30, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom height (32px)</h3>
                    <div>
                        <StackedBar
                            height={32}
                            segments={[
                                { label: 'A', value: 30, state: 'success' },
                                { label: 'B', value: 40, state: 'warning' },
                                { label: 'C', value: 30, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Vertical orientation</h2>
                <p>
                    In vertical mode segments stack <strong>bottom-up</strong> — the first segment in the array sits at the base of the bar, matching the
                    standard stacked-bar-chart convention. Inline labels are hidden (slices are usually too narrow); hover any segment for the full label
                    via the native title tooltip.
                </p>

                <div className="showcase-group">
                    <h3>Default vertical</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '24px' }}>
                        <StackedBar
                            orientation="vertical"
                            segments={[
                                { label: 'Carbs', value: 50, state: 'warning' },
                                { label: 'Proteins', value: 25, state: 'success' },
                                { label: 'Lipids', value: 25, state: 'info' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            segments={[
                                { label: 'Used', value: 70, state: 'info' },
                                { label: 'Free', value: 30, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            segments={[
                                { label: 'Passing', value: 60, state: 'success' },
                                { label: 'Pending', value: 25, state: 'warning' },
                                { label: 'Failing', value: 15, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom height &amp; width</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '24px' }}>
                        <StackedBar
                            orientation="vertical"
                            height={120}
                            segments={[
                                { label: 'A', value: 40, state: 'success' },
                                { label: 'B', value: 60, state: 'warning' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            height={160}
                            segments={[
                                { label: 'A', value: 30, state: 'success' },
                                { label: 'B', value: 50, state: 'info' },
                                { label: 'C', value: 20, state: 'danger' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            height={220}
                            width={28}
                            segments={[
                                { label: 'A', value: 25, state: 'success' },
                                { label: 'B', value: 35, state: 'warning' },
                                { label: 'C', value: 40, state: 'danger' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Vertical, thin</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '24px' }}>
                        <StackedBar
                            orientation="vertical"
                            thin
                            segments={[
                                { label: 'A', value: 30, state: 'success' },
                                { label: 'B', value: 40, state: 'warning' },
                                { label: 'C', value: 30, state: 'danger' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            thin
                            segments={[
                                { label: 'Used', value: 75, state: 'info' },
                                { label: 'Free', value: 25, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Vertical, striped &amp; animated</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '24px' }}>
                        <StackedBar
                            orientation="vertical"
                            animated
                            segments={[
                                { label: 'Active', value: 65, state: 'info', pattern: 'striped' },
                                { label: 'Idle', value: 35, state: 'default', pattern: 'striped' },
                            ]}
                        />
                        <StackedBar
                            orientation="vertical"
                            animated
                            segments={[
                                { label: 'Uploading', value: 50, state: 'success', pattern: 'striped' },
                                { label: 'Queued', value: 30, state: 'warning', pattern: 'striped' },
                                { label: 'Remaining', value: 20, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Dashboard-style row (mixed metrics)</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <StackedBar
                                orientation="vertical"
                                height={140}
                                segments={[
                                    { label: 'User code', value: 45, state: 'info' },
                                    { label: 'System', value: 25, state: 'warning' },
                                    { label: 'Idle', value: 30, state: 'default', pattern: 'hatched' },
                                ]}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--body-color-muted)' }}>CPU</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <StackedBar
                                orientation="vertical"
                                height={140}
                                segments={[
                                    { label: 'In use', value: 78, state: 'success' },
                                    { label: 'Free', value: 22, state: 'default', pattern: 'hatched' },
                                ]}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--body-color-muted)' }}>RAM</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <StackedBar
                                orientation="vertical"
                                height={140}
                                segments={[
                                    { label: 'Photos', value: 35, state: 'info' },
                                    { label: 'Videos', value: 25, state: 'success' },
                                    { label: 'Other', value: 15, state: 'warning' },
                                    { label: 'Free', value: 25, state: 'default', pattern: 'hatched' },
                                ]}
                            />
                            <span style={{ fontSize: '12px', color: 'var(--body-color-muted)' }}>Disk</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Edge cases</h2>

                <div className="showcase-group">
                    <h3>All zeros — empty track</h3>
                    <div>
                        <StackedBar
                            segments={[
                                { label: 'Carbs', value: 0, state: 'warning' },
                                { label: 'Proteins', value: 0, state: 'success' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Single segment</h3>
                    <div>
                        <StackedBar segments={[{ label: 'Only one', value: 100, state: 'success' }]} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Empty segments array</h3>
                    <div>
                        <StackedBar segments={[]} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Vertical with all zeros</h3>
                    <div className="component-group" style={{ alignItems: 'flex-end', gap: '24px' }}>
                        <StackedBar
                            orientation="vertical"
                            segments={[
                                { label: 'A', value: 0, state: 'success' },
                                { label: 'B', value: 0, state: 'warning' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-world example</h2>

                <div className="showcase-group">
                    <h3>Storage breakdown card</h3>
                    <div
                        style={{
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '8px' }}>
                            <strong>Storage Usage</strong>
                        </div>
                        <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--body-color-muted)' }}>7.5 GB of 10 GB used</div>
                        <StackedBar
                            segments={[
                                { label: 'Photos', value: 32, state: 'info' },
                                { label: 'Videos', value: 18, state: 'success' },
                                { label: 'Docs', value: 14, state: 'warning' },
                                { label: 'Other', value: 11, state: 'danger' },
                                { label: 'Free', value: 25, state: 'default', pattern: 'hatched' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
