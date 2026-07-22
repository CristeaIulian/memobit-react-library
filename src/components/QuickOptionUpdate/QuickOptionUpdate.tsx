import React, { useEffect, useState } from 'react';

import { IconName } from '../Icon';
import { Modal } from '../Modal';
import { Radio } from '../Radio';

import './QuickOptionUpdate.scss';

interface QuickOptionUpdateProps {
    icon?: IconName;
    isOpen: boolean;
    list: { key: string; label: string }[];
    onClose: () => void;
    onSave: (value: string | number) => Promise<void> | void;
    title: string;
    value: string;
}

export const QuickOptionUpdate: React.FC<QuickOptionUpdateProps> = ({ isOpen = false, list, title, onClose, onSave, icon, value }) => {
    const [workingValue, setWorkingValue] = useState<string | number>(value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setWorkingValue(value);
    }, [value]);

    const handleSave = async () => {
        if (!workingValue) {
            setError('Please select a value');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onSave(workingValue);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (newValue: string | number | boolean) => {
        if (typeof newValue === 'string' || typeof newValue === 'number') {
            setWorkingValue(newValue);
        } else {
            console.error('Unsupported type used.');
        }
    };

    return (
        <div className="quick-set">
            <Modal
                isOpen={isOpen}
                titleIcon={icon}
                title={title}
                size="small"
                onClose={onClose}
                onOverlayClick={onClose}
                secondary={{ text: 'Cancel', variant: 'default', disabled: loading, onClick: onClose }}
                primary={{ text: loading ? 'Saving...' : 'Save', variant: 'success', disabled: loading || !workingValue, onClick: handleSave }}
            >
                <div className="quick-set-list">
                    {list &&
                        list.map(({ key, label }) => (
                            <Radio
                                key={`quick-update-ownership-${key}`}
                                name="ownership"
                                label={label}
                                checked={workingValue === key}
                                value={key}
                                onChange={key => handleInputChange(key)}
                            />
                        ))}
                </div>

                {error && <div className="error-message">{error}</div>}
            </Modal>
        </div>
    );
};
