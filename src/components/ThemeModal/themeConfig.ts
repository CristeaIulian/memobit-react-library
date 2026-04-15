export interface ThemeConfig {
    value: string;
    label: string;
    fontUrl: string;
}

export const THEME_CONFIGS: ThemeConfig[] = [
    {
        value: 'arctic-blue',
        label: 'Arctic Blue',
        fontUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'azure-night',
        label: 'Azure Night',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'crimson-dusk',
        label: 'Crimson Dusk',
        fontUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'cyber-forest',
        label: 'Cyber Forest',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'dashdarkx',
        label: 'DashDark X',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap',
    },
    {
        value: 'ember-night',
        label: 'Ember Night',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'frost-petal',
        label: 'Frost Petal',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'lavender-mist',
        label: 'Lavender Mist',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'light-blue',
        label: 'Light Blue',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
    },
    {
        value: 'luna',
        label: 'Luna',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {
        value: 'mint-meadow',
        label: 'Mint Meadow',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'mintone',
        label: 'MinTone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {
        value: 'neon-tokyo',
        label: 'Neon Tokyo',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'ocean-breeze',
        label: 'Ocean Breeze',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300;400;600;700;800&display=swap',
    },
    {
        value: 'ocean-depths',
        label: 'Ocean Depths',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
    {
        value: 'sandstone',
        label: 'Sandstone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
    },
    {
        value: 'tailwind-vue-dark',
        label: 'Tailwind View Dark',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swa',
    },
    {
        value: 'twilight-pulse',
        label: 'Twilight Pulse',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
];

export const FAVORITE_THEMES = new Set([
    'arctic-blue',
    'crimson-dusk',
    'frost-petal',
    'lavender-mist',
    'ocean-breeze',
    'ocean-depths',
    'sandstone',
    'tailwind-vue-dark',
]);

export const getThemeConfig = (themeValue: string): ThemeConfig | undefined => {
    return THEME_CONFIGS.find(config => config.value === themeValue);
};
