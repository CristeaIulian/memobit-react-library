import React, { useState } from 'react';

import { MenuBar, type MenuBarMenu } from '../../../src';

export const MenuBarPage: React.FC = () => {
    const [last, setLast] = useState('Nothing chosen yet');
    const [canUndo, setCanUndo] = useState(false);
    const choose = (label: string) => () => {
        setLast(label);
        if (label !== 'Undo') setCanUndo(true);
    };

    const menus: MenuBarMenu[] = [
        {
            label: 'File',
            entries: [
                { label: 'New…', shortcut: 'Ctrl+N', onSelect: choose('New') },
                { label: 'Open…', shortcut: 'Ctrl+O', onSelect: choose('Open') },
                'separator',
                { label: 'Save', shortcut: 'Ctrl+S', onSelect: choose('Save') },
                { label: 'Save As…', shortcut: 'Ctrl+Shift+S', onSelect: choose('Save As') },
                'separator',
                { label: 'Exit', onSelect: choose('Exit') },
            ],
        },
        {
            label: 'Edit',
            entries: [
                {
                    label: 'Undo',
                    shortcut: 'Ctrl+Z',
                    disabled: !canUndo,
                    onSelect: () => {
                        setLast('Undo');
                        setCanUndo(false);
                    },
                },
                'separator',
                { label: 'Cut', shortcut: 'Ctrl+X', onSelect: choose('Cut') },
                { label: 'Copy', shortcut: 'Ctrl+C', onSelect: choose('Copy') },
                { label: 'Paste', shortcut: 'Ctrl+V', onSelect: choose('Paste') },
            ],
        },
        {
            label: 'View',
            entries: [
                { label: 'Zoom In', shortcut: 'Ctrl++', onSelect: choose('Zoom In') },
                { label: 'Zoom Out', shortcut: 'Ctrl+−', onSelect: choose('Zoom Out') },
            ],
        },
        { label: 'Help', entries: [{ label: 'About', onSelect: choose('About') }] },
    ];

    return (
        <div className="component-page">
            <h1>Menu Bar</h1>
            <p>
                A desktop menu bar. A click opens a menu; while one is open, hovering another switches to it. Esc or a click elsewhere closes it. Shortcuts are
                shown only: handling the keys is the app&apos;s job.
            </p>

            <section className="page-section">
                <h2>Example</h2>
                <div className="showcase-group">
                    <h3>File, Edit, View, Help</h3>
                    <div
                        className="component-group"
                        style={{ padding: 'var(--spacing-4)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}
                    >
                        <MenuBar menus={menus} />
                    </div>
                    <p>Last chosen: {last}. Undo turns on after any other choice.</p>
                </div>
            </section>
        </div>
    );
};
