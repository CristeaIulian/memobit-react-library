import { useCallback, useState } from 'react';

import { AppPersistenceStorage } from '../helpers/AppPersistenceStorage';

export interface AppPersistenceDefaults<TPages, TTheme> {
    pages?: TPages;
    theme: TTheme;
}

export interface UseAppPersistenceReturn<TPages, TTheme> {
    pages: TPages;
    theme: TTheme;
    setPage: <K extends keyof TPages>(key: K, value: TPages[K]) => void;
    setTheme: (theme: TTheme) => void;
    clearPage: <K extends keyof TPages>(key: K) => void;
    clearAll: () => void;
}

export function useAppPersistence<TPages, TTheme>(
    appId: string,
    defaults: AppPersistenceDefaults<TPages, TTheme>
): UseAppPersistenceReturn<TPages, TTheme> {
    const resolvedDefaults = {
        pages: (defaults.pages ?? ({} as TPages)),
        theme: defaults.theme,
    };

    const [state, setState] = useState(() => AppPersistenceStorage.load(appId, resolvedDefaults));

    const setPage = useCallback(
        <K extends keyof TPages>(key: K, value: TPages[K]) => {
            setState(prev => {
                const next = { ...prev, pages: { ...prev.pages, [key]: value } };
                AppPersistenceStorage.save(appId, next);
                return next;
            });
        },
        [appId]
    );

    const setTheme = useCallback(
        (theme: TTheme) => {
            setState(prev => {
                const next = { ...prev, theme };
                AppPersistenceStorage.save(appId, next);
                return next;
            });
        },
        [appId]
    );

    const clearPage = useCallback(
        <K extends keyof TPages>(key: K) => {
            setState(prev => {
                const next = { ...prev, pages: { ...prev.pages, [key]: resolvedDefaults.pages[key] } };
                AppPersistenceStorage.save(appId, next);
                return next;
            });
        },
        [appId]
    );

    const clearAll = useCallback(() => {
        setState(resolvedDefaults);
        AppPersistenceStorage.clearAll(appId);
    }, [appId]);

    return {
        pages: state.pages,
        theme: state.theme,
        setPage,
        setTheme,
        clearPage,
        clearAll,
    };
}
