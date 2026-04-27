import React, { useState } from 'react';

import { AlertDialog, type IconName } from '../../../src';
import { type ButtonVariant, Button } from '../../../src/components/Button';

interface DialogConfig {
    title: string;
    message: string;
    variant: ButtonVariant;
    label: string;
    icon: IconName;
}

export const AlertDialogPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
        title: 'Delete item',
        message: 'This action cannot be undone.',
        variant: 'danger',
        label: 'Delete',
        icon: 'delete',
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
                                    icon: 'delete',
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
                                    icon: 'save',
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
                                    icon: 'checkmark',
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
                primary={{
                    text: dialogConfig.label,
                    variant: dialogConfig.variant,
                    icon: dialogConfig.icon,
                    onClick: () => setIsOpen(false),
                }}
            />
        </div>
    );
};
