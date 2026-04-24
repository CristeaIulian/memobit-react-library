import { FC, useState } from 'react';

import { Modal } from '../Modal';
import { InputNumber } from '../InputNumber';

import './QuickNumberUpdate.scss';

interface QuickNumberUpdateProps {
    icon?: string;
    isOpen?: boolean;
    max?: number;
    min?: number;
    onClose: () => void;
    onSave: (value: number | undefined) => Promise<void> | void;
    title: string;
    value: number;
}

export const QuickNumberUpdate: FC<QuickNumberUpdateProps> = ({ isOpen = false, title, onClose, onSave, icon, value, min, max }: QuickNumberUpdateProps) => {
    const [currentValue, setCurrentValue] = useState<number | undefined>(value);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(currentValue);
        setIsSaving(false);
        onClose();
    };

    const handleChange = (newValue: number | undefined): void => {
        setCurrentValue(newValue);
    };

    return (
        <Modal
            isOpen={isOpen}
            title={`${icon} ${title}`}
            size="small"
            onClose={onClose}
            onOverlayClick={onClose}
            buttons={[
                { children: 'Cancel', variant: 'default', disabled: isSaving, onClick: onClose },
                { children: isSaving ? 'Saving...' : 'Save', variant: 'success', disabled: isSaving, onClick: handleSave },
            ]}
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
