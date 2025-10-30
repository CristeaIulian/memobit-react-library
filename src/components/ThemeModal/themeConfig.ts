export interface ThemeConfig {
    value: string;
    label: string;
    fontUrl: string;
    fontFamily: string;
}

export const THEME_CONFIGS: ThemeConfig[] = [
    {
        value: 'light-blue',
        label: 'Light Blue',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
        fontFamily: "'Open Sans', sans-serif",
    },
    {
        value: 'luna',
        label: 'Luna',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap',
        fontFamily: "'Roboto', sans-serif",
    },
    {
        value: 'mintone',
        label: 'MinTone',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap',
        fontFamily: "'Work Sans', sans-serif",
    },
    {
        value: 'argon-dark',
        label: 'Argon Dashboard Dark',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
        fontFamily: "'Open Sans', sans-serif",
    },
    {
        value: 'argon-light',
        label: 'Argon Dashboard Light',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap',
        fontFamily: "'Open Sans', sans-serif",
    },
    {
        value: 'crmi',
        label: 'CRMi',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
        fontFamily: "'Poppins', sans-serif",
    },
    {
        value: 'dashdarkx',
        label: 'DashDark X',
        fontUrl: '"https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap',
        fontFamily: "'Mona sans', sans-serif",
    },
    {
        value: 'tailwind-vue-dark',
        label: 'Tailwind View Dark',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swa',
        fontFamily: "'Noto Sans', sans-serif",
    },
    {
        value: 'tailwind-vue-light',
        label: 'Tailwind View Light',
        fontUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swa',
        fontFamily: "'Noto Sans', sans-serif",
    },
];

export const getThemeConfig = (themeValue: string): ThemeConfig | undefined => {
    return THEME_CONFIGS.find(config => config.value === themeValue);
};
