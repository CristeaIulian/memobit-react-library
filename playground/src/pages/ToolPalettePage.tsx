import React, { useState } from 'react';

import { ToolPalette, type ToolPaletteItem } from '../../../src';

// Items with the same group share a slot: the marquees here, and the two fill tools.
const TOOLS: ToolPaletteItem[] = [
    { id: 'move', label: 'Move', icon: 'enlarge', shortcut: 'V' },
    { id: 'marquee-rect', label: 'Rectangular Marquee', icon: 'square', shortcut: 'M', group: 'marquee' },
    { id: 'marquee-ellipse', label: 'Elliptical Marquee', icon: 'dot', shortcut: 'M', group: 'marquee' },
    { id: 'crop', label: 'Crop', icon: 'scissors', shortcut: 'C' },
    { id: 'brush', label: 'Brush', icon: 'paint', shortcut: 'B' },
    { id: 'eraser', label: 'Eraser', icon: 'clear', shortcut: 'E' },
    { id: 'bucket', label: 'Paint Bucket', icon: 'water-leak', shortcut: 'G', group: 'fill' },
    { id: 'gradient', label: 'Gradient', icon: 'sparkle', shortcut: 'G', group: 'fill' },
    { id: 'text', label: 'Text', icon: 'notes', shortcut: 'T' },
    { id: 'hand', label: 'Hand', icon: 'gloves', shortcut: 'H' },
    { id: 'zoom', label: 'Zoom', icon: 'search', shortcut: 'Z' },
];

export const ToolPalettePage: React.FC = () => {
    const [tool, setTool] = useState('brush');
    const [narrowTool, setNarrowTool] = useState('move');
    const label = (id: string) => TOOLS.find(item => item.id === id)?.label;

    return (
        <div className="component-page">
            <h1>Tool Palette</h1>
            <p>
                A tool column, as in an image editor. Items sharing a <code>group</code> share a slot that shows the one used last: click it again to move to
                the next one, or right-click to list them. The corner mark shows which slots hold more.
            </p>

            <section className="page-section">
                <h2>Examples</h2>
                <div className="showcase-group">
                    <h3>Two columns, with colour swatches under it</h3>
                    <div className="component-group" style={{ alignItems: 'flex-start' }}>
                        <ToolPalette items={TOOLS} activeId={tool} onSelect={setTool}>
                            <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                                <span style={{ width: 'var(--spacing-20)', height: 'var(--spacing-20)', background: 'var(--body-color)' }} />
                                <span
                                    style={{
                                        width: 'var(--spacing-20)',
                                        height: 'var(--spacing-20)',
                                        background: 'var(--body-background-base)',
                                        border: '1px solid var(--border-color)',
                                    }}
                                />
                            </div>
                        </ToolPalette>
                        <p>Active tool: {label(tool)}</p>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>One column</h3>
                    <div className="component-group" style={{ alignItems: 'flex-start' }}>
                        <ToolPalette items={TOOLS.slice(0, 6)} activeId={narrowTool} onSelect={setNarrowTool} columns={1} />
                        <p>Active tool: {label(narrowTool)}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};
