import { createContext } from 'react';

import type { ThemeName } from '@memobit/themes';

// Every theme @memobit/themes ships, so naming one that does not exist fails the build.
export type Theme = ThemeName;

/**
 * Shown when a theme is unknown and the app passes no `fallbackTheme` of its own. Apps should
 * pass their default theme, so a saved theme that was since removed falls back to theirs.
 */
export const DEFAULT_FALLBACK_THEME: Theme = 'sandy-parchment';

export interface ThemeEffects {
    effect: string;
    components: string[];
}

export interface ThemeSaveValue {
    theme: Theme;
    effects: ThemeEffects;
}

export interface ThemeContextType {
    theme: Theme;
    effects: ThemeEffects;
    setPreviewTheme: (theme: Theme) => void;
    setPreviewEffects: (effects: ThemeEffects) => void;
    commitPreview: () => void;
    clearPreview: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
