import React from 'react';

import { ButtonVariant } from '../Button';
import { Modal } from '../Modal';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;

    onSecondaryButtonClick: () => void;
    onPrimaryButtonClick: () => void;
    primaryButtonLabel?: string;
    primaryButtonPrefixIcon?: string;
    primaryButtonVariant?: ButtonVariant;
    secondaryButtonLabel?: string;
    secondaryButtonPrefixIcon?: string;
    secondaryButtonVariant?: ButtonVariant;
    title: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen = false,
    message,
    onSecondaryButtonClick,
    onPrimaryButtonClick,
    primaryButtonLabel = 'Confirm',
    primaryButtonPrefixIcon = '✓',
    primaryButtonVariant = 'danger',
    secondaryButtonLabel = 'Cancel',
    secondaryButtonPrefixIcon = '❎',
    secondaryButtonVariant = 'default',
    title,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={onSecondaryButtonClick}
            size="small"
            className="confirm-dialog"
            primaryButton={{
                text: primaryButtonLabel,
                onClick: onPrimaryButtonClick,
                icon: primaryButtonPrefixIcon,
                variant: primaryButtonVariant,
            }}
            secondaryButton={{
                text: secondaryButtonLabel,
                onClick: onSecondaryButtonClick,
                icon: secondaryButtonPrefixIcon,
                variant: secondaryButtonVariant,
            }}
        >
            <div className="confirm-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
export default ConfirmDialog;
