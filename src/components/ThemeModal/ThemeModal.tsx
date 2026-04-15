import { FC, useEffect, useState } from 'react';

import { Checkbox } from '../Checkbox';
import { Dropdown, DropdownOption } from '../Dropdown';
import { Modal } from '../Modal';

import { useTheme } from './useTheme';
import { Theme } from './ThemeContext';
import { THEME_CONFIGS } from './themeConfig';

import './ThemeModal.scss';

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

    const componentsWithEffects = ['Card', 'Modal'];

    const effectOptions: DropdownOption[] = [
        { label: 'None', value: '' },
        { label: 'Note Container', value: 'note-container-effect' },
        { label: 'Infuse', value: 'infuse-effect' },
        { label: 'Up Lift', value: 'up-lift-effect' },
        { label: 'Glow', value: 'glow-effect' },
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

    const handleEffectChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (!option || Array.isArray(option)) {
            setSelectedEffect('');
        } else {
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
            size="medium"
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
                        <label>Select Theme</label>
                        <div className="theme-modal__grid">
                            {THEME_CONFIGS.map(config => (
                                <button
                                    key={config.value}
                                    type="button"
                                    className={`theme-modal__swatch ${theme === config.value ? 'theme-modal__swatch--active' : ''}`}
                                    onClick={() => setTheme(config.value as Theme)}
                                >
                                    <div
                                        className="theme-modal__preview"
                                        data-theme={config.value}
                                    >
                                        <div className="theme-modal__preview-header" />
                                        <div className="theme-modal__preview-body">
                                            <div className="theme-modal__preview-card">
                                                <div className="theme-modal__preview-line theme-modal__preview-line--accent" />
                                                <div className="theme-modal__preview-line" />
                                                <div className="theme-modal__preview-line theme-modal__preview-line--short" />
                                            </div>
                                            <div className="theme-modal__preview-sidebar">
                                                <div className="theme-modal__preview-dot" />
                                                <div className="theme-modal__preview-dot" />
                                                <div className="theme-modal__preview-dot" />
                                            </div>
                                        </div>
                                    </div>
                                    <span className="theme-modal__swatch-label">{config.label}</span>
                                </button>
                            ))}
                        </div>
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
