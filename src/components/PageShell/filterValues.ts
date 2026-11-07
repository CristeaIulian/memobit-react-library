import { isTextFilterValue, toList, toScalar } from './filterRules';
import { FilterSpec, FilterValue, PageFilterValues, TextFilterValue } from './PageShell.types';

/**
 * Readers that turn a filter value from PageShell back into the app's own types, keeping only what the app allows.
 * They replace the per-app guards each page would otherwise write for every enum filter.
 */

/** A multi filter's selected keys, limited to `allowed`. */
export const asFilterKeys = <K extends string | number>(value: FilterValue | undefined, allowed: readonly K[]): K[] =>
    toList(value).flatMap(item => {
        const match = allowed.find(key => key === item);
        return match === undefined ? [] : [match];
    });

/** A single filter's selected key, if it is one of `allowed`. */
export const asFilterKey = <K extends string | number>(value: FilterValue | undefined, allowed: readonly K[]): K | undefined =>
    allowed.find(key => key === value);

/** A range filter's [min, max], or null when the range is off. */
export const asFilterRange = (value: FilterValue | undefined): [number, number] | null => {
    const [lo, hi] = toList(value);
    return typeof lo === 'number' && typeof hi === 'number' ? [lo, hi] : null;
};

/** A text filter's text and match mode, or null for any other value. */
export const asFilterText = (value: FilterValue | undefined): TextFilterValue | null => (isTextFilterValue(value) ? value : null);

export interface StaleFilterChange {
    id: string;
    value: FilterValue;
}

/**
 * The fixes that bring saved option filters in line with their current options: selected values that no option
 * offers anymore (a deleted lookup, a value no item carries) are dropped. Pass filter specs built from loaded data.
 */
export const getStaleFilterChanges = (filters: FilterSpec[], values: PageFilterValues): StaleFilterChange[] =>
    filters.flatMap((spec): StaleFilterChange[] => {
        if (spec.kind !== 'single' && spec.kind !== 'multi') return [];

        const known = new Set(spec.options.map(option => option.value));
        const value = values[spec.id];

        if (spec.kind === 'single') {
            const selected = toScalar(value);
            return selected !== null && !known.has(selected) ? [{ id: spec.id, value: null }] : [];
        }

        const selected = toList(value);
        const kept = selected.filter(item => known.has(item));
        return kept.length === selected.length ? [] : [{ id: spec.id, value: kept }];
    });
