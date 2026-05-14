import React from 'react';

import { Badge, Stats } from '../../../src';

export const StatsPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Stats Component</h1>
            <p>A compact stats strip for displaying grouped metrics, summaries, and lightweight dashboard details.</p>

            <section className="page-section">
                <h2>Default Usage</h2>

                <div className="showcase-group">
                    <h3>Left Aligned with Dividers</h3>
                    <div className="component-group">
                        <Stats
                            items={[
                                { label: 'Revenue', value: '$128,400' },
                                { label: 'Orders', value: '1,248' },
                                { label: 'Conversion', value: '4.8%' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Alignment and Density</h2>

                <div className="showcase-group">
                    <h3>Centered Summary</h3>
                    <div className="component-group">
                        <Stats
                            align="center"
                            items={[
                                { label: 'Completed', value: '42' },
                                { label: 'In Review', value: '7' },
                                { label: 'Blocked', value: '2' },
                            ]}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Compact Without Dividers</h3>
                    <div className="component-group">
                        <Stats
                            size="small"
                            dividers={false}
                            items={[
                                { label: 'CPU', value: '38%' },
                                { label: 'Memory', value: '6.4 GB' },
                                { label: 'Latency', value: '124 ms' },
                                { label: 'Uptime', value: '99.98%' },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Rich Values</h2>

                <div className="showcase-group">
                    <h3>ReactNode Content</h3>
                    <div className="component-group">
                        <Stats
                            items={[
                                {
                                    label: 'Status',
                                    value: <Badge variant="success">Healthy</Badge>,
                                },
                                {
                                    label: 'Response Time',
                                    value: (
                                        <>
                                            187 ms
                                            <span style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-xs)' }}>
                                                avg
                                            </span>
                                        </>
                                    ),
                                },
                                {
                                    label: 'Trend',
                                    value: <span style={{ color: 'var(--color-success-700)' }}>+12.4%</span>,
                                },
                            ]}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Real-World Layout</h2>

                <div className="showcase-group">
                    <h3>Project Snapshot</h3>
                    <div
                        style={{
                            padding: '16px',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <strong>Q2 Website Refresh</strong>
                        </div>
                        <Stats
                            items={[
                                { label: 'Tasks Done', value: '86 / 120' },
                                { label: 'Launch Date', value: 'Jun 28' },
                                { label: 'Owner', value: 'Product Team' },
                            ]}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
