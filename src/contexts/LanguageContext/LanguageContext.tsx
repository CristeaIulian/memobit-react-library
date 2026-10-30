import { type ReactNode, useEffect, useMemo } from 'react';

import { type Language, LanguageContext } from './LanguageContext.context';

interface LanguageProviderProps {
    children: ReactNode;
    language: Language;
    // The app owns the value and where it is persisted (e.g. useAppPersistence).
    onLanguageChange: (language: Language) => void;
}

export function LanguageProvider({ children, language, onLanguageChange }: LanguageProviderProps) {
    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    const value = useMemo(() => ({ language, setLanguage: onLanguageChange }), [language, onLanguageChange]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
