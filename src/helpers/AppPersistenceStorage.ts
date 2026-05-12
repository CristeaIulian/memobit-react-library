interface AppData<TPages, TTheme> {
    pages: TPages;
    theme: TTheme;
}

export class AppPersistenceStorage {
    private static getData<TPages, TTheme>(appId: string, defaults: AppData<TPages, TTheme>): AppData<TPages, TTheme> {
        try {
            const stored = localStorage.getItem(appId);
            if (stored) {
                const parsed = JSON.parse(stored);
                const mergedPages = { ...defaults.pages } as TPages;
                if (parsed.pages && typeof parsed.pages === 'object') {
                    for (const key of Object.keys(parsed.pages)) {
                        const defaultPage = (defaults.pages as Record<string, unknown>)[key];
                        const storedPage = parsed.pages[key];
                        if (defaultPage && typeof defaultPage === 'object') {
                            (mergedPages as Record<string, unknown>)[key] = { ...defaultPage, ...storedPage };
                        } else {
                            (mergedPages as Record<string, unknown>)[key] = storedPage;
                        }
                    }
                }
                return {
                    pages: mergedPages,
                    theme: { ...defaults.theme, ...parsed.theme },
                };
            }
        } catch (error) {
            console.warn(`Failed to load app persistence data for ${appId}:`, error);
        }
        return defaults;
    }

    private static saveData<TPages, TTheme>(appId: string, data: AppData<TPages, TTheme>): void {
        try {
            localStorage.setItem(appId, JSON.stringify(data));
        } catch (error) {
            console.warn(`Failed to save app persistence data for ${appId}:`, error);
        }
    }

    static load<TPages, TTheme>(appId: string, defaults: AppData<TPages, TTheme>): AppData<TPages, TTheme> {
        return this.getData(appId, defaults);
    }

    static save<TPages, TTheme>(appId: string, data: AppData<TPages, TTheme>): void {
        this.saveData(appId, data);
    }

    static clearAll(appId: string): void {
        try {
            localStorage.removeItem(appId);
        } catch (error) {
            console.warn(`Failed to clear app persistence data for ${appId}:`, error);
        }
    }
}
