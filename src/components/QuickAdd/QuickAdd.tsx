import React, { useState } from 'react';

import { Button } from '../Button';
import { InputText } from '../InputText';
import { Modal } from '../Modal';

import './QuickAdd.scss';
import { ButtonVariant } from '../Button/Button';

interface QuickAddProps {
    buttonText: string;
    buttonVariant?: ButtonVariant;
    placeholder: string;
    title: string;
    onSave: (value: string) => Promise<void> | void;
    icon?: string;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ buttonText, buttonVariant = 'default', placeholder, title, onSave, icon = '+' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOpen = () => {
        setIsOpen(true);
        setError('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setValue('');
        setError('');
    };

    const handleSave = async () => {
        if (!value.trim()) {
            setError('Please enter a value');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSave(value.trim());
            handleClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !loading) {
            handleSave();
        }
        if (e.key === 'Escape') {
            handleClose();
        }
    };

    // Close overlay when clicking outside
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className="quick-add">
            {/* Trigger Button */}
            <Button variant={buttonVariant} prefixIcon={icon} onClick={handleOpen}>
                {buttonText}
            </Button>

            <Modal
                isOpen={isOpen}
                title={title}
                size="small"
                onClose={handleClose}
                onOverlayClick={handleOverlayClick}
                primaryButton={{
                    text: loading ? 'Saving...' : 'Save',
                    onClick: handleSave,
                    icon: '💾',
                    variant: 'success',
                    disabled: loading || !value.trim(),
                }}
                secondaryButton={{
                    text: 'Cancel',
                    onClick: handleClose,
                    icon: '❎',
                    variant: 'default',
                    disabled: loading,
                }}
            >
                <div className="quick-add-input">
                    <InputText
                        placeholder={placeholder}
                        value={value}
                        onChange={value => setValue(value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        disabled={loading}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}
            </Modal>
        </div>
    );
};
