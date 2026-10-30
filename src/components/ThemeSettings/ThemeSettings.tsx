import { type CSSProperties, FC, useEffect, useMemo, useRef, useState } from 'react';

import { previewPalettes } from '@memobit/themes';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
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
    const t = useMessages(libMessages);
    const { theme, effects, setPreviewTheme, setPreviewEffects, commitPreview, clearPreview } = useTheme();

    const appearanceFilters: { value: AppearanceFilter; label: string }[] = [
        { value: 'all', label: t.appearanceAll },
        { value: 'light', label: t.appearanceLight },
        { value: 'dark', label: t.appearanceDark },
    ];

    // `value` is what the effects settings store, so it stays the same in every language.
    const componentsWithEffects = [
        { value: 'Card', label: t.effectComponentCard },
        { value: 'Modal', label: t.effectComponentModal },
    ];

    const effectOptions: DropdownOption[] = [
        { label: t.effectNone, value: '' },
        { label: t.effectNoteContainer, value: 'note-container-effect' },
        { label: t.effectInfuse, value: 'infuse-effect' },
        { label: t.effectUpLift, value: 'up-lift-effect' },
        { label: t.effectGlow, value: 'glow-effect' },
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
            themes = themes.filter(config => (config.recommendedApps ?? []).some(app => app.toLowerCase() === currentAppKey));
        }

        if (appearanceFilter !== 'all') {
            themes = themes.filter(config => getThemeAppearance(config.value) === appearanceFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            themes = themes.filter(
                config => config.label.toLowerCase().includes(query) || (config.recommendedApps ?? []).some(app => app.toLowerCase().includes(query))
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
        if (!isOpen || searchQuery || showFavoritesOnly || showRecommendedOnly || appearanceFilter !== 'all' || hasScrolledToActiveThemeRef.current) {
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
            title={t.themeSettings}
            position="right"
            width="520px"
            maxWidth="calc(100vw - 32px)"
            className="theme-settings-drawer"
            secondary={{ text: t.cancel, variant: 'default', onClick: handleCancel, icon: 'clear' }}
            primary={{ text: t.saveChanges, variant: 'success', onClick: handleSave, icon: 'save' }}
        >
            <div className="theme-settings">
                <div className="theme-settings__content">
                    <div className="theme-settings__section">
                        <label>{t.selectTheme}</label>
                        {(showSearch || showFavorites || currentApp) && (
                            <div className="theme-settings__toolbar">
                                {showSearch && <InputSearch placeholder={t.searchThemes} value={searchQuery} onChange={setSearchQuery} />}
                                {currentApp && (
                                    <ToggleSwitch
                                        checked={showRecommendedOnly}
                                        onChange={setShowRecommendedOnly}
                                        onLabel={t.themesForApp(currentApp)}
                                        offLabel={t.themesForApp(currentApp)}
                                        size="small"
                                    />
                                )}
                                {showFavorites && (
                                    <ToggleSwitch
                                        checked={showFavoritesOnly}
                                        onChange={setShowFavoritesOnly}
                                        onLabel={t.favorites}
                                        offLabel={t.favorites}
                                        size="small"
                                    />
                                )}
                            </div>
                        )}
                        {showAppearanceFilter && (
                            <div className="theme-settings__appearance">
                                {appearanceFilters.map(filter => (
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
                                <div className="theme-settings__empty">{t.noThemes}</div>
                            ) : (
                                filteredThemes.map(config => (
                                    <button
                                        key={config.value}
                                        ref={theme === config.value ? activeThemeRef : null}
                                        type="button"
                                        className={`theme-settings__swatch ${theme === config.value ? 'theme-settings__swatch--active' : ''}`}
                                        onClick={() => handleThemeSelect(config.value as Theme)}
                                    >
                                        <div className="theme-settings__preview" style={previewPalettes[config.value] as CSSProperties}>
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
                                <label htmlFor="effect-selector">{t.componentEffect}</label>
                                <Dropdown
                                    id="effect-selector"
                                    name="effect"
                                    options={effectOptions}
                                    value={effects.effect}
                                    onChange={handleEffectChange}
                                    placeholder={t.chooseEffect}
                                />
                            </div>

                            <div className="theme-settings__section">
                                <label>{t.applyEffectTo}</label>
                                <div className="theme-settings__components">
                                    {componentsWithEffects.map(component => (
                                        <Checkbox
                                            key={component.value}
                                            label={component.label}
                                            checked={effects.components.includes(component.value)}
                                            onChange={checked => handleComponentToggle(component.value, checked)}
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
