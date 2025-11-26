import React from 'react';

import { ButtonVariant } from '../Button';
import { Modal } from '../Modal';

import './AlertDialog.scss';

interface AlertDialogProps {
    isOpen: boolean;
    message: string;
    onPrimaryButtonClick: () => void;
    primaryButtonLabel?: string;
    primaryButtonPrefixIcon?: string;
    primaryButtonVariant?: ButtonVariant;
    title: string;
}

export const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen = false,
    message,
    onPrimaryButtonClick,
    primaryButtonLabel = 'OK',
    primaryButtonPrefixIcon = '✓',
    primaryButtonVariant = 'danger',
    title,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onPrimaryButtonClick}
            size="small"
            className="alert-dialog"
            primaryButton={{
                text: primaryButtonLabel,
                onClick: onPrimaryButtonClick,
                icon: primaryButtonPrefixIcon,
                variant: primaryButtonVariant,
            }}
        >
            <div className="alert-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
