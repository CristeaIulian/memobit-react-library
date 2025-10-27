import React, { FC } from 'react';

import { Dropdown, DropdownOption } from '../Dropdown';
import { Modal } from '../Modal';

import { useTheme } from './useTheme';

import './ThemeModal.scss';

interface ThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ThemeModal: FC<ThemeModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions: DropdownOption[] = [
        { label: 'Light Blue', value: 'light-blue' },
        { label: 'Luna', value: 'luna' },
        { label: 'MinTone', value: 'mintone' },
    ];

    const handleThemeChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (option && !Array.isArray(option)) {
            setTheme(option.value as 'light-blue' | 'luna' | 'mintone');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Theme Settings" size="auto">
            <div className="theme-modal">
                <div className="theme-modal__content">
                    <label htmlFor="theme-selector">Select Theme</label>
                    <Dropdown id="theme-selector" name="theme" options={themeOptions} value={theme} onChange={handleThemeChange} placeholder="Choose a theme" />
                </div>
            </div>
        </Modal>
    );
};
