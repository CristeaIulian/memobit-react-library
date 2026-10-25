import { ControlPanelFilterOption } from '../components/ControlPanel/ControlPanel.types';

/**
 * Filter value that matches items with no value for a lookup field, or whose value points at a
 * lookup that no longer exists. Negative so it never collides with a database id and stays truthy.
 */
export const UNALLOCATED_FILTER_ID = -1;
export const UNALLOCATED_FILTER_LABEL = 'Unallocated';

export interface FilterLookup {
    id: number;
    name: string;
}

/** Reads an item's lookup id(s): a single id for one-to-one fields, an array for many-to-many (tags). */
export type FilterIdGetter<T> = (item: T) => number | number[] | null | undefined;

const toIds = (value: number | number[] | null | undefined): number[] => (Array.isArray(value) ? value : value == null ? [] : [value]);

/** The item's ids that still exist in the lookup list. Empty means the item is unallocated. */
const getKnownIds = (value: number | number[] | null | undefined, knownIds: Set<number>): number[] => toIds(value).filter(id => knownIds.has(id));

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
): ControlPanelFilterOption[] => {
    const knownIds = new Set(lookups.map(lookup => lookup.id));
    const counts = new Map<number, number>();
    let unallocatedCount = 0;

    items.forEach(item => {
        const ids = getKnownIds(getId(item), knownIds);
        if (ids.length === 0) unallocatedCount++;
        ids.forEach(id => counts.set(id, (counts.get(id) ?? 0) + 1));
    });

    const options: ControlPanelFilterOption[] = lookups
        .filter(lookup => counts.has(lookup.id))
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(lookup => ({ value: lookup.id, label: lookup.name, count: counts.get(lookup.id) }));

    if (unallocatedCount > 0) {
        options.push({ value: UNALLOCATED_FILTER_ID, label: unallocatedLabel, count: unallocatedCount });
    }

    return options;
};

/**
 * Whether an item passes a lookup filter. An empty or missing filter passes everything;
 * `UNALLOCATED_FILTER_ID` in the filter matches items with no existing lookup.
 */
export const matchesIdFilter = (
    filterValue: number | number[] | null | undefined,
    itemValue: number | number[] | null | undefined,
    knownIds: Set<number>
): boolean => {
    const allowed = toIds(filterValue);
    if (allowed.length === 0) return true;

    const ids = getKnownIds(itemValue, knownIds);
    if (ids.length === 0) return allowed.includes(UNALLOCATED_FILTER_ID);

    return ids.some(id => allowed.includes(id));
};

/**
 * Filter values the items can currently match: the lookup ids they use, plus
 * `UNALLOCATED_FILTER_ID` when any item is unallocated. Use it to prune persisted filters.
 */
export const getMatchableFilterIds = <T>(items: T[], knownIds: Set<number>, getId: FilterIdGetter<T>): Set<number> => {
    const matchable = new Set<number>();

    items.forEach(item => {
        const ids = getKnownIds(getId(item), knownIds);
        if (ids.length === 0) matchable.add(UNALLOCATED_FILTER_ID);
        ids.forEach(id => matchable.add(id));
    });

    return matchable;
};
