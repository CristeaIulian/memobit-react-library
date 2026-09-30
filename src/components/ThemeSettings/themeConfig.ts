// The theme registry moved to @memobit/themes when the stylesheets were split out, so a
// theme can be added without releasing this library. Re-exported here because the
// ThemeSettings internals were already written against this path.
export {
    FAVORITE_THEMES,
    getThemeAppearance,
    getThemeConfig,
    LIGHT_THEMES,
    THEME_CONFIGS,
    type ThemeAppearance,
    type ThemeConfig,
} from '@memobit/themes';
