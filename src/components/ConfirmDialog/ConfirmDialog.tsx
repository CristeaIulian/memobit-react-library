import React from 'react';

import { Modal } from '../Modal';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    cancelText?: string;
    confirmText?: string;
    isOpen: boolean;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    title: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    isOpen = false,
    message,
    onCancel,
    onConfirm,
    title,
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
