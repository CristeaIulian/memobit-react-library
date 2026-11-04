import React, { type MouseEvent, useCallback, useState } from 'react';

import { Button, ContextMenu } from '../../../src';

export const ContextMenuPage: React.FC = () => {
    const [contextMenuTarget, setContextMenuTarget] = useState<EventTarget | null>(null);
    const [contextMenuTarget2, setContextMenuTarget2] = useState<EventTarget | null>(null);
    const [autoCloseTarget, setAutoCloseTarget] = useState<EventTarget | null>(null);
    const [cursorMenu, setCursorMenu] = useState<{ x: number; y: number } | null>(null);

    const handleContextMenuActionsButton = (event: MouseEvent<HTMLButtonElement>): void => {
        setContextMenuTarget(event.target);
    };

    const closeMenu = () => {
        setContextMenuTarget(null);
    };

    const handleContextMenuActionsButton2 = (event: MouseEvent<HTMLButtonElement>): void => {
        setContextMenuTarget2(event.target);
    };

    const closeMenu2 = () => {
        setContextMenuTarget2(null);
    };

    const closeAutoCloseMenu = () => {
        setAutoCloseTarget(null);
    };

    const onActionsEdit = useCallback(() => {
        alert('Edit clicked');
        closeMenu();
        closeMenu2();
    }, []);

    const onActionsDelete = useCallback(() => {
        alert('Delete clicked');
        closeMenu();
        closeMenu2();
    }, []);

    return (
        <div className="context-menu-page">
            <h1>Context Menu Component</h1>
            <p>A context menu component for displaying contextual actions.</p>

            <section className="page-section">
                <h2>Context Menu Examples</h2>

                <div className="showcase-group">
                    <h3>Basic ContextMenu</h3>
                    <div className="component-group">
                        {contextMenuTarget && (
                            <ContextMenu target={contextMenuTarget} onClose={closeMenu}>
                                <>
                                    <Button onClick={onActionsEdit} icon="edit">
                                        Edit
                                    </Button>
                                    <Button onClick={onActionsDelete} icon="delete">
                                        Delete
                                    </Button>
                                </>
                            </ContextMenu>
                        )}
                        <Button onClick={handleContextMenuActionsButton}>Context menu Opener</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>ContextMenu right align</h3>
                    <div className="component-group" style={{ display: 'flex', alignItems: 'end' }}>
                        {contextMenuTarget2 && (
                            <ContextMenu target={contextMenuTarget2} onClose={closeMenu2}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Button onClick={onActionsEdit} icon="edit">
                                        This is the first item and a bit long
                                    </Button>
                                    <Button onClick={onActionsDelete} icon="delete">
                                        This is the second item and a bit long
                                    </Button>
                                </div>
                            </ContextMenu>
                        )}
                        <Button onClick={handleContextMenuActionsButton2}>Context menu Opener</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Auto-close on Item Click</h3>
                    <div className="component-group">
                        {autoCloseTarget && (
                            <ContextMenu target={autoCloseTarget} onClose={closeAutoCloseMenu} autoClose>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button icon="save" onClick={() => alert('Saved')}>
                                        Save
                                    </Button>
                                    <Button icon="archive" onClick={() => alert('Archived')}>
                                        Archive
                                    </Button>
                                </div>
                            </ContextMenu>
                        )}
                        <Button onClick={event => setAutoCloseTarget(event.target)}>Auto-close Opener</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>At the Cursor (position)</h3>
                    <p>
                        Pass <code>position</code> with a right-click&apos;s <code>clientX</code> / <code>clientY</code> and the menu opens where the click was,
                        with no element to anchor it to. It still keeps itself inside the window.
                    </p>
                    <div
                        className="component-group"
                        style={{
                            minHeight: 'var(--spacing-100)',
                            padding: 'var(--spacing-16)',
                            border: '1px dashed var(--delimiter-color)',
                            borderRadius: 'var(--radius)',
                            color: 'var(--body-color-muted)',
                        }}
                        onContextMenu={event => {
                            event.preventDefault();
                            setCursorMenu({ x: event.clientX, y: event.clientY });
                        }}
                    >
                        Right-click anywhere in this box
                        {cursorMenu && (
                            <ContextMenu position={cursorMenu} onClose={() => setCursorMenu(null)} autoClose>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <Button variant="plain" icon="documents" onClick={() => alert('Duplicated')}>
                                        Duplicate
                                    </Button>
                                    <Button variant="plain" icon="edit" onClick={() => alert('Renamed')}>
                                        Rename
                                    </Button>
                                    <Button variant="plain" icon="delete" onClick={() => alert('Deleted')}>
                                        Delete
                                    </Button>
                                </div>
                            </ContextMenu>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
