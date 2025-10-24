import React, { useState } from 'react';

import { Button } from '../Button';
import { Radio } from '../Radio';
import { Modal } from '../Modal';

import './QuickOptionUpdate.scss';

interface QuickOptionUpdateProps {
    icon?: string;
    list: { key: string; label: string }[];
    onClose: () => void;
    onSave: (value: string | number) => Promise<void> | void;
    title: string;
    value: string;
}

export const QuickOptionUpdate: React.FC<QuickOptionUpdateProps> = ({ list, title, onClose, onSave, icon, value }) => {
    const [workingValue, setWorkingValue] = useState<string | number>(value);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            <Modal title={`${icon} ${title}`} size="small" onClose={onClose} onOverlayClick={onClose}>
                <div className="quick-set-list">
                    {list &&
                        list.map(({ key, label }, index) => (
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

                <div className="quick-add__actions">
                    <Button prefixIcon="💾" onClick={handleSave} disabled={loading || !workingValue}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button variant="secondary" prefixIcon="❎" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </div>
    );
};
