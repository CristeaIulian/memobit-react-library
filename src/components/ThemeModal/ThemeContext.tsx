import React, { createContext, FC, ReactNode, useEffect, useState } from 'react';

export type Theme = 'light-blue' | 'luna' | 'mintone' | 'argon-dark' | 'argon-light' | 'crmi' | 'dashdarkx' | 'tailwind-vue-dark' | 'tailwind-vue-light';

export interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app-theme';
const DEFAULT_THEME: Theme = 'luna';

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
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
