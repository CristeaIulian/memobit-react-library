import React from 'react';

import { Card, TimelineMarkerDot, TimelineMarkers, TimelineMobileSeparator, type TimelineMarkersItem } from '../../../src';

interface ReleaseNote extends TimelineMarkersItem {
    title: string;
    description: string;
}

const releases: ReleaseNote[] = [
    { id: 1, date: '2024-12-18', title: 'Winter release', description: 'Theme packs and density controls shipped.' },
    { id: 2, date: '2024-12-18', title: 'Patch release', description: 'Fixed focus restoration in overlays.' },
    { id: 3, date: '2025-01-09', title: 'Data tools', description: 'Added timeline markers and grouped data views.' },
    { id: 4, date: '2025-04-22', title: 'Input refresh', description: 'Improved form states across text, date, and file inputs.' },
    { id: 5, date: '2026-02-03', title: 'Accessibility sweep', description: 'Keyboard and screen-reader polish for navigation surfaces.' },
];

export const TimelineMarkersPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>TimelineMarkers Component</h1>
            <p>Low-level timeline marker utilities for date-grouped lists and custom renderers.</p>

            <section className="page-section">
                <h2>Date-Grouped Items</h2>
                <div className="showcase-group">
                    <TimelineMarkers
                        items={releases}
                        renderItem={(item, marker) => (
                            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '120px minmax(0, 1fr)', gap: '16px', alignItems: 'start' }}>
                                <TimelineMarkerDot marker={marker} />
                                <Card title={item.title}>
                                    <small>{item.date}</small>
                                    <p>{item.description}</p>
                                    <TimelineMobileSeparator marker={marker} />
                                </Card>
                            </div>
                        )}
                    />
                </div>
            </section>
        </div>
    );
};
