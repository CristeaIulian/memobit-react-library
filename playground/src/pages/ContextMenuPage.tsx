import React, { type MouseEvent, useCallback, useState } from 'react';

import { Button, ContextMenu } from '../../../src';

export const ContextMenuPage: React.FC = () => {
    const [contextMenuTarget, setContextMenuTarget] = useState<EventTarget | null>(null);
    const [contextMenuTarget2, setContextMenuTarget2] = useState<EventTarget | null>(null);

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
            </section>
        </div>
    );
};
