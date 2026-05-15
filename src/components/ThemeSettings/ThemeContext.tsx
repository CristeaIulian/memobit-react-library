import { FC, ReactNode, useCallback, useEffect, useState } from 'react';

import { getThemeConfig } from './themeConfig';
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
        </ThemeContext.Provider>
    );
};
