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

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className="quick-add">
            <Button variant={buttonVariant} prefixIcon={icon} onClick={handleOpen}>
                {buttonText}
            </Button>

            <Modal
                isOpen={isOpen}
                title={title}
                size="small"
                onClose={handleClose}
                onOverlayClick={handleOverlayClick}
                secondary={{ text: 'Cancel', variant: 'default', disabled: loading, onClick: handleClose }}
                primary={{ text: loading ? 'Saving...' : 'Save', variant: 'success', disabled: loading || !value.trim(), onClick: handleSave }}
            >
                <div className="quick-add-input">
                    <InputText
                        placeholder={placeholder}
                        value={value}
                        onChange={value => setValue(value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        disabled={loading}
                        error={error}
                    />
                </div>
            </Modal>
        </div>
    );
};
