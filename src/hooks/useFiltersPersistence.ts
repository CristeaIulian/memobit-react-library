import { useCallback, useState } from 'react';

import { FiltersStorage } from '../helpers/FiltersStorage';

interface UseFiltersPersistenceReturn<TFilters, TSorting> {
    filters: TFilters;
    sorting: TSorting;
    setFilters: (filters: TFilters) => void;
    setSorting: (sorting: TSorting) => void;
    clearAll: () => void;
}

export function useFiltersPersistence<TFilters, TSorting>(
    appType: string,
    defaultFilters: TFilters,
    defaultSorting: TSorting
): UseFiltersPersistenceReturn<TFilters, TSorting> {
    const [filters, setFiltersState] = useState<TFilters>(() => FiltersStorage.loadFilters(appType, defaultFilters, defaultSorting));

    const [sorting, setSortingState] = useState<TSorting>(() => FiltersStorage.loadSorting(appType, defaultFilters, defaultSorting));

    const setFilters = useCallback(
        (newFilters: TFilters) => {
            setFiltersState(newFilters);
            FiltersStorage.saveFilters(appType, newFilters, sorting);
        },
        [appType, sorting]
    );

    const setSorting = useCallback(
        (newSorting: TSorting) => {
            setSortingState(newSorting);
            FiltersStorage.saveSorting(appType, newSorting, filters);
        },
        [appType, filters]
    );

    const clearAll = useCallback(() => {
        setFiltersState(defaultFilters);
        setSortingState(defaultSorting);
        FiltersStorage.clearAll(appType);
    }, [appType, defaultFilters, defaultSorting]);

    return {
        filters,
        sorting,
        setFilters,
        setSorting,
        clearAll,
    };
}
