import React, { useState } from 'react';

import { ConfirmDialog, Button } from '../../../src';

export const ConfirmDialogPage: React.FC = () => {
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false);
    const [isConfirmDialogOpen2, setConfirmDialogOpen2] = useState<boolean>(false);

    return (
        <div className="confirm-dialog-page">
            <h1>Confirm Dialog Component</h1>
            <p>A confirmation dialog component for user confirmations.</p>

            <section className="page-section">
                <h2>Basic Confirm Dialog</h2>

                <div className="showcase-group">
                    <h3>ConfirmDialog</h3>
                    <div className="component-group">
                        <ConfirmDialog
                            message="this is the message"
                            isOpen={isConfirmDialogOpen}
                            onPrimaryButtonClick={() => setConfirmDialogOpen(false)}
                            onSecondaryButtonClick={() => setConfirmDialogOpen(false)}
                            title="this is the title"
                        />
                        <Button onClick={() => setConfirmDialogOpen(true)}>Show Confirm Dialog</Button>
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>ConfirmDialog with custom button props</h3>
                    <div className="component-group">
                        <ConfirmDialog
                            message="this is the message"
                            isOpen={isConfirmDialogOpen2}
                            primaryButtonLabel="Ok"
                            primaryButtonPrefixIcon="👌"
                            primaryButtonVariant="warning"
                            secondaryButtonLabel="Abort"
                            secondaryButtonPrefixIcon="🚫"
                            secondaryButtonVariant="info"
                            onPrimaryButtonClick={() => setConfirmDialogOpen2(false)}
                            onSecondaryButtonClick={() => setConfirmDialogOpen2(false)}
                            title="this is the title"
                        />
                        <Button onClick={() => setConfirmDialogOpen2(true)}>Show Confirm Dialog</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};
