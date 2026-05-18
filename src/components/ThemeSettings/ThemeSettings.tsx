import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { Checkbox } from '../Checkbox';
import { Drawer } from '../Drawer';
import { Dropdown, DropdownOption } from '../Dropdown';
import { Search } from '../Search';
import { ToggleSwitch } from '../ToggleSwitch';

import { useTheme } from './useTheme';
import { type Theme } from './ThemeContextValue';
import { FAVORITE_THEMES, getThemeAppearance, THEME_CONFIGS, type ThemeAppearance } from './themeConfig';

type AppearanceFilter = 'all' | ThemeAppearance;

const APPEARANCE_FILTERS: { value: AppearanceFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

import './ThemeSettings.scss';

export interface ThemeSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ThemeSettings: FC<ThemeSettingsProps> = ({ isOpen, onClose }) => {
    const { theme, effects, setPreviewTheme, setPreviewEffects, commitPreview, clearPreview } = useTheme();

    const componentsWithEffects = ['Card', 'Modal'];

    const effectOptions: DropdownOption[] = [
        { label: 'None', value: '' },
        { label: 'Note Container', value: 'note-container-effect' },
        { label: 'Infuse', value: 'infuse-effect' },
        { label: 'Up Lift', value: 'up-lift-effect' },
        { label: 'Glow', value: 'glow-effect' },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [appearanceFilter, setAppearanceFilter] = useState<AppearanceFilter>('all');
    const activeThemeRef = useRef<HTMLButtonElement | null>(null);
    const hasScrolledToActiveThemeRef = useRef(false);

    const filteredThemes = useMemo(() => {
        let themes = THEME_CONFIGS;

        if (showFavoritesOnly) {
            themes = themes.filter(config => FAVORITE_THEMES.has(config.value));
        }

        if (appearanceFilter !== 'all') {
            themes = themes.filter(config => getThemeAppearance(config.value) === appearanceFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            themes = themes.filter(
                config =>
                    config.label.toLowerCase().includes(query) ||
                    (config.recommendedApps ?? []).some(app => app.toLowerCase().includes(query))
            );
        }

        return themes;
    }, [searchQuery, showFavoritesOnly, appearanceFilter]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setShowFavoritesOnly(false);
            setAppearanceFilter('all');
        } else {
            hasScrolledToActiveThemeRef.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || searchQuery || showFavoritesOnly || appearanceFilter !== 'all' || hasScrolledToActiveThemeRef.current) {
            return;
        }

        const animationFrameId = window.requestAnimationFrame(() => {
            activeThemeRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
            hasScrolledToActiveThemeRef.current = true;
        });

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [isOpen, searchQuery, showFavoritesOnly, appearanceFilter, theme]);

    const handleThemeSelect = (next: Theme) => {
        setPreviewTheme(next);
    };

    const handleEffectChange = (option: DropdownOption | DropdownOption[] | null) => {
        const nextEffect = !option || Array.isArray(option) ? '' : (option.value as string);
        setPreviewEffects({ effect: nextEffect, components: effects.components });
    };

    const handleComponentToggle = (componentName: string, checked: boolean) => {
        const nextComponents = checked ? [...effects.components, componentName] : effects.components.filter(c => c !== componentName);
        setPreviewEffects({ effect: effects.effect, components: nextComponents });
    };

    const handleCancel = () => {
        clearPreview();
        onClose();
    };

    const handleSave = () => {
        commitPreview();
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={handleCancel}
            title="Theme Settings"
            position="right"
            width="520px"
            maxWidth="calc(100vw - 32px)"
            className="theme-settings-drawer"
            secondary={{ text: 'Cancel', variant: 'default', onClick: handleCancel, icon: 'clear' }}
            primary={{ text: 'Save changes', variant: 'success', onClick: handleSave, icon: 'save' }}
        >
            <div className="theme-settings">
                <div className="theme-settings__content">
                    <div className="theme-settings__section">
                        <label>Select Theme</label>
                        <div className="theme-settings__toolbar">
                            <Search placeholder="Search themes..." value={searchQuery} onChange={setSearchQuery} />
                            <ToggleSwitch checked={showFavoritesOnly} onChange={setShowFavoritesOnly} onLabel="Favorites" offLabel="Favorites" size="small" />
                        </div>
                        <div className="theme-settings__appearance" role="group" aria-label="Filter by appearance">
                            {APPEARANCE_FILTERS.map(filter => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    className={`theme-settings__appearance-option ${
                                        appearanceFilter === filter.value ? 'theme-settings__appearance-option--active' : ''
                                    }`}
                                    aria-pressed={appearanceFilter === filter.value}
                                    onClick={() => setAppearanceFilter(filter.value)}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                        <div className="theme-settings__grid">
                            {filteredThemes.length === 0 ? (
                                <div className="theme-settings__empty">No themes found</div>
                            ) : (
                                filteredThemes.map(config => (
                                    <button
                                        key={config.value}
                                        ref={theme === config.value ? activeThemeRef : null}
                                        type="button"
                                        className={`theme-settings__swatch ${theme === config.value ? 'theme-settings__swatch--active' : ''}`}
                                        onClick={() => handleThemeSelect(config.value as Theme)}
                                    >
                                        <div className="theme-settings__preview" data-theme={config.value}>
                                            {FAVORITE_THEMES.has(config.value) && <span className="theme-settings__favorite-badge">&#11088;</span>}
                                            <div className="theme-settings__preview-header" />
                                            <div className="theme-settings__preview-body">
                                                <div className="theme-settings__preview-card">
                                                    <div className="theme-settings__preview-line theme-settings__preview-line--accent" />
                                                    <div className="theme-settings__preview-line" />
                                                    <div className="theme-settings__preview-line theme-settings__preview-line--short" />
                                                </div>
                                                <div className="theme-settings__preview-sidebar">
                                                    <div className="theme-settings__preview-dot" />
                                                    <div className="theme-settings__preview-dot" />
                                                    <div className="theme-settings__preview-dot" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="theme-settings__swatch-meta">
                                            <span className="theme-settings__swatch-label">{config.label}</span>
                                            {config.recommendedApps && config.recommendedApps.length > 0 && (
                                                <span
                                                    className="theme-settings__swatch-app"
                                                    title={`Best for: ${config.recommendedApps.join(', ')}`}
                                                >
                                                    Best for: {config.recommendedApps.join(', ')}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="theme-settings__section">
                        <label htmlFor="effect-selector">Component Effect</label>
                        <Dropdown
                            id="effect-selector"
                            name="effect"
                            options={effectOptions}
                            value={effects.effect}
                            onChange={handleEffectChange}
                            placeholder="Choose an effect"
                        />
                    </div>

                    <div className="theme-settings__section">
                        <label>Apply Effect To:</label>
                        <div className="theme-settings__components">
                            {componentsWithEffects.map(component => (
                                <Checkbox
                                    key={component}
                                    label={component}
                                    checked={effects.components.includes(component)}
                                    onChange={checked => handleComponentToggle(component, checked)}
                                    disabled={!effects.effect}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
};
