import React from 'react';

import { ButtonProps, ButtonVariant } from '../Button';
import { Modal } from '../Modal';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    title: string;

    confirmButton?: ButtonProps;
    cancelButton?: ButtonProps;

    /** @deprecated Use `confirmButton` instead. */
    onPrimaryButtonClick?: () => void;
    /** @deprecated Use `confirmButton` instead. */
    primaryButtonLabel?: string;
    /** @deprecated Use `confirmButton` instead. */
    primaryButtonPrefixIcon?: string;
    /** @deprecated Use `confirmButton` instead. */
    primaryButtonVariant?: ButtonVariant;
    /** @deprecated Use `cancelButton` instead. */
    onSecondaryButtonClick?: () => void;
    /** @deprecated Use `cancelButton` instead. */
    secondaryButtonLabel?: string;
    /** @deprecated Use `cancelButton` instead. */
    secondaryButtonPrefixIcon?: string;
    /** @deprecated Use `cancelButton` instead. */
    secondaryButtonVariant?: ButtonVariant;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen = false,
    message,
    title,
    confirmButton,
    cancelButton,
    onPrimaryButtonClick,
    primaryButtonLabel = 'Confirm',
    primaryButtonPrefixIcon = '✓',
    primaryButtonVariant = 'danger',
    onSecondaryButtonClick,
    secondaryButtonLabel = 'Cancel',
    secondaryButtonPrefixIcon = '✖',
    secondaryButtonVariant = 'default',
}: ConfirmDialogProps) => {
    const resolvedConfirm: ButtonProps | undefined = confirmButton ?? (onPrimaryButtonClick ? {
        children: primaryButtonLabel,
        prefixIcon: primaryButtonPrefixIcon,
        variant: primaryButtonVariant,
        onClick: onPrimaryButtonClick,
    } : undefined);

    const resolvedCancel: ButtonProps | undefined = cancelButton ?? (onSecondaryButtonClick ? {
        children: secondaryButtonLabel,
        prefixIcon: secondaryButtonPrefixIcon,
        variant: secondaryButtonVariant,
        onClick: onSecondaryButtonClick,
    } : undefined);

    return (
        <Modal
            isOpen={isOpen}
            title={title}
            onClose={cancelButton?.onClick ? () => (cancelButton.onClick as () => void)() : onSecondaryButtonClick}
            size="small"
            className="confirm-dialog"
            buttons={[resolvedCancel, resolvedConfirm].filter((b): b is ButtonProps => b !== undefined)}
        >
            <div className="confirm-dialog__body">
                <p>{message}</p>
            </div>
        </Modal>
    );
};
export default ConfirmDialog;
