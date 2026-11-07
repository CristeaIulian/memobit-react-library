import { useEffect, useMemo, useRef } from 'react';

import { getStaleFilterChanges, StaleFilterChange } from './filterValues';
import { FilterSpec, PageFilterValues } from './PageShell.types';

interface UsePruneStaleFiltersOptions {
    /** False until the data the options come from has loaded: an empty list then would wipe valid saved filters. */
    isLoaded: boolean;
    /** Applies all the fixes at once (one state update, so none overwrites another). */
    onPrune: (changes: StaleFilterChange[]) => void;
}

/** Drops saved filter values whose options are gone, once the data has loaded and whenever the options change. */
export const usePruneStaleFilters = (filters: FilterSpec[], values: PageFilterValues, { isLoaded, onPrune }: UsePruneStaleFiltersOptions): void => {
    const onPruneRef = useRef(onPrune);
    const changes = useMemo(() => (isLoaded ? getStaleFilterChanges(filters, values) : []), [filters, values, isLoaded]);

    useEffect(() => {
        onPruneRef.current = onPrune;
    }, [onPrune]);

    useEffect(() => {
        if (changes.length > 0) onPruneRef.current(changes);
    }, [changes]);
};
