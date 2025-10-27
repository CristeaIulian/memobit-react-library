import React, { FC, useState } from 'react';

import { Modal } from '../Modal';
import { InputNumber } from '../InputNumber';

import './QuickNumberUpdate.scss';

interface QuickNumberUpdateProps {
    icon?: string;
    isOpen?: boolean;
    max?: number;
    min?: number;
    onClose: () => void;
    onSave: (value: number) => Promise<void> | void;
    title: string;
    value: number;
}

export const QuickNumberUpdate: FC<QuickNumberUpdateProps> = ({ isOpen, title, onClose, onSave, icon, value, min, max }: QuickNumberUpdateProps) => {
    const [currentValue, setCurrentValue] = useState<number>(value);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(currentValue);
        setIsSaving(false);
        onClose();
    };

    const handleChange = (newValue: number | undefined): void => {
        const numValue = newValue || 0;
        setCurrentValue(numValue);
    };

    return (
        <Modal
            isOpen={isOpen}
            title={`${icon} ${title}`}
            size="small"
            onClose={onClose}
            onOverlayClick={onClose}
            primaryButton={{
                text: isSaving ? 'Saving...' : 'Save',
                onClick: handleSave,
                icon: '💾',
                variant: 'success',
                disabled: isSaving,
            }}
            secondaryButton={{
                text: 'Cancel',
                onClick: onClose,
                icon: '❎',
                variant: 'danger',
                disabled: isSaving,
            }}
        >
            <div className="quick-number-update">
                <div className="quick-number-update-content">
                    <InputNumber
                        autoFocus
                        min={min}
                        max={max}
                        value={currentValue}
                        onChange={handleChange}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleSave();
                            }
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
};
