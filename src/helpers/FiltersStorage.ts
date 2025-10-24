interface AppData<TFilters, TSorting> {
    filters: TFilters;
    sorting: TSorting;
}

export class FiltersStorage {
    private static getData<T, TFilters, TSorting>(appType: T, defaultFilters: TFilters, defaultSorting: TSorting): AppData<TFilters, TSorting> {
        try {
            const stored = localStorage.getItem(appType as string);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    filters: { ...defaultFilters, ...parsed.filters },
                    sorting: { ...defaultSorting, ...parsed.sorting },
                };
            }
        } catch (error) {
            console.warn(`Failed to load data for ${appType}:`, error);
        }
        return { filters: defaultFilters, sorting: defaultSorting };
    }

    private static saveData<T, TFilters, TSorting>(appType: T, data: AppData<TFilters, TSorting>): void {
        try {
            localStorage.setItem(appType as string, JSON.stringify(data));
        } catch (error) {
            console.warn(`Failed to save data for ${appType}:`, error);
        }
    }

    static loadFilters<T, TFilters, TSorting>(appType: T, defaultFilters: TFilters, defaultSorting: TSorting): TFilters {
        return this.getData(appType, defaultFilters, defaultSorting).filters;
    }

    static loadSorting<T, TFilters, TSorting>(appType: T, defaultFilters: TFilters, defaultSorting: TSorting): TSorting {
        return this.getData(appType, defaultFilters, defaultSorting).sorting;
    }

    static saveFilters<T, TFilters, TSorting>(appType: T, filters: TFilters, currentSorting: TSorting): void {
        this.saveData(appType, { filters, sorting: currentSorting });
    }

    static saveSorting<T, TFilters, TSorting>(appType: T, sorting: TSorting, currentFilters: TFilters): void {
        this.saveData(appType, { filters: currentFilters, sorting });
    }

    static clearAll<T>(appType: T): void {
        try {
            localStorage.removeItem(appType as string);
        } catch (error) {
            console.warn(`Failed to clear data for ${appType}:`, error);
        }
    }
}
