import React from 'react';

import { type ExternalButtonConfig } from '../Button';
import { Modal } from '../Modal';

import './AlertDialog.scss';

interface AlertDialogProps {
    isOpen: boolean;
    message: string;
    primary?: ExternalButtonConfig;
    title: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ isOpen = false, message, primary, title }) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={primary?.onClick ? () => (primary.onClick as () => void)() : undefined}
            size="small"
            className="alert-dialog"
            primary={{
                variant: primary?.variant || 'danger',
                icon: primary?.icon || 'checkmark',
                onClick: primary?.onClick,
                disabled: primary?.disabled,
                text: primary?.text || 'OK',
            }}
        >
            <div className="alert-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
