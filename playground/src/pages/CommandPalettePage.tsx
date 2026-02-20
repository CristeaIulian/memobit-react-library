import React, { useMemo, useState } from 'react';

import { Button, CommandPalette, type CommandItem } from '../../../src';

export const CommandPalettePage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const items = useMemo<CommandItem[]>(
        () => [
            { id: 'new', label: 'Create new project', group: 'Actions', shortcut: 'N', onSelect: () => alert('New project') },
            { id: 'open', label: 'Open project', group: 'Actions', shortcut: 'O', onSelect: () => alert('Open project') },
            { id: 'settings', label: 'Open settings', group: 'Navigation', shortcut: 'S', onSelect: () => alert('Settings') },
            { id: 'docs', label: 'View documentation', group: 'Help', shortcut: 'D', onSelect: () => alert('Docs') },
        ],
        []
    );

    return (
        <div className="component-page">
            <h1>Command Palette</h1>
            <p>Searchable command launcher with a Ctrl+K shortcut.</p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>Open the palette</h3>
                    <div className="component-group">
                        <Button variant="info" onClick={() => setIsOpen(true)}>
                            Open Command Palette
                        </Button>
                    </div>
                </div>
            </section>

            <CommandPalette items={items} isOpen={isOpen} onOpenChange={setIsOpen} />
        </div>
    );
};
