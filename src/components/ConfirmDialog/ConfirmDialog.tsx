import React from 'react';

import { Modal } from '../Modal';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isOpen?: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onCancel}
            size="small"
            className="confirm-dialog"
            primaryButton={{
                text: confirmText,
                onClick: onConfirm,
                icon: '✓',
                variant: 'success',
            }}
            secondaryButton={{
                text: cancelText,
                onClick: onCancel,
                icon: '❎',
                variant: 'default',
            }}
        >
            <div className="confirm-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
