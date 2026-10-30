import { createContext } from 'react';

export type Language = 'en' | 'ro';

/**
 * A set of UI texts, once per language. A messages file writes `const ro: typeof en`, so a key
 * missing from either side fails the typecheck. Text with variables is a function, which lets each
 * language place the variables and pick its own plural.
 */
export type Localized<T> = Record<Language, T>;

export interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
}

// English with no provider, so an app that never adopts the switch keeps its text unchanged.
export const LanguageContext = createContext<LanguageContextValue>({ language: 'en', setLanguage: () => undefined });
