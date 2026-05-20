import React, { useState } from 'react';

import { Button, ToastContainer, ToastProvider, type ToastContainerPosition, useToast } from '../../../src';

const toastPositions: ToastContainerPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'];

const ToastDemo: React.FC = () => {
    const { addToast } = useToast();

    return (
        <div className="showcase-group">
            <h3>Trigger notifications</h3>
            <div className="component-group">
                <Button variant="info" onClick={() => addToast('New message received', 'info', 2000)}>
                    Info
                </Button>
                <Button variant="success" onClick={() => addToast('Settings saved', 'success', 2000)}>
                    Success
                </Button>
                <Button variant="warning" onClick={() => addToast('Storage almost full', 'warning', 2500)}>
                    Warning
                </Button>
                <Button variant="danger" onClick={() => addToast('Sync failed', 'danger', 2500)}>
                    Danger
                </Button>
                <Button
                    variant="ghost"
                    onClick={() => addToast('Undoable update', 'info', 5000, { label: 'Undo', onClick: () => addToast('Update reverted', 'success', 1800) })}
                >
                    Action
                </Button>
            </div>
        </div>
    );
};

export const ContextToastPage: React.FC = () => {
    const [position, setPosition] = useState<ToastContainerPosition>('bottom-right');
    const [showDismissButton, setShowDismissButton] = useState(true);

    return (
        <div className="component-page">
            <h1>Context Toast Component</h1>
            <p>Global toast notifications managed through a context provider.</p>

            <ToastProvider>
                <section className="page-section">
                    <h2>Examples</h2>
                    <ToastDemo />

                    <div className="showcase-group">
                        <h3>Container Positions</h3>
                        <div className="component-group">
                            {toastPositions.map(nextPosition => (
                                <Button key={nextPosition} variant={position === nextPosition ? 'info' : 'default'} onClick={() => setPosition(nextPosition)}>
                                    {nextPosition}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="showcase-group">
                        <h3>Dismiss Button</h3>
                        <div className="component-group">
                            <Button variant={showDismissButton ? 'success' : 'default'} onClick={() => setShowDismissButton(true)}>
                                Show Dismiss
                            </Button>
                            <Button variant={!showDismissButton ? 'warning' : 'default'} onClick={() => setShowDismissButton(false)}>
                                Hide Dismiss
                            </Button>
                        </div>
                    </div>
                </section>

                <ToastContainer position={position} showDismissButton={showDismissButton} />
            </ToastProvider>
        </div>
    );
};
