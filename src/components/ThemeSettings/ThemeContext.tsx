import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { getThemeConfig, THEME_CONFIGS } from './themeConfig';
import { ThemeContext, type Theme, type ThemeEffects, type ThemeSaveValue } from './ThemeContextValue';

const FONT_LINK_ID = 'theme-font-link';
const FONT_LINK_DISPLAY_ID = 'theme-font-link-display';
const FONT_LINK_MONO_ID = 'theme-font-link-mono';

export interface ThemeProviderProps {
    children: ReactNode;
    theme: Theme;
    effects: ThemeEffects;
    onSave?: (value: ThemeSaveValue) => void;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, theme, effects, onSave }) => {
    const [previewTheme, setPreviewThemeState] = useState<Theme | null>(null);
    const [previewEffects, setPreviewEffectsState] = useState<ThemeEffects | null>(null);

    const activeTheme = previewTheme ?? theme;
    const activeEffects = previewEffects ?? effects;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', activeTheme);

        const themeConfig = getThemeConfig(activeTheme);

        if (themeConfig) {
            let linkElement = document.getElementById(FONT_LINK_ID) as HTMLLinkElement;

            if (!linkElement) {
                linkElement = document.createElement('link');
                linkElement.id = FONT_LINK_ID;
                linkElement.rel = 'stylesheet';
                document.head.appendChild(linkElement);
            }

            linkElement.href = themeConfig.fontUrl;

            let displayLinkElement = document.getElementById(FONT_LINK_DISPLAY_ID) as HTMLLinkElement;

            if (themeConfig.fontUrlDisplay) {
                if (!displayLinkElement) {
                    displayLinkElement = document.createElement('link');
                    displayLinkElement.id = FONT_LINK_DISPLAY_ID;
                    displayLinkElement.rel = 'stylesheet';
                    document.head.appendChild(displayLinkElement);
                }

                displayLinkElement.href = themeConfig.fontUrlDisplay;
            } else {
                displayLinkElement?.remove();
            }

            let monoLinkElement = document.getElementById(FONT_LINK_MONO_ID) as HTMLLinkElement;

            if (themeConfig.fontUrlMono) {
                if (!monoLinkElement) {
                    monoLinkElement = document.createElement('link');
                    monoLinkElement.id = FONT_LINK_MONO_ID;
                    monoLinkElement.rel = 'stylesheet';
                    document.head.appendChild(monoLinkElement);
                }

                monoLinkElement.href = themeConfig.fontUrlMono;
            } else {
                monoLinkElement?.remove();
            }
        }
    }, [activeTheme]);

    const setPreviewTheme = useCallback((next: Theme) => {
        setPreviewThemeState(next);
    }, []);

    const setPreviewEffects = useCallback((next: ThemeEffects) => {
        setPreviewEffectsState(next);
    }, []);

    const clearPreview = useCallback(() => {
        setPreviewThemeState(null);
        setPreviewEffectsState(null);
    }, []);

    useEffect(() => {
        const isTypingTarget = (el: EventTarget | null) => {
            if (!(el instanceof HTMLElement)) return false;
            const tag = el.tagName;
            return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
        };

        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (isTypingTarget(e.target)) return;

            if (e.key === '[' || e.key === ']') {
                e.preventDefault();
                const themes = THEME_CONFIGS.map((c) => c.value as Theme);
                const currentIdx = themes.indexOf(activeTheme);
                const startIdx = currentIdx === -1 ? 0 : currentIdx;
                const delta = e.key === ']' ? 1 : -1;
                const nextIdx = (startIdx + delta + themes.length) % themes.length;
                setPreviewThemeState(themes[nextIdx]);
            } else if (e.key === 'Escape' && previewTheme) {
                e.preventDefault();
                setPreviewThemeState(null);
                setPreviewEffectsState(null);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [activeTheme, previewTheme]);

    const activeThemeIdx = THEME_CONFIGS.findIndex((c) => c.value === activeTheme);
    const activeThemeLabel = activeThemeIdx >= 0 ? THEME_CONFIGS[activeThemeIdx].label : activeTheme;

    const commitPreview = useCallback(() => {
        onSave?.({ theme: activeTheme, effects: activeEffects });
        setPreviewThemeState(null);
        setPreviewEffectsState(null);
    }, [activeTheme, activeEffects, onSave]);

    return (
        <ThemeContext.Provider
            value={{
                theme: activeTheme,
                effects: activeEffects,
                setPreviewTheme,
                setPreviewEffects,
                commitPreview,
                clearPreview,
            }}
        >
            {children}
            {previewTheme && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                        zIndex: 99999,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(0, 0, 0, 0.85)',
                        color: '#fff',
                        font: '500 13px/1.4 system-ui, sans-serif',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    <span
                        onClick={() => void navigator.clipboard.writeText(activeThemeLabel)}
                        style={{ cursor: 'pointer' }}
                        title="Copy theme name"
                    >
                        {activeThemeLabel}
                    </span>
                    <span style={{ opacity: 0.6, marginLeft: 8, pointerEvents: 'none' }}>
                        {activeThemeIdx + 1}/{THEME_CONFIGS.length}
                    </span>
                    <div style={{ opacity: 0.5, fontSize: 11, marginTop: 2, pointerEvents: 'none' }}>[ prev · ] next · Esc revert</div>
                </div>
            )}
        </ThemeContext.Provider>
    );
};
