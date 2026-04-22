import { createContext, FC, ReactNode, useEffect, useState } from 'react';

import { getThemeConfig } from './themeConfig';

export type Theme =
    | 'arctic-blue'
    | 'azure-night'
    | 'crimson-dusk'
    | 'cyber-forest'
    | 'dashdarkx'
    | 'ember-night'
    | 'frost-petal'
    | 'lavender-mist'
    | 'light-blue'
    | 'luna'
    | 'mint-meadow'
    | 'mintone'
    | 'neon-tokyo'
    | 'ocean-breeze'
    | 'ocean-depths'
    | 'sandstone'
    | 'sandy-parchment'
    | 'tailwind-vue-dark'
    | 'twilight-pulse';

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'luna';
const FONT_LINK_ID = 'theme-font-link';
const FONT_LINK_EMPHASIS_ID = 'theme-font-link-emphasis';

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

            let emphasisLinkElement = document.getElementById(FONT_LINK_EMPHASIS_ID) as HTMLLinkElement;

            if (themeConfig.fontUrlEmphasis) {
                if (!emphasisLinkElement) {
                    emphasisLinkElement = document.createElement('link');
                    emphasisLinkElement.id = FONT_LINK_EMPHASIS_ID;
                    emphasisLinkElement.rel = 'stylesheet';
                    document.head.appendChild(emphasisLinkElement);
                }

                emphasisLinkElement.href = themeConfig.fontUrlEmphasis;
            } else {
                emphasisLinkElement?.remove();
            }
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
