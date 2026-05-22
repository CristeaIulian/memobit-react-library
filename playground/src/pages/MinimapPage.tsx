import React, { useMemo, useState } from 'react';

import { Minimap, type MinimapBand } from '../../../src';

const clampWindowStart = (start: number, width: number): number => Math.max(0, Math.min(1 - width, start));

const formatPercent = (value: number): string => `${Math.round(value * 100)}%`;

const buildActivityBuckets = (length: number, offset = 0): number[] =>
    Array.from({ length }, (_, index) => {
        const wave = Math.sin((index + offset) / 4) * 18 + Math.cos((index + offset) / 9) * 12;
        const pulse = index % 17 === 0 ? 42 : index % 11 === 0 ? 24 : 0;
        return Math.max(4, Math.round(38 + wave + pulse));
    });

const deploymentBuckets = buildActivityBuckets(72);
const logBuckets = buildActivityBuckets(96, 9);
const codeBuckets = buildActivityBuckets(60, 18).map((value, index) => (index > 18 && index < 34 ? value + 28 : value));

const chartData = Array.from({ length: 160 }, (_, index) => {
    const baseline = 62 + Math.sin(index / 7) * 18 + Math.cos(index / 17) * 10;
    const releaseLift = index > 54 && index < 82 ? 18 : 0;
    const incidentDip = index > 116 && index < 128 ? -24 : 0;
    return Math.max(12, Math.round(baseline + releaseLift + incidentDip));
});

const chartBuckets = chartData.map(value => Math.round(value / 2));

const deploymentBands: MinimapBand[] = [
    { start: 0.08, end: 0.18, color: 'rgba(34, 197, 94, 0.65)' },
    { start: 0.32, end: 0.38, color: 'rgba(245, 158, 11, 0.72)' },
    { start: 0.62, end: 0.78, color: 'rgba(59, 130, 246, 0.7)' },
    { start: 0.84, end: 0.9, color: 'rgba(239, 68, 68, 0.72)' },
];

const reviewBands: MinimapBand[] = [
    { start: 0.16, end: 0.3, color: 'rgba(59, 130, 246, 0.64)' },
    { start: 0.44, end: 0.58, color: 'rgba(168, 85, 247, 0.62)' },
    { start: 0.72, end: 0.88, color: 'rgba(34, 197, 94, 0.64)' },
];

const chartBands: MinimapBand[] = [
    { start: 0.34, end: 0.5, color: 'rgba(34, 197, 94, 0.62)' },
    { start: 0.72, end: 0.8, color: 'rgba(239, 68, 68, 0.68)' },
];

const logRows = Array.from({ length: 48 }, (_, index) => ({
    id: index + 1,
    service: ['api', 'worker', 'billing', 'search'][index % 4],
    level: index % 13 === 0 ? 'error' : index % 7 === 0 ? 'warn' : 'info',
    message: ['Request batch completed', 'Queue latency sampled', 'Cache segment refreshed', 'Webhook delivery acknowledged', 'Background job checkpointed'][
        index % 5
    ],
}));

interface ExampleFrameProps {
    title: string;
    children: React.ReactNode;
    meta?: React.ReactNode;
}

const ExampleFrame: React.FC<ExampleFrameProps> = ({ title, children, meta }) => (
    <div className="showcase-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--spacing-16)', alignItems: 'baseline' }}>
            <h3>{title}</h3>
            {meta && <span style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-sm)' }}>{meta}</span>}
        </div>
        <div style={{ marginTop: 'var(--spacing-16)' }}>{children}</div>
    </div>
);

interface ChartPreviewProps {
    values: number[];
    startIndex: number;
}

const ChartPreview: React.FC<ChartPreviewProps> = ({ values, startIndex }) => {
    const width = 720;
    const height = 220;
    const padding = 28;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(1, max - min);
    const points = values.map((value, index) => {
        const x = padding + (index / Math.max(1, values.length - 1)) * (width - padding * 2);
        const y = padding + ((max - value) / range) * (height - padding * 2);
        return { x, y, value };
    });
    const linePoints = points.map(point => `${point.x},${point.y}`).join(' ');
    const areaPoints = [`${padding},${height - padding}`, ...points.map(point => `${point.x},${point.y}`), `${width - padding},${height - padding}`].join(' ');
    const latest = values[values.length - 1] ?? 0;

    return (
        <div
            style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
                background: 'var(--card-background-color)',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 'var(--spacing-12)',
                    padding: 'var(--spacing-12) var(--spacing-16)',
                    borderBottom: '1px solid var(--border-color)',
                }}
            >
                <strong>Conversion rate</strong>
                <span style={{ color: 'var(--body-color-muted)', fontSize: 'var(--font-size-sm)' }}>
                    Points {startIndex + 1}-{startIndex + values.length} / latest {latest}
                </span>
            </div>

            <svg viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%', height: 'auto' }}>
                {[0.25, 0.5, 0.75].map(mark => (
                    <line
                        key={mark}
                        x1={padding}
                        x2={width - padding}
                        y1={padding + mark * (height - padding * 2)}
                        y2={padding + mark * (height - padding * 2)}
                        stroke="var(--border-color)"
                        strokeDasharray="4 8"
                    />
                ))}
                <polygon points={areaPoints} fill="var(--body-accent-color)" opacity="0.14" />
                <polyline points={linePoints} fill="none" stroke="var(--body-accent-color)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                {points.length > 0 && (
                    <circle
                        cx={points[points.length - 1].x}
                        cy={points[points.length - 1].y}
                        r="6"
                        fill="var(--card-background-color)"
                        stroke="var(--body-accent-color)"
                        strokeWidth="4"
                    />
                )}
            </svg>
        </div>
    );
};

export const MinimapPage: React.FC = () => {
    const [deploymentStart, setDeploymentStart] = useState(0.18);
    const [reviewStart, setReviewStart] = useState(0.42);
    const [logStart, setLogStart] = useState(0.24);
    const [chartStart, setChartStart] = useState(0.36);
    const [compactStart, setCompactStart] = useState(0);

    const deploymentWindow = 0.18;
    const reviewWindow = 0.28;
    const logWindow = 0.16;
    const chartWindow = 0.22;
    const compactWindow = 0.4;

    const visibleLogRows = useMemo(() => {
        const visibleCount = 8;
        const maxStart = logRows.length - visibleCount;
        const startIndex = Math.round(logStart * maxStart);
        return logRows.slice(startIndex, startIndex + visibleCount);
    }, [logStart]);

    const visibleChart = useMemo(() => {
        const visibleCount = Math.max(12, Math.round(chartData.length * chartWindow));
        const maxStart = chartData.length - visibleCount;
        const startIndex = Math.round(chartStart * maxStart);
        return {
            startIndex,
            values: chartData.slice(startIndex, startIndex + visibleCount),
        };
    }, [chartStart]);

    return (
        <div className="component-page">
            <h1>Minimap Component</h1>
            <p>A compact overview strip for dense timelines, logs, and review surfaces. Drag or click the track to move the active viewport.</p>

            <section className="page-section">
                <h2>Timeline Density</h2>
                <ExampleFrame title="Deployment activity" meta={`${formatPercent(deploymentStart)} - ${formatPercent(deploymentStart + deploymentWindow)}`}>
                    <Minimap
                        caption="72 buckets, colored release windows"
                        buckets={deploymentBuckets}
                        bands={deploymentBands}
                        viewportStart={deploymentStart}
                        viewportEnd={deploymentStart + deploymentWindow}
                        onScrub={start => setDeploymentStart(clampWindowStart(start, deploymentWindow))}
                    />
                </ExampleFrame>

                <ExampleFrame title="Code review sweep" meta={`${formatPercent(reviewStart)} - ${formatPercent(reviewStart + reviewWindow)}`}>
                    <Minimap
                        caption="Wider viewport for grouped review"
                        buckets={codeBuckets}
                        bands={reviewBands}
                        viewportStart={reviewStart}
                        viewportEnd={reviewStart + reviewWindow}
                        onScrub={start => setReviewStart(clampWindowStart(start, reviewWindow))}
                    />
                </ExampleFrame>
            </section>

            <section className="page-section">
                <h2>Log Explorer</h2>
                <ExampleFrame title="Scrub the minimap to page through rows">
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'minmax(0, 1fr)',
                            gap: 'var(--spacing-16)',
                        }}
                    >
                        <Minimap
                            caption="Log volume"
                            buckets={logBuckets}
                            viewportStart={logStart}
                            viewportEnd={logStart + logWindow}
                            onScrub={start => setLogStart(clampWindowStart(start, logWindow))}
                        />

                        <div
                            style={{
                                border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius)',
                                overflow: 'hidden',
                            }}
                        >
                            {visibleLogRows.map(row => (
                                <div
                                    key={row.id}
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '64px 90px 72px minmax(0, 1fr)',
                                        gap: 'var(--spacing-12)',
                                        padding: 'var(--spacing-8) var(--spacing-12)',
                                        borderBottom: '1px solid var(--border-color)',
                                        fontSize: 'var(--font-size-sm)',
                                    }}
                                >
                                    <span style={{ color: 'var(--body-color-muted)' }}>#{row.id}</span>
                                    <strong>{row.service}</strong>
                                    <span
                                        style={{
                                            color:
                                                row.level === 'error'
                                                    ? 'var(--rating-color-danger)'
                                                    : row.level === 'warn'
                                                      ? 'var(--rating-color-warning)'
                                                      : 'var(--rating-color-success)',
                                        }}
                                    >
                                        {row.level}
                                    </span>
                                    <span>{row.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </ExampleFrame>
            </section>

            <section className="page-section">
                <h2>Chart Navigation</h2>
                <ExampleFrame title="Scrub through a long chart" meta={`${formatPercent(chartStart)} - ${formatPercent(chartStart + chartWindow)}`}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 'var(--spacing-16)' }}>
                        <ChartPreview values={visibleChart.values} startIndex={visibleChart.startIndex} />
                        <Minimap
                            caption="Full chart density"
                            buckets={chartBuckets}
                            bands={chartBands}
                            viewportStart={chartStart}
                            viewportEnd={chartStart + chartWindow}
                            onScrub={start => setChartStart(clampWindowStart(start, chartWindow))}
                        />
                    </div>
                </ExampleFrame>
            </section>

            <section className="page-section">
                <h2>Compact Overview</h2>
                <ExampleFrame title="Large visible range">
                    <Minimap
                        caption="Summary range"
                        buckets={deploymentBuckets.slice(0, 36)}
                        viewportStart={compactStart}
                        viewportEnd={compactStart + compactWindow}
                        onScrub={start => setCompactStart(clampWindowStart(start, compactWindow))}
                    />
                </ExampleFrame>
            </section>
        </div>
    );
};
