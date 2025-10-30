import React, { FC, useEffect, useState } from 'react';

import { Checkbox } from '../Checkbox';
import { Dropdown, DropdownOption } from '../Dropdown';
import { Modal } from '../Modal';

import { useTheme } from './useTheme';

import './ThemeModal.scss';
import { Theme } from './ThemeContext';

interface ThemeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface EffectsConfig {
    effect: string;
    components: string[];
}

const EFFECTS_STORAGE_KEY = 'effects';

export const ThemeModal: FC<ThemeModalProps> = ({ isOpen, onClose }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions: DropdownOption[] = [
        { label: 'Light Blue', value: 'light-blue' },
        { label: 'Luna', value: 'luna' },
        { label: 'MinTone', value: 'mintone' },
        { label: 'Argon Dashboard Dark', value: 'argon-dark' },
        { label: 'Aargon Dashboard Light', value: 'argon-light' },
        { label: 'CRMi', value: 'crmi' },
        { label: 'DashDark X', value: 'dashdarkx' },
        { label: 'Tailwind View Dark', value: 'tailwind-vue-dark' },
        { label: 'Tailwind View Light', value: 'tailwind-vue-light' },
    ];

    const componentsWithEffects = ['Card', 'Modal'];

    const effectOptions: DropdownOption[] = [
        { label: 'None', value: '' },
        { label: 'Note Container', value: 'note-container-effect' },
        { label: 'Infuse', value: 'infuse-effect' },
        { label: 'Up Lift', value: 'up-lift-effect' },
    ];

    const [selectedEffect, setSelectedEffect] = useState<string>('');
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            try {
                const stored = localStorage.getItem(EFFECTS_STORAGE_KEY);
                if (stored) {
                    const config: EffectsConfig = JSON.parse(stored);
                    setSelectedEffect(config.effect || '');
                    setSelectedComponents(config.components || []);
                } else {
                    setSelectedEffect('');
                    setSelectedComponents([]);
                }
            } catch (error) {
                console.warn('Failed to load effects config:', error);
                setSelectedEffect('');
                setSelectedComponents([]);
            }
        }
    }, [isOpen]);

    const handleThemeChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (option && !Array.isArray(option)) {
            setTheme(option.value as Theme);
        }
    };

    const handleEffectChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (option && !Array.isArray(option)) {
            setSelectedEffect(option.value as string);
        }
    };

    const handleComponentToggle = (componentName: string, checked: boolean) => {
        if (checked) {
            setSelectedComponents(prev => [...prev, componentName]);
        } else {
            setSelectedComponents(prev => prev.filter(c => c !== componentName));
        }
    };

    const handleSave = () => {
        try {
            const config: EffectsConfig = {
                effect: selectedEffect,
                components: selectedComponents,
            };
            localStorage.setItem(EFFECTS_STORAGE_KEY, JSON.stringify(config));
            window.dispatchEvent(new Event('storage'));
            onClose();
        } catch (error) {
            console.error('Failed to save effects config:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Theme Settings"
            size="auto"
            primaryButton={{
                text: 'Save',
                onClick: handleSave,
                variant: 'success',
            }}
            secondaryButton={{
                text: 'Cancel',
                onClick: onClose,
                variant: 'default',
            }}
        >
            <div className="theme-modal">
                <div className="theme-modal__content">
                    <div className="theme-modal__section">
                        <label htmlFor="theme-selector">Select Theme</label>
                        <Dropdown
                            id="theme-selector"
                            name="theme"
                            options={themeOptions}
                            value={theme}
                            onChange={handleThemeChange}
                            placeholder="Choose a theme"
                        />
                    </div>

                    <div className="theme-modal__section">
                        <label htmlFor="effect-selector">Component Effect</label>
                        <Dropdown
                            id="effect-selector"
                            name="effect"
                            options={effectOptions}
                            value={selectedEffect}
                            onChange={handleEffectChange}
                            placeholder="Choose an effect"
                        />
                    </div>

                    <div className="theme-modal__section">
                        <label>Apply Effect To:</label>
                        <div className="theme-modal__components">
                            {componentsWithEffects.map(component => (
                                <Checkbox
                                    key={component}
                                    label={component}
                                    checked={selectedComponents.includes(component)}
                                    onChange={checked => handleComponentToggle(component, checked)}
                                    disabled={!selectedEffect}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
