import { useEffect, useState } from 'react';

interface EffectsConfig {
    effect: string;
    components: string[];
}

const EFFECTS_STORAGE_KEY = 'effects';

export const useComponentEffect = (componentName: string): string => {
    const [effectClass, setEffectClass] = useState<string>('');

    useEffect(() => {
        const loadEffect = () => {
            try {
                const stored = localStorage.getItem(EFFECTS_STORAGE_KEY);
                if (stored) {
                    const config: EffectsConfig = JSON.parse(stored);
                    if (config.effect && config.components.includes(componentName)) {
                        setEffectClass(config.effect);
                    } else {
                        setEffectClass('');
                    }
                }
            } catch (error) {
                console.warn('Failed to load component effects:', error);
                setEffectClass('');
            }
        };

        loadEffect();

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === EFFECTS_STORAGE_KEY) {
                loadEffect();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [componentName]);

    return effectClass;
};
