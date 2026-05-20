import React, { useState } from 'react';

import { Button, Toast, type ToastPosition } from '../../../src';

type ToastType = 'danger' | 'success' | 'warning' | 'info';

interface ToastDemoState {
    key: number;
    message: string;
    position?: ToastPosition;
    showDismissButton?: boolean;
    timeout?: number;
    type: ToastType;
    withAction?: boolean;
}

const toastPositions: ToastPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'];

export const ToastPage: React.FC = () => {
    const [toast, setToast] = useState<ToastDemoState | null>(null);

    const showToast = (nextToast: Omit<ToastDemoState, 'key'>) => {
        setToast({ ...nextToast, key: Date.now() });
    };

    return (
        <div className="toast-page">
            <h1>Toast Component</h1>
            <p>A toast notification component for displaying temporary messages.</p>

            {toast && (
                <Toast
                    key={toast.key}
                    message={toast.message}
                    type={toast.type}
                    position={toast.position}
                    showDismissButton={toast.showDismissButton}
                    timeout={toast.timeout}
                    action={
                        toast.withAction
                            ? {
                                  label: 'Undo',
                                  onClick: () => setToast(null),
                              }
                            : undefined
                    }
                    onClose={() => setToast(null)}
                />
            )}

            <section className="page-section">
                <h2>Toast Notifications</h2>
                <div className="showcase-group">
                    <h3>Variants</h3>
                    <div className="component-group">
                        <Button variant="info" onClick={() => showToast({ message: 'This is an info message', type: 'info' })}>
                            Show Info
                        </Button>
                        <Button variant="success" onClick={() => showToast({ message: 'This is a success message', type: 'success' })}>
                            Show Success
                        </Button>
                        <Button variant="warning" onClick={() => showToast({ message: 'This is a warning message', type: 'warning' })}>
                            Show Warning
                        </Button>
                        <Button variant="danger" onClick={() => showToast({ message: 'This is a danger message', type: 'danger' })}>
                            Show Danger
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Positions</h3>
                    <div className="component-group">
                        {toastPositions.map(position => (
                            <Button
                                key={position}
                                variant="default"
                                onClick={() =>
                                    showToast({
                                        message: `Toast at ${position}`,
                                        position,
                                        showDismissButton: true,
                                        timeout: 4000,
                                        type: 'info',
                                    })
                                }
                            >
                                {position}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Timeout and Dismiss Button</h3>
                    <div className="component-group">
                        <Button
                            variant="ghost"
                            onClick={() =>
                                showToast({
                                    message: 'Default timeout uses the component default',
                                    type: 'success',
                                })
                            }
                        >
                            Default Timeout
                        </Button>
                        <Button
                            variant="info"
                            onClick={() =>
                                showToast({
                                    message: 'Visible for 6 seconds',
                                    timeout: 6000,
                                    type: 'info',
                                })
                            }
                        >
                            Custom Timeout
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() =>
                                showToast({
                                    message: 'Dismissible toast',
                                    showDismissButton: true,
                                    timeout: 6000,
                                    type: 'warning',
                                })
                            }
                        >
                            With Dismiss
                        </Button>
                        <Button
                            variant="success"
                            onClick={() =>
                                showToast({
                                    message: 'Draft saved',
                                    showDismissButton: true,
                                    timeout: 6000,
                                    type: 'success',
                                    withAction: true,
                                })
                            }
                        >
                            With Action
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() =>
                                showToast({
                                    message: 'No dismiss button',
                                    showDismissButton: false,
                                    timeout: 3000,
                                    type: 'danger',
                                })
                            }
                        >
                            Without Dismiss
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
