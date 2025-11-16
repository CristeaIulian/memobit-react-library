export interface ThemeConfig {
    value: string;
    label: string;
    fontUrl: string;
}

export const THEME_CONFIGS: ThemeConfig[] = [
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
        value: 'mintone',
        label: 'MinTone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
    },
    {
        value: 'dashdarkx',
        label: 'DashDark X',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap',
    },
    {
        value: 'tailwind-vue-dark',
        label: 'Tailwind View Dark',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swa',
    },
    {
        value: 'azure-night',
        label: 'Azure Night',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
];

export const getThemeConfig = (themeValue: string): ThemeConfig | undefined => {
    return THEME_CONFIGS.find(config => config.value === themeValue);
};
