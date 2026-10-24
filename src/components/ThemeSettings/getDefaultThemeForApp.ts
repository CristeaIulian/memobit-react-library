import { THEME_CONFIGS } from './themeConfig';
import { type Theme } from './ThemeContextValue';

/**
 * The theme an app shows before the user has picked one: the first theme in the picker's
 * order that is recommended for this app, or the fallback when none is. Match `app` to the
 * name the app passes to the picker as `currentApp`, so the default and the "For <app>"
 * filter agree.
 */
export const getDefaultThemeForApp = (app: string, fallback: Theme = 'luna'): Theme => {
    const appKey = app.trim().toLowerCase();
    const recommended = THEME_CONFIGS.find(config => (config.recommendedApps ?? []).some(name => name.toLowerCase() === appKey));

    return recommended ? (recommended.value as Theme) : fallback;
};
