import { ControlPanelFilterOption } from '../components/ControlPanel/ControlPanel.types';

/**
 * Filter value that matches items with no value for a lookup field, or whose value points at a
 * lookup that no longer exists. Negative so it never collides with a database id and stays truthy.
 */
export const UNALLOCATED_FILTER_ID = -1;
/** The `UNALLOCATED_FILTER_ID` counterpart for filters on text values (enums, colors, string ids). */
export const UNALLOCATED_FILTER_KEY = '__unallocated__';
export const UNALLOCATED_FILTER_LABEL = 'Unallocated';

type FilterValue = number | string;

export interface FilterLookup {
    id: number;
    name: string;
}

export interface FilterKeyLookup {
    id: string;
    name: string;
}

/** Reads an item's lookup id(s): a single id for one-to-one fields, an array for many-to-many (tags). */
export type FilterIdGetter<T> = (item: T) => number | number[] | null | undefined;
/** Reads an item's text value(s). An empty string counts as no value. */
export type FilterKeyGetter<T> = (item: T) => string | string[] | null | undefined;

const toValues = <V extends FilterValue>(value: V | V[] | null | undefined): V[] =>
    (Array.isArray(value) ? value : value == null ? [] : [value]).filter(v => v !== '');

/** The item's values that still exist in the lookup list. Empty means the item is unallocated. */
const getKnownValues = <V extends FilterValue>(value: V | V[] | null | undefined, known: Set<V> | undefined): V[] =>
    toValues(value).filter(v => !known || known.has(v));

const buildOptions = <T, V extends FilterValue>(
    items: T[],
    lookups: { id: V; name: string }[],
    getValue: (item: T) => V | V[] | null | undefined,
    unallocatedValue: V,
    unallocatedLabel: string
): ControlPanelFilterOption[] => {
    const known = new Set(lookups.map(lookup => lookup.id));
    const counts = new Map<V, number>();
    let unallocatedCount = 0;

    items.forEach(item => {
        const values = getKnownValues(getValue(item), known);
        if (values.length === 0) unallocatedCount++;
        values.forEach(value => counts.set(value, (counts.get(value) ?? 0) + 1));
    });

    const options: ControlPanelFilterOption[] = lookups
        .filter(lookup => counts.has(lookup.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(lookup => ({ value: lookup.id, label: lookup.name, count: counts.get(lookup.id) }));

    if (unallocatedCount > 0) {
        options.push({ value: unallocatedValue, label: unallocatedLabel, count: unallocatedCount });
    }

    return options;
};

const matches = <V extends FilterValue>(
    filterValue: V | V[] | null | undefined,
    itemValue: V | V[] | null | undefined,
    known: Set<V> | undefined,
    unallocatedValue: V
): boolean => {
    const allowed = toValues(filterValue);
    if (allowed.length === 0) return true;

    const values = getKnownValues(itemValue, known);
    if (values.length === 0) return allowed.includes(unallocatedValue);

    return values.some(value => allowed.includes(value));
};

const getMatchable = <T, V extends FilterValue>(
    items: T[],
    known: Set<V> | undefined,
    getValue: (item: T) => V | V[] | null | undefined,
    unallocatedValue: V
): Set<V> => {
    const matchable = new Set<V>();

    items.forEach(item => {
        const values = getKnownValues(getValue(item), known);
        if (values.length === 0) matchable.add(unallocatedValue);
        values.forEach(value => matchable.add(value));
    });

    return matchable;
};

/**
 * Chip/dropdown options for one lookup filter: every lookup at least one item uses (alphabetical,
 * with item counts), then an "Unallocated" option when some items have no existing lookup.
 * Without it those items could only be found by clearing every filter. Pass `unallocatedLabel`
 * when the domain has a better word for it (e.g. "Uncategorized", "No tags").
 */
export const getFilterOptions = <T>(
    items: T[],
    lookups: FilterLookup[],
    getId: FilterIdGetter<T>,
    unallocatedLabel: string = UNALLOCATED_FILTER_LABEL
): ControlPanelFilterOption[] => buildOptions(items, lookups, getId, UNALLOCATED_FILTER_ID, unallocatedLabel);

/**
 * Whether an item passes a lookup filter. An empty or missing filter passes everything;
 * `UNALLOCATED_FILTER_ID` in the filter matches items with no existing lookup.
 */
export const matchesIdFilter = (
    filterValue: number | number[] | null | undefined,
    itemValue: number | number[] | null | undefined,
    knownIds: Set<number>
): boolean => matches(filterValue, itemValue, knownIds, UNALLOCATED_FILTER_ID);

/**
 * Filter values the items can currently match: the lookup ids they use, plus
 * `UNALLOCATED_FILTER_ID` when any item is unallocated. Use it to prune persisted filters.
 */
export const getMatchableFilterIds = <T>(items: T[], knownIds: Set<number>, getId: FilterIdGetter<T>): Set<number> =>
    getMatchable(items, knownIds, getId, UNALLOCATED_FILTER_ID);

/**
 * `getFilterOptions` for filters on text values (enums, colors, string ids). `lookups` lists the
 * values the filter offers with their labels; items with no value, or a value not in `lookups`,
 * fall under the `UNALLOCATED_FILTER_KEY` option.
 */
export const getKeyFilterOptions = <T>(
    items: T[],
    lookups: FilterKeyLookup[],
    getKey: FilterKeyGetter<T>,
    unallocatedLabel: string = UNALLOCATED_FILTER_LABEL
): ControlPanelFilterOption[] => buildOptions(items, lookups, getKey, UNALLOCATED_FILTER_KEY, unallocatedLabel);

/**
 * `matchesIdFilter` for text values. Without `knownKeys` every non-empty value counts as allocated,
 * which suits free values such as colors or tags; pass it when values come from a fixed or
 * deletable list so stale values count as unallocated.
 */
export const matchesKeyFilter = (
    filterValue: string | string[] | null | undefined,
    itemValue: string | string[] | null | undefined,
    knownKeys?: Set<string>
): boolean => matches(filterValue, itemValue, knownKeys, UNALLOCATED_FILTER_KEY);

/** `getMatchableFilterIds` for text values; `knownKeys` as in `matchesKeyFilter`. */
export const getMatchableFilterKeys = <T>(items: T[], knownKeys: Set<string> | undefined, getKey: FilterKeyGetter<T>): Set<string> =>
    getMatchable(items, knownKeys, getKey, UNALLOCATED_FILTER_KEY);
