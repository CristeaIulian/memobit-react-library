import React, { useRef, useState } from 'react';

import { Button, ConfirmPopover, ControlPanel } from '../../../src';

export const ConfirmPopoverPage: React.FC = () => {
    // Standalone (controlled) examples — one anchor + visibility flag each.
    const deleteRef = useRef<HTMLButtonElement>(null);
    const archiveRef = useRef<HTMLButtonElement>(null);
    const publishRef = useRef<HTMLButtonElement>(null);
    const minimalRef = useRef<HTMLButtonElement>(null);
    const messageOnlyRef = useRef<HTMLButtonElement>(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [archiveOpen, setArchiveOpen] = useState(false);
    const [publishOpen, setPublishOpen] = useState(false);
    const [minimalOpen, setMinimalOpen] = useState(false);
    const [messageOnlyOpen, setMessageOnlyOpen] = useState(false);

    const [log, setLog] = useState<string[]>([]);
    const push = (line: string) => setLog(prev => [`${new Date().toLocaleTimeString()} — ${line}`, ...prev].slice(0, 8));

    return (
        <div className="confirm-popover-page">
            <h1>ConfirmPopover</h1>
            <p>
                Inline confirmation anchored next to its trigger. No backdrop, no screen dim, decision buttons
                packed together so the mouse barely moves. Built on top of <code>Popover</code>; closes on
                outside click or <kbd>Esc</kbd>.
            </p>

            <section className="page-section">
                <h2>Basic</h2>
                <p>Most common shape: title, message, danger confirm, default cancel.</p>

                <div className="showcase-group">
                    <h3>Destructive confirm</h3>
                    <div className="component-group">
                        <Button ref={deleteRef} variant="danger" onClick={() => setDeleteOpen(true)}>
                            Delete project
                        </Button>
                        <ConfirmPopover
                            visible={deleteOpen}
                            onClose={() => setDeleteOpen(false)}
                            anchorEl={deleteRef.current}
                            title="Delete this project?"
                            message="All tasks and comments inside it will be removed."
                            icon="warning"
                            confirm={{
                                text: 'Delete',
                                icon: 'delete',
                                variant: 'danger',
                                onClick: () => push('Deleted'),
                            }}
                            cancel={{ text: 'Keep', onClick: () => push('Cancelled') }}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Placement</h2>
                <p>Pick a side relative to the trigger, or leave <code>auto</code> to fit available space.</p>

                <div className="showcase-group">
                    <h3>Right (default for sidebar actions)</h3>
                    <div className="component-group">
                        <Button ref={archiveRef} onClick={() => setArchiveOpen(true)}>
                            Archive
                        </Button>
                        <ConfirmPopover
                            visible={archiveOpen}
                            onClose={() => setArchiveOpen(false)}
                            anchorEl={archiveRef.current}
                            placement="right"
                            title="Archive 12 items?"
                            message="You can restore them from the trash within 30 days."
                            confirm={{ text: 'Archive', variant: 'info', onClick: () => push('Archived') }}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Top</h3>
                    <div className="component-group">
                        <Button ref={publishRef} variant="success" onClick={() => setPublishOpen(true)}>
                            Publish
                        </Button>
                        <ConfirmPopover
                            visible={publishOpen}
                            onClose={() => setPublishOpen(false)}
                            anchorEl={publishRef.current}
                            placement="top"
                            title="Publish to production?"
                            confirm={{
                                text: 'Publish',
                                icon: 'checkmark',
                                variant: 'success',
                                onClick: () => push('Published'),
                            }}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Variants</h2>

                <div className="showcase-group">
                    <h3>Title only</h3>
                    <div className="component-group">
                        <Button ref={minimalRef} onClick={() => setMinimalOpen(true)}>
                            Quick confirm
                        </Button>
                        <ConfirmPopover
                            visible={minimalOpen}
                            onClose={() => setMinimalOpen(false)}
                            anchorEl={minimalRef.current}
                            title="Mark all as read?"
                            confirm={{ text: 'Yes', variant: 'info', onClick: () => push('Marked') }}
                        />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Message only</h3>
                    <div className="component-group">
                        <Button ref={messageOnlyRef} onClick={() => setMessageOnlyOpen(true)}>
                            Discard draft
                        </Button>
                        <ConfirmPopover
                            visible={messageOnlyOpen}
                            onClose={() => setMessageOnlyOpen(false)}
                            anchorEl={messageOnlyRef.current}
                            message="Your unsaved changes will be lost."
                            confirm={{ text: 'Discard', variant: 'danger', onClick: () => push('Discarded') }}
                        />
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Inside a ControlPanel action</h2>
                <p>
                    Pass <code>confirm</code> on any <code>ControlPanelAction</code> and the sidebar handles the
                    popover wiring internally — no refs, no extra state. The action’s <code>onClick</code> fires
                    only after the user picks the confirm button.
                </p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ width: 280, border: '1px solid var(--card-border-color)', borderRadius: 8, overflow: 'hidden' }}>
                        <ControlPanel
                            contained
                            flush
                            header={{ siteName: 'Demo App', heading: 'Inbox' }}
                            actions={[
                                {
                                    id: 'merge',
                                    label: 'Merge selected',
                                    icon: 'group',
                                    variant: 'info',
                                    onClick: () => push('Merged'),
                                    confirm: {
                                        title: 'Merge 3 items?',
                                        message: 'They are regrouped into one. Labels are kept.',
                                        confirm: { text: 'Merge', icon: 'group', variant: 'info' },
                                    },
                                },
                                {
                                    id: 'archive',
                                    label: 'Archive all',
                                    icon: 'archive',
                                    onClick: () => push('Archived all'),
                                    confirm: {
                                        title: 'Archive everything?',
                                        message: 'Restorable from trash for 30 days.',
                                    },
                                },
                                {
                                    id: 'reset',
                                    label: 'Reset to defaults',
                                    icon: 'warning',
                                    variant: 'danger',
                                    onClick: () => push('Reset'),
                                    confirm: {
                                        title: 'Reset all settings?',
                                        message: 'This cannot be undone.',
                                        confirm: { text: 'Reset', variant: 'danger' },
                                    },
                                },
                            ]}
                        />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ marginTop: 0 }}>Activity</h3>
                        {log.length === 0 ? (
                            <p style={{ color: 'var(--body-color-muted)' }}>Pick an action — confirmed clicks land here.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', fontSize: 12 }}>
                                {log.map((line, i) => (
                                    <li key={i} style={{ padding: '4px 0', borderBottom: '1px solid var(--card-border-color)' }}>{line}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
