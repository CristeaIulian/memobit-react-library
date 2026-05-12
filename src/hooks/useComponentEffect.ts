import { useTheme } from '../components/ThemeSettings/useTheme';

export const useComponentEffect = (componentName: string): string => {
    const { effects } = useTheme();
    if (effects.effect && effects.components.includes(componentName)) {
        return effects.effect;
    }
    return '';
};
