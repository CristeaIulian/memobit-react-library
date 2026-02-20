import React, { useState } from 'react';

import { AlertDialog, Button, type ButtonVariant } from '../../../src';

interface DialogConfig {
    title: string;
    message: string;
    variant: ButtonVariant;
    label: string;
    icon: string;
}

export const AlertDialogPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
        title: 'Delete item',
        message: 'This action cannot be undone.',
        variant: 'danger',
        label: 'Delete',
        icon: '!',
    });

    const openDialog = (config: DialogConfig) => {
        setDialogConfig(config);
        setIsOpen(true);
    };

    return (
        <div className="component-page">
            <h1>Alert Dialog Component</h1>
            <p>A focused alert dialog for single-action confirmations.</p>

            <section className="page-section">
                <h2>Examples</h2>
                <div className="showcase-group">
                    <h3>Choose a dialog style</h3>
                    <div className="component-group">
                        <Button
                            variant="danger"
                            onClick={() =>
                                openDialog({
                                    title: 'Delete item',
                                    message: 'This action cannot be undone.',
                                    variant: 'danger',
                                    label: 'Delete',
                                    icon: '!',
                                })
                            }
                        >
                            Destructive
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() =>
                                openDialog({
                                    title: 'Overwrite file',
                                    message: 'An existing file will be replaced.',
                                    variant: 'warning',
                                    label: 'Overwrite',
                                    icon: '!',
                                })
                            }
                        >
                            Warning
                        </Button>
                        <Button
                            variant="info"
                            onClick={() =>
                                openDialog({
                                    title: 'Save changes',
                                    message: 'Your updates will be applied immediately.',
                                    variant: 'info',
                                    label: 'Save',
                                    icon: 'i',
                                })
                            }
                        >
                            Informational
                        </Button>
                    </div>
                </div>
            </section>

            <AlertDialog
                isOpen={isOpen}
                title={dialogConfig.title}
                message={dialogConfig.message}
                primaryButtonLabel={dialogConfig.label}
                primaryButtonVariant={dialogConfig.variant}
                primaryButtonPrefixIcon={dialogConfig.icon}
                onPrimaryButtonClick={() => setIsOpen(false)}
            />
        </div>
    );
};
