import React, { useState } from 'react';

import { Badge, Button, StickyBar, ToggleSwitch } from '../../../src';

import './StickyBarPage.scss';

const reviewRows = Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    title: ['Invoice variance', 'Device mismatch', 'Coverage review', 'Export warning', 'Late sync', 'Policy exception'][index % 6],
    owner: ['Mira', 'Alex', 'Noor', 'Toma'][index % 4],
    severity: index % 5 === 0 ? 'High' : index % 3 === 0 ? 'Medium' : 'Low',
}));

export const StickyBarPage: React.FC = () => {
    const [bottomVisible, setBottomVisible] = useState(true);
    const [topVisible, setTopVisible] = useState(true);
    const [stackedVisible, setStackedVisible] = useState(true);

    return (
        <div className="sticky-bar-page">
            <h1>StickyBar Component</h1>
            <p>Sticky action surfaces for review queues, selection state, and persistent page controls.</p>

            <section className="page-section">
                <h2>Bottom Action Bar</h2>

                <div className="showcase-group">
                    <h3>Selection summary with close action</h3>
                    <div className="sticky-bar-demo">
                        <div className="sticky-bar-demo__rows">
                            {reviewRows.slice(0, 10).map(row => (
                                <div key={row.id} className="sticky-bar-demo__row">
                                    <strong>{row.title}</strong>
                                    <span>{row.owner}</span>
                                    <Badge variant={row.severity === 'High' ? 'danger' : row.severity === 'Medium' ? 'warning' : 'success'}>
                                        {row.severity}
                                    </Badge>
                                </div>
                            ))}
                        </div>

                        <StickyBar ariaLabel="Selected items actions" visible={bottomVisible} onClose={() => setBottomVisible(false)} closeLabel="Dismiss">
                            <div className="sticky-bar-page__summary">
                                <strong>4 selected</strong>
                                <span>Ready for bulk review</span>
                            </div>
                            <div className="sticky-bar-page__actions">
                                <Button size="small" variant="ghost">
                                    Archive
                                </Button>
                                <Button size="small" variant="info">
                                    Assign
                                </Button>
                            </div>
                        </StickyBar>
                    </div>
                    {!bottomVisible && (
                        <Button size="small" onClick={() => setBottomVisible(true)}>
                            Show Bottom Bar
                        </Button>
                    )}
                </div>
            </section>

            <section className="page-section">
                <h2>Top Sticky Filters</h2>

                <div className="showcase-group">
                    <h3>Top position while scrolling inside a dense panel</h3>
                    <div className="sticky-bar-demo sticky-bar-demo--scroll">
                        <StickyBar position="top" align="start" visible={topVisible} onClose={() => setTopVisible(false)} closeLabel="Hide">
                            <Button size="small" variant="info">
                                Open
                            </Button>
                            <Button size="small" variant="ghost">
                                Assigned to me
                            </Button>
                            <Button size="small" variant="ghost">
                                High severity
                            </Button>
                        </StickyBar>

                        <div className="sticky-bar-demo__rows">
                            {reviewRows.map(row => (
                                <div key={row.id} className="sticky-bar-demo__row">
                                    <strong>
                                        #{row.id} {row.title}
                                    </strong>
                                    <span>{row.owner}</span>
                                    <Badge variant={row.severity === 'High' ? 'danger' : row.severity === 'Medium' ? 'warning' : 'success'}>
                                        {row.severity}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                    {!topVisible && (
                        <Button size="small" onClick={() => setTopVisible(true)}>
                            Show Top Bar
                        </Button>
                    )}
                </div>
            </section>

            <section className="page-section">
                <h2>Alignment &amp; Offset</h2>

                <div className="showcase-group">
                    <h3>Centered helper bar stacked above a bottom bar</h3>
                    <div className="sticky-bar-demo sticky-bar-demo--stacked">
                        <div className="sticky-bar-demo__placeholder">
                            <ToggleSwitch label="Show helper bar" checked={stackedVisible} onChange={setStackedVisible} />
                        </div>

                        <StickyBar position="bottom" align="center" visible={stackedVisible} offset={68}>
                            <span className="sticky-bar-page__hint">Draft changes are saved locally</span>
                        </StickyBar>

                        <StickyBar position="bottom" align="between">
                            <div className="sticky-bar-page__summary">
                                <strong>Workspace settings</strong>
                                <span>3 unsaved changes</span>
                            </div>
                            <div className="sticky-bar-page__actions">
                                <Button size="small" variant="ghost">
                                    Reset
                                </Button>
                                <Button size="small" variant="success">
                                    Save
                                </Button>
                            </div>
                        </StickyBar>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>End Aligned Status Bar</h3>
                    <div className="sticky-bar-demo">
                        <div className="sticky-bar-demo__placeholder">Content area</div>
                        <StickyBar position="bottom" align="end" role="status" ariaLabel="Sync status">
                            <span className="sticky-bar-page__hint">All changes synced</span>
                        </StickyBar>
                    </div>
                </div>
            </section>
        </div>
    );
};
