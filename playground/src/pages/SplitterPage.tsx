import React, { useState } from 'react';

import { Splitter, type SplitterPane } from '../../../src';

import './SplitterPage.scss';

const Pane: React.FC<{ children?: React.ReactNode; title: string }> = ({ children, title }) => (
    <div className="splitter-demo-pane">
        <h4>{title}</h4>
        {children}
    </div>
);

export const SplitterPage: React.FC = () => {
    const [sizes, setSizes] = useState<number[]>([]);

    const twoPanes: SplitterPane[] = [
        { content: <Pane title="Left">Drag the gutter. Double-click it to snap back.</Pane>, id: 'left', size: 60 },
        { content: <Pane title="Right">The pair keeps a constant total, so nothing else on the page shifts.</Pane>, id: 'right' },
    ];

    const threePanes: SplitterPane[] = [
        { content: <Pane title="Files">Ratios rather than percentages work too — 2 / 1 / 1 here.</Pane>, id: 'files', minSize: 15, size: 2 },
        { content: <Pane title="Editor">Each gutter only moves the two panes it sits between.</Pane>, id: 'editor', size: 1 },
        { content: <Pane title="Output">Tab to a gutter and use the arrow keys.</Pane>, id: 'output', size: 1 },
    ];

    const verticalPanes: SplitterPane[] = [
        { content: <Pane title="Preview">Stacked instead of side by side.</Pane>, id: 'preview', size: 65 },
        { content: <Pane title="Console">Up and down arrows drive a focused gutter here.</Pane>, id: 'console', minSize: 15 },
    ];

    const collapsiblePanes: SplitterPane[] = [
        { content: <Pane title="Sidebar">Drag me past halfway into my minimum and I shut completely.</Pane>, id: 'sidebar', minSize: 20, size: 30 },
        { content: <Pane title="Main">Dragging back out reopens the sidebar.</Pane>, id: 'main' },
    ];

    return (
        <div className="splitter-page">
            <h1>Splitter</h1>
            <p>
                Resizable panes along one axis. Any number of panes, each with its own minimum, dragged by the gutters between them. For the master/detail
                overlay that takes over a page, see <code>SplitPanel</code> instead.
            </p>

            <section className="page-section">
                <h2>Two panes</h2>

                <div className="showcase-group">
                    <h3>Horizontal</h3>
                    <Splitter className="splitter-demo" panes={twoPanes} />
                </div>
            </section>

            <section className="page-section">
                <h2>Three panes</h2>

                <div className="showcase-group">
                    <h3>Sizes as ratios, with minimums</h3>
                    <Splitter className="splitter-demo" onResize={setSizes} panes={threePanes} />
                    <p className="splitter-demo-readout">
                        onResize: {sizes.length > 0 ? sizes.map(size => `${size.toFixed(1)}%`).join(' / ') : 'drag a gutter to report'}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Vertical</h2>

                <div className="showcase-group">
                    <h3>Stacked panes</h3>
                    <Splitter className="splitter-demo splitter-demo--tall" orientation="vertical" panes={verticalPanes} />
                </div>
            </section>

            <section className="page-section">
                <h2>Collapsible</h2>

                <div className="showcase-group">
                    <h3>Dragging past the minimum closes the pane</h3>
                    <Splitter className="splitter-demo" collapsible panes={collapsiblePanes} />
                </div>
            </section>

            <section className="page-section">
                <h2>Options</h2>

                <div className="showcase-group">
                    <h3>Thicker gutter, no double-click reset</h3>
                    <Splitter
                        className="splitter-demo"
                        gutterSize={12}
                        panes={[
                            { content: <Pane title="One">A 12px gutter, easier to grab on a touchpad.</Pane>, id: 'one' },
                            { content: <Pane title="Two">Double-clicking does nothing here.</Pane>, id: 'two' },
                        ]}
                        resetOnDoubleClick={false}
                    />
                </div>

                <div className="showcase-group">
                    <h3>Larger keyboard step</h3>
                    <Splitter
                        className="splitter-demo"
                        keyboardStep={10}
                        panes={[
                            { content: <Pane title="One">Focus the gutter — each arrow press moves 10%.</Pane>, id: 'one' },
                            { content: <Pane title="Two">Useful when the panes are big.</Pane>, id: 'two' },
                        ]}
                    />
                </div>
            </section>
        </div>
    );
};
