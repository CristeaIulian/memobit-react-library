import React, { useState } from 'react';

import { Button, Toast } from '../../../src';

export const ToastPage: React.FC = () => {
    const [toastState, setToastState] = useState<string | null>(null);

    return (
        <div className="toast-page">
            <h1>Toast Component</h1>
            <p>A toast notification component for displaying temporary messages.</p>

            <section className="page-section">
                <h2>Toast Notifications</h2>
                <div className="showcase-group">
                    <div className="component-group">
                        {toastState && (
                            <Toast
                                message="This is a message"
                                type={toastState as 'danger' | 'success' | 'warning' | 'info' | undefined}
                                timeout={2000}
                                onClose={() => setToastState(null)}
                            />
                        )}
                        <Button variant="info" onClick={() => setToastState('info')}>
                            Show Info
                        </Button>
                        <Button variant="success" onClick={() => setToastState('success')}>
                            Show Success
                        </Button>
                        <Button variant="warning" onClick={() => setToastState('warning')}>
                            Show Warning
                        </Button>
                        <Button variant="danger" onClick={() => setToastState('danger')}>
                            Show Danger
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
