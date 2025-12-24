import React, { useState } from 'react';

import { Modal, Button } from '../../../src';

export const ModalPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isModalOpen2, setModalOpen2] = useState<boolean>(false);
    const [isConfirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [isInfoOpen, setInfoOpen] = useState<boolean>(false);
    const [isFormOpen, setFormOpen] = useState<boolean>(false);
    const [isSmallOpen, setSmallOpen] = useState<boolean>(false);
    const [isMediumOpen, setMediumOpen] = useState<boolean>(false);
    const [isLargeOpen, setLargeOpen] = useState<boolean>(false);
    const [isCustomOverlayOpen, setCustomOverlayOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const handleFormSubmit = () => {
        console.log('Form submitted:', formData);
        setFormData({ name: '', email: '' });
        setFormOpen(false);
    };

    return (
        <div className="modal-page">
            <h1>Modal Component</h1>
            <p>A modal dialog component for overlaying content.</p>

            <section className="page-section">
                <h2>Basic Examples</h2>

                <div className="showcase-group">
                    <h3>Basic Modal</h3>
                    <div className="component-group">
                        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
                            <div style={{ padding: '16px' }}>
                                <p>This is a basic modal with just content and a close button.</p>
                            </div>
                        </Modal>
                        <Button onClick={() => setModalOpen(true)}>Show Basic Modal</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Modal with Footer Buttons</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isModalOpen2}
                            onClose={() => setModalOpen2(false)}
                            title="Save Changes"
                            primaryButton={{
                                text: 'Save',
                                onClick: () => {
                                    console.log('Changes saved');
                                    setModalOpen2(false);
                                },
                                icon: '✓',
                                variant: 'success',
                            }}
                            secondaryButton={{
                                text: 'Cancel',
                                onClick: () => setModalOpen2(false),
                                icon: '❎',
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>Do you want to save your changes before closing?</p>
                            </div>
                        </Modal>
                        <Button onClick={() => setModalOpen2(true)}>Show Modal with Buttons</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Confirmation Dialog</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isConfirmOpen}
                            onClose={() => setConfirmOpen(false)}
                            title="Delete Item"
                            primaryButton={{
                                text: 'Delete',
                                onClick: () => {
                                    console.log('Item deleted');
                                    setConfirmOpen(false);
                                },
                                icon: '🗑️',
                                variant: 'danger',
                            }}
                            secondaryButton={{
                                text: 'Cancel',
                                onClick: () => setConfirmOpen(false),
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>Are you sure you want to delete this item? This action cannot be undone.</p>
                            </div>
                        </Modal>
                        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                            Delete Item
                        </Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Info Modal (Primary Button Only)</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isInfoOpen}
                            onClose={() => setInfoOpen(false)}
                            title="Important Information"
                            primaryButton={{
                                text: 'Got it',
                                onClick: () => setInfoOpen(false),
                                icon: '✓',
                                variant: 'info',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>This is an informational modal with only a primary action button.</p>
                                <ul style={{ marginTop: '12px', paddingLeft: '20px' }}>
                                    <li>Feature updates are available</li>
                                    <li>Please review the new terms of service</li>
                                    <li>System maintenance scheduled for tonight</li>
                                </ul>
                            </div>
                        </Modal>
                        <Button variant="info" onClick={() => setInfoOpen(true)}>
                            Show Info
                        </Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Size Variants</h2>

                <div className="showcase-group">
                    <h3>Small Modal</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isSmallOpen}
                            onClose={() => setSmallOpen(false)}
                            title="Small Modal"
                            size="small"
                            primaryButton={{
                                text: 'OK',
                                onClick: () => setSmallOpen(false),
                                variant: 'info',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>This is a small modal, perfect for quick confirmations or alerts.</p>
                            </div>
                        </Modal>
                        <Button onClick={() => setSmallOpen(true)}>Small Modal</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Medium Modal</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isMediumOpen}
                            onClose={() => setMediumOpen(false)}
                            title="Medium Modal"
                            size="medium"
                            primaryButton={{
                                text: 'Close',
                                onClick: () => setMediumOpen(false),
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>This is a medium-sized modal, suitable for most use cases with moderate content.</p>
                                <p style={{ marginTop: '12px' }}>
                                    It provides enough space for descriptions, forms, or lists without overwhelming the viewport.
                                </p>
                            </div>
                        </Modal>
                        <Button onClick={() => setMediumOpen(true)}>Medium Modal</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Large Modal</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isLargeOpen}
                            onClose={() => setLargeOpen(false)}
                            title="Large Modal"
                            size="large"
                            primaryButton={{
                                text: 'Close',
                                onClick: () => setLargeOpen(false),
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <h3>Large Content Area</h3>
                                <p>This is a large modal, ideal for complex content like detailed forms or data tables.</p>
                                <div style={{ marginTop: '16px' }}>
                                    <h4>Features:</h4>
                                    <ul style={{ paddingLeft: '20px', marginTop: '8px' }}>
                                        <li>Ample space for rich content</li>
                                        <li>Perfect for multi-section forms</li>
                                        <li>Can accommodate data tables or galleries</li>
                                        <li>Suitable for detailed documentation</li>
                                    </ul>
                                </div>
                            </div>
                        </Modal>
                        <Button onClick={() => setLargeOpen(true)}>Large Modal</Button>
                    </div>
                </div>
            </section>

            <section className="page-section">
                <h2>Advanced Examples</h2>

                <div className="showcase-group">
                    <h3>Form Modal</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isFormOpen}
                            onClose={() => setFormOpen(false)}
                            title="User Registration"
                            size="medium"
                            primaryButton={{
                                text: 'Submit',
                                onClick: handleFormSubmit,
                                icon: '✓',
                                variant: 'success',
                                disabled: !formData.name || !formData.email,
                            }}
                            secondaryButton={{
                                text: 'Cancel',
                                onClick: () => {
                                    setFormData({ name: '', email: '' });
                                    setFormOpen(false);
                                },
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <label
                                        htmlFor="name"
                                        style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
                                    >
                                        Name:
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}
                                    >
                                        Email:
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <p style={{ marginTop: '12px', fontSize: '14px', color: 'var(--body-color-muted)' }}>
                                    Note: Submit button is disabled until both fields are filled.
                                </p>
                            </div>
                        </Modal>
                        <Button onClick={() => setFormOpen(true)}>Show Form Modal</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Custom Overlay Click Behavior</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isCustomOverlayOpen}
                            onClose={() => setCustomOverlayOpen(false)}
                            title="Custom Overlay Behavior"
                            onOverlayClick={() => {
                                console.log('Overlay clicked - showing alert instead of closing');
                                alert('Overlay clicked! Use the X button or Cancel to close.');
                            }}
                            primaryButton={{
                                text: 'OK',
                                onClick: () => setCustomOverlayOpen(false),
                                variant: 'success',
                            }}
                            secondaryButton={{
                                text: 'Cancel',
                                onClick: () => setCustomOverlayOpen(false),
                                variant: 'default',
                            }}
                        >
                            <div style={{ padding: '16px' }}>
                                <p>This modal has custom overlay click behavior.</p>
                                <p style={{ marginTop: '8px' }}>
                                    Try clicking outside the modal - it will show an alert instead of closing.
                                </p>
                            </div>
                        </Modal>
                        <Button onClick={() => setCustomOverlayOpen(true)}>Show Custom Overlay Modal</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
