import React, { useState } from 'react';

import { Card, Col, Grid, type GridColumns, type GridGap, Slider, ToggleButtons } from '../../../src';

import './GridPage.scss';

const DEMO_GAPS: GridGap[] = ['0', '4', '8', '12', '16', '24', '32'];

const Box: React.FC<{ children: React.ReactNode; tone?: 'accent' }> = ({ children, tone }) => (
    <div className={`grid-demo-box${tone ? ' grid-demo-box--accent' : ''}`}>{children}</div>
);

export const GridPage: React.FC = () => {
    const [cols, setCols] = useState<GridColumns>(3);
    const [gapIndex, setGapIndex] = useState(4);
    const [minColWidth, setMinColWidth] = useState(220);

    return (
        <div className="grid-page">
            <h1>Grid</h1>
            <p>
                A flexbox column grid. Track widths are derived from the column count and the gap, so <code>Col span</code> lines up with plain children. Columns
                collapse on their own at the tablet and mobile breakpoints.
            </p>

            <section className="page-section">
                <h2>Column counts</h2>

                <div className="showcase-group">
                    <h3>Two, three, four</h3>
                    <p>Plain children each take one column — no wrapper needed.</p>

                    <Grid cols={2}>
                        <Box>1</Box>
                        <Box>2</Box>
                    </Grid>

                    <Grid cols={3}>
                        <Box>1</Box>
                        <Box>2</Box>
                        <Box>3</Box>
                    </Grid>

                    <Grid cols={4}>
                        <Box>1</Box>
                        <Box>2</Box>
                        <Box>3</Box>
                        <Box>4</Box>
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Rows wrap on their own</h3>
                    <p>Six children in a three-column grid make two rows.</p>

                    <Grid cols={3}>
                        {Array.from({ length: 6 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>
            </section>

            <section className="page-section">
                <h2>Spanning columns</h2>

                <div className="showcase-group">
                    <h3>Col span</h3>
                    <p>
                        A <code>Col</code> swallows the gaps it crosses, so a <code>span=2</code> ends exactly where two plain children plus their gap would.
                    </p>

                    <Grid cols={3}>
                        <Col span={2}>
                            <Box tone="accent">span 2</Box>
                        </Col>
                        <Box>1</Box>
                    </Grid>

                    <Grid cols={4}>
                        <Col span={3}>
                            <Box tone="accent">span 3</Box>
                        </Col>
                        <Box>1</Box>
                        <Box>1</Box>
                        <Col span={2}>
                            <Box tone="accent">span 2</Box>
                        </Col>
                        <Box>1</Box>
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Main + sidebar</h3>
                    <p>The everyday case: a wide content column beside a narrow one.</p>

                    <Grid cols={3} gap="16">
                        <Col span={2}>
                            <Card title="Content">
                                <p>Two thirds of the row. Resize the window to watch it fold under the sidebar on mobile.</p>
                            </Card>
                        </Col>
                        <Card title="Sidebar">
                            <p>One third.</p>
                        </Card>
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Over-wide spans are clamped</h3>
                    <p>
                        A <code>span</code> larger than the current column count fills the row instead of overflowing — which is also what keeps wide cells sane
                        on small screens.
                    </p>

                    <Grid cols={2}>
                        <Col span={6}>
                            <Box tone="accent">span 6 in a 2-column grid</Box>
                        </Col>
                    </Grid>
                </div>
            </section>

            <section className="page-section">
                <h2>Responsive behaviour</h2>

                <div className="showcase-group">
                    <h3>Defaults</h3>
                    <p>
                        Without any extra props a grid wider than two columns drops to two on tablet and one on mobile. Narrow the browser to see it — the boxes
                        report the breakpoint they are styled for.
                    </p>

                    <Grid cols={4}>
                        {Array.from({ length: 4 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Explicit per-breakpoint columns</h3>
                    <p>
                        <code>colsTablet</code> and <code>colsMobile</code> override the defaults — here six across on desktop, three on tablet, two on mobile.
                    </p>

                    <Grid cols={6} colsMobile={2} colsTablet={3}>
                        {Array.from({ length: 6 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Fluid tracks</h3>
                    <p>
                        <code>minColWidth</code> ignores the column count entirely: children share the row evenly and wrap once they would go below the given
                        width.
                    </p>

                    <Slider max={400} min={120} onChange={setMinColWidth} showValueAtTheRight step={10} thin value={minColWidth} valueSize="sm" />

                    <Grid minColWidth={minColWidth}>
                        {Array.from({ length: 7 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>
            </section>

            <section className="page-section">
                <h2>Gap and alignment</h2>

                <div className="showcase-group">
                    <h3>Gap tokens</h3>
                    <p>Gaps come from the spacing scale only.</p>

                    <ToggleButtons
                        onToggleChange={value => setGapIndex(DEMO_GAPS.indexOf(value as GridGap))}
                        size="small"
                        state={DEMO_GAPS[gapIndex]}
                        states={DEMO_GAPS.map(gap => ({ key: gap, label: gap }))}
                    />

                    <Grid cols={4} gap={DEMO_GAPS[gapIndex]}>
                        {Array.from({ length: 8 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Separate row gap</h3>
                    <p>
                        <code>rowGap</code> lets rows breathe differently from columns.
                    </p>

                    <Grid cols={4} gap="4" rowGap="24">
                        {Array.from({ length: 8 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Vertical alignment</h3>
                    <p>
                        <code>align</code> decides what uneven children do. <code>stretch</code> is the default, which is what keeps card rows even.
                    </p>

                    <Grid align="center" cols={3}>
                        <Box>short</Box>
                        <div className="grid-demo-box grid-demo-box--tall">tall</div>
                        <Box>short</Box>
                    </Grid>

                    <Grid align="stretch" cols={3}>
                        <Box>short</Box>
                        <div className="grid-demo-box grid-demo-box--tall">tall</div>
                        <Box>short</Box>
                    </Grid>
                </div>

                <div className="showcase-group">
                    <h3>Justifying a short row</h3>
                    <p>
                        <code>justify</code> distributes a row that does not fill its columns.
                    </p>

                    <Grid cols={4} justify="center">
                        <Box>1</Box>
                        <Box>2</Box>
                    </Grid>

                    <Grid cols={4} justify="end">
                        <Box>1</Box>
                        <Box>2</Box>
                    </Grid>
                </div>
            </section>

            <section className="page-section">
                <h2>Playground</h2>

                <div className="showcase-group">
                    <h3>Pick a column count</h3>

                    <ToggleButtons
                        onToggleChange={value => setCols(Number(value) as GridColumns)}
                        size="small"
                        state={String(cols)}
                        states={[1, 2, 3, 4, 5, 6, 8, 12].map(count => ({ key: String(count), label: String(count) }))}
                    />

                    <Grid cols={cols} gap={DEMO_GAPS[gapIndex]}>
                        {Array.from({ length: 12 }, (_, index) => (
                            <Box key={index}>{index + 1}</Box>
                        ))}
                    </Grid>
                </div>
            </section>
        </div>
    );
};
