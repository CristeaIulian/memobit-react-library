import React, { useCallback } from 'react';

import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

import { Button } from '../Button';

import './ConfirmDialog.scss';

interface ConfirmDialogProps {
    isOpen: boolean;
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
    const handleConfirm = () => {
        onConfirm();
    };

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    // Close on overlay click
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    // Handle escape key
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [handleCancel, isOpen]);

    useBodyScrollLock(isOpen);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
                <div className="confirm-dialog__header">
                    <h3>{title}</h3>
                </div>

                <div className="confirm-dialog__body">
                    <p>{message}</p>
                </div>

                <div className="confirm-dialog__actions">
                    <Button onClick={handleConfirm} prefixIcon="✓" variant="success">
                        {confirmText}
                    </Button>
                    <Button onClick={handleCancel} prefixIcon="❎" variant="default">
                        {cancelText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
