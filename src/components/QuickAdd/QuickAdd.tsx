import React, { useState } from 'react';

import { IconName } from '../Icon';
import { InputText } from '../InputText';
import { Modal } from '../Modal';

import './QuickAdd.scss';

interface QuickAddProps {
    isOpen?: boolean;
    placeholder: string;
    title: string;
    onClose: () => void;
    onSave: (value: string | undefined) => Promise<void> | void;
    titleIcon?: IconName;
    value?: string;
    usePortal?: boolean;
}

export const QuickAdd: React.FC<QuickAddProps> = ({ isOpen = false, onClose, placeholder, title, onSave, titleIcon, value = '', usePortal = false }) => {
    const [currentValue, setCurrentValue] = useState<string | undefined>(value);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(currentValue);
        setIsSaving(false);
        onClose();
    };

    const handleChange = (newValue: string | undefined): void => {
        setCurrentValue(newValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <div className="quick-add">
            <Modal
                isOpen={isOpen}
                title={title}
                titleIcon={titleIcon}
                size="small"
                onClose={onClose}
                onOverlayClick={onClose}
                secondary={{ text: 'Cancel', variant: 'default', disabled: isSaving, onClick: onClose }}
                primary={{ text: isSaving ? 'Saving...' : 'Save', variant: 'success', disabled: isSaving, onClick: handleSave }}
                usePortal={usePortal}
            >
                <div className="quick-add-input">
                    <InputText placeholder={placeholder} value={currentValue} onChange={handleChange} onKeyDown={handleKeyDown} autoFocus />
                </div>
            </Modal>
        </div>
    );
};
