import React from 'react';

import { type ExternalButtonConfig } from '../Button';
import { Modal } from '../Modal';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    title: string;
    confirm?: ExternalButtonConfig;
    cancel?: ExternalButtonConfig;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ isOpen = false, message, title, confirm, cancel }: ConfirmDialogProps) => {
    const cancelButtonProps = {
        variant: cancel?.variant || 'default',
        icon: cancel?.icon || 'clear',
        onClick: cancel?.onClick,
        disabled: cancel?.disabled,
        text: cancel?.text || 'Cancel',
    };

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={cancel?.onClick ? () => (cancel.onClick as () => void)() : undefined}
            size="small"
            className="confirm-dialog"
            primary={{
                variant: confirm?.variant || 'danger',
                icon: confirm?.icon || 'checkmark',
                onClick: confirm?.onClick,
                disabled: confirm?.disabled,
                text: confirm?.text || 'Confirm',
            }}
            secondary={cancelButtonProps}
        >
            <div className="confirm-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
export default ConfirmDialog;
