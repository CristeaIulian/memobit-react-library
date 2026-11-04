import React, { useState } from 'react';

import { ToolButton } from '../../../src';

export const ToolButtonPage: React.FC = () => {
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [last, setLast] = useState('Nothing clicked yet');

    return (
        <div className="component-page">
            <h1>Tool Button</h1>
            <p>An icon-only toolbar button whose label lives in a Tooltip, with active, danger, badge and mirrored states.</p>

            <section className="page-section">
                <h2>Examples</h2>
                <div className="showcase-group">
                    <h3>A toolbar</h3>
                    <div className="component-group">
                        <ToolButton icon="folder-open" hint="Open (Ctrl+O)" onClick={() => setLast('Open')} />
                        <ToolButton icon="reload" hint="Rotate left (Ctrl+Shift+R)" onClick={() => setLast('Rotate left')} mirrored />
                        <ToolButton icon="reload" hint="Rotate right (Ctrl+R)" onClick={() => setLast('Rotate right')} />
                        <ToolButton icon="save" badge="WEB" hint="Save for web (Ctrl+Alt+S)" onClick={() => setLast('Save for web')} />
                        <ToolButton icon="printer" hint="Print (Ctrl+P)" onClick={() => setLast('Print')} disabled />
                        <ToolButton icon="delete" hint="Delete (Del)" onClick={() => setLast('Delete')} danger />
                    </div>
                    <p>Last clicked: {last}</p>
                </div>

                <div className="showcase-group">
                    <h3>Active, as a toggle</h3>
                    <div className="component-group">
                        <ToolButton
                            icon="information"
                            hint={detailsOpen ? 'Hide details' : 'Show details'}
                            onClick={() => setDetailsOpen(open => !open)}
                            active={detailsOpen}
                        />
                        <span>Details panel {detailsOpen ? 'open' : 'closed'}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
