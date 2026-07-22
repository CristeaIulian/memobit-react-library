import { FC, useEffect, useMemo, useRef, useState } from 'react';

import { Checkbox } from '../Checkbox';
import { Drawer } from '../Drawer';
import { Dropdown, DropdownOption } from '../Dropdown';
import { InputSearch } from '../InputSearch';
import { ToggleSwitch } from '../ToggleSwitch';

import { FAVORITE_THEMES, getThemeAppearance, THEME_CONFIGS, type ThemeAppearance } from './themeConfig';
import { type Theme } from './ThemeContextValue';
import { useTheme } from './useTheme';

import './ThemeSettings.scss';

type AppearanceFilter = 'all' | ThemeAppearance;

const APPEARANCE_FILTERS: { value: AppearanceFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
];

export interface ThemeSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    allowedThemes?: string[];
    currentApp?: string;
    showEffects?: boolean;
    showSearch?: boolean;
    showFavorites?: boolean;
    showAppearanceFilter?: boolean;
}

export const ThemeSettings: FC<ThemeSettingsProps> = ({
    isOpen,
    onClose,
    allowedThemes,
    currentApp,
    showEffects = true,
    showSearch = true,
    showFavorites = true,
    showAppearanceFilter = true,
}) => {
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
    const [showRecommendedOnly, setShowRecommendedOnly] = useState(false);
    const [appearanceFilter, setAppearanceFilter] = useState<AppearanceFilter>('all');
    const activeThemeRef = useRef<HTMLButtonElement | null>(null);
    const hasScrolledToActiveThemeRef = useRef(false);

    const currentAppKey = currentApp?.trim().toLowerCase() ?? '';

    const filteredThemes = useMemo(() => {
        let themes = THEME_CONFIGS;

        if (allowedThemes && allowedThemes.length > 0) {
            const allowed = new Set(allowedThemes);
            themes = themes.filter(config => allowed.has(config.value));
        }

        if (showFavoritesOnly) {
            themes = themes.filter(config => FAVORITE_THEMES.has(config.value));
        }

        if (showRecommendedOnly && currentAppKey) {
            themes = themes.filter(config =>
                (config.recommendedApps ?? []).some(app => app.toLowerCase() === currentAppKey)
            );
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
    }, [searchQuery, showFavoritesOnly, showRecommendedOnly, currentAppKey, appearanceFilter, allowedThemes]);

    useEffect(() => {
        if (isOpen) {
            setSearchQuery('');
            setShowFavoritesOnly(false);
            setShowRecommendedOnly(false);
            setAppearanceFilter('all');
        } else {
            hasScrolledToActiveThemeRef.current = false;
        }
    }, [isOpen]);

    useEffect(() => {
        if (
            !isOpen ||
            searchQuery ||
            showFavoritesOnly ||
            showRecommendedOnly ||
            appearanceFilter !== 'all' ||
            hasScrolledToActiveThemeRef.current
        ) {
            return;
        }

        const animationFrameId = window.requestAnimationFrame(() => {
            activeThemeRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' });
            hasScrolledToActiveThemeRef.current = true;
        });

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [isOpen, searchQuery, showFavoritesOnly, showRecommendedOnly, appearanceFilter, theme]);

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
                        {(showSearch || showFavorites || currentApp) && (
                            <div className="theme-settings__toolbar">
                                {showSearch && (
                                    <InputSearch placeholder="Search themes..." value={searchQuery} onChange={setSearchQuery} />
                                )}
                                {currentApp && (
                                    <ToggleSwitch
                                        checked={showRecommendedOnly}
                                        onChange={setShowRecommendedOnly}
                                        onLabel={`For ${currentApp}`}
                                        offLabel={`For ${currentApp}`}
                                        size="small"
                                    />
                                )}
                                {showFavorites && (
                                    <ToggleSwitch
                                        checked={showFavoritesOnly}
                                        onChange={setShowFavoritesOnly}
                                        onLabel="Favorites"
                                        offLabel="Favorites"
                                        size="small"
                                    />
                                )}
                            </div>
                        )}
                        {showAppearanceFilter && (
                            <div className="theme-settings__appearance">
                                {APPEARANCE_FILTERS.map(filter => (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        className={`theme-settings__appearance-option ${
                                            appearanceFilter === filter.value ? 'theme-settings__appearance-option--active' : ''
                                        }`}
                                        onClick={() => setAppearanceFilter(filter.value)}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </div>
                        )}
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
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {showEffects && (
                        <>
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
                        </>
                    )}
                </div>
            </div>
        </Drawer>
    );
};
