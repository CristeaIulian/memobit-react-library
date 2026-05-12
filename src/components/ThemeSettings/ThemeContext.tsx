import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { getThemeConfig } from './themeConfig';

export type Theme =
    | 'amber-meridian'
    | 'archive-indigo'
    | 'arctic-blue'
    | 'asphalt-code'
    | 'azure-night'
    | 'blueprint-clay'
    | 'blush-market'
    | 'brass-chronicle'
    | 'carbon-velocity'
    | 'chalk-circuit'
    | 'clinical-aqua'
    | 'cobalt-pulse'
    | 'crawler-dusk'
    | 'crimson-dusk'
    | 'cyber-forest'
    | 'dashdarkx'
    | 'ember-night'
    | 'emerald-ledger'
    | 'frost-petal'
    | 'garden-harvest'
    | 'gilded-bear'
    | 'graphite-shell'
    | 'horizon-amber'
    | 'horizon-drift'
    | 'ivory-serif'
    | 'lavender-mist'
    | 'light-blue'
    | 'luna'
    | 'mesh-circuit'
    | 'midnight-amber'
    | 'mint-meadow'
    | 'mintone'
    | 'neon-tokyo'
    | 'ocean-breeze'
    | 'ocean-depths'
    | 'sandstone'
    | 'sandy-parchment'
    | 'signal-burst'
    | 'slate-focus'
    | 'spectrum-vault'
    | 'tailwind-vue-dark'
    | 'terminal-phosphor'
    | 'terracotta-kitchen'
    | 'twilight-pulse'
    | 'vault-guard'
    | 'velvet-reel'
    | 'velvet-tome'
    | 'vital-signal';

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'luna';
const FONT_LINK_ID = 'theme-font-link';
const FONT_LINK_DISPLAY_ID = 'theme-font-link-display';
const FONT_LINK_MONO_ID = 'theme-font-link-mono';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return (storedTheme as Theme) || DEFAULT_THEME;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        const themeConfig = getThemeConfig(theme);

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
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
