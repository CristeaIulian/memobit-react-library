import { useContext, useMemo } from 'react';

import type { MenuHamburgerItem } from '../components/MenuHamburger';
import { LanguageContext, type LanguageContextValue, type Localized } from '../contexts/LanguageContext';

export const useLanguage = (): LanguageContextValue => useContext(LanguageContext);

export const useMessages = <T>(messages: Localized<T>): T => messages[useLanguage().language];

// The switch itself, as a Toolbar menu item. It is named in the language it switches to, so it stays
// readable from either side.
export const useLanguageMenuItem = (): MenuHamburgerItem => {
    const { language, setLanguage } = useLanguage();
    return useMemo(
        () => ({
            label: language === 'en' ? 'Română' : 'English',
            icon: 'language',
            isActive: false,
            onClick: () => setLanguage(language === 'en' ? 'ro' : 'en'),
        }),
        [language, setLanguage]
    );
};
