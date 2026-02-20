import React from 'react';

import { Button, ToastContainer, ToastProvider, useToast } from '../../../src';

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
            </div>
        </div>
    );
};

export const ContextToastPage: React.FC = () => {
    return (
        <div className="component-page">
            <h1>Context Toast Component</h1>
            <p>Global toast notifications managed through a context provider.</p>

            <ToastProvider>
                <section className="page-section">
                    <h2>Examples</h2>
                    <ToastDemo />
                </section>

                <ToastContainer position="bottom-right" />
            </ToastProvider>
        </div>
    );
};
