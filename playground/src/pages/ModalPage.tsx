import React, { useState } from 'react';

import { Modal, Button } from '../../../src';

export const ModalPage: React.FC = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isModalOpen2, setModalOpen2] = useState<boolean>(false);

    return (
        <div className="modal-page">
            <h1>Modal Component</h1>
            <p>A modal dialog component for overlaying content.</p>

            <section className="page-section">
                <h2>Modal Examples</h2>

                <div className="showcase-group">
                    <h3>Basic Modal</h3>
                    <div className="component-group">
                        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Modal Title">
                            <div style={{ padding: '16px' }}>content</div>
                        </Modal>
                        <Button onClick={() => setModalOpen(true)}>Show Modal</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Modal with footer</h3>
                    <div className="component-group">
                        <Modal
                            isOpen={isModalOpen2}
                            onClose={() => setModalOpen2(false)}
                            title="Modal Title"
                            primaryButton={{
                                text: 'Save',
                                onClick: () => console.log('success clicked'),
                                icon: '✓',
                                variant: 'success',
                            }}
                            secondaryButton={{
                                text: 'Cancel',
                                onClick: () => setModalOpen2(false),
                                icon: '❎',
                                variant: 'danger',
                            }}
                        >
                            <div style={{ padding: '16px' }}>content</div>
                        </Modal>
                        <Button onClick={() => setModalOpen2(true)}>Show Modal</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
