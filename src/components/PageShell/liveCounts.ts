import { FilterSpec, FilterValue, PageFilterValues } from './PageShell.types';

/**
 * Whether an item passes one filter at the given value. It must also answer for values the user hasn't picked:
 * a one-option value while counting, and the filter's empty value (null, [], 0, false), which lets every item through.
 */
export type FilterPredicate<T> = (item: T, value: FilterValue | undefined) => boolean;

export type FilterPredicates<T> = Record<string, FilterPredicate<T>>;

/**
 * The filters with each option counting the items it would leave, given every other applied filter. Counts follow
 * the user's other choices, so an option that leads to an empty list shows 0 (and is drawn dimmed) before it is
 * picked. Only `single` and `multi` filters with a predicate are recounted; pass items already narrowed by the search.
 */
export const applyLiveCounts = <T>(filters: FilterSpec[], items: T[], values: PageFilterValues, predicates: FilterPredicates<T>): FilterSpec[] => {
    const ids = Object.keys(predicates);
    // Which filters each item passes at their current values, computed once.
    const passes = items.map(item => new Set(ids.filter(id => predicates[id](item, values[id]))));
    const passesOthers = (index: number, except: string) => ids.every(id => id === except || passes[index].has(id));

    return filters.map(spec => {
        const predicate = predicates[spec.id];
        if (!predicate || (spec.kind !== 'single' && spec.kind !== 'multi')) return spec;

        const pool = items.filter((_, index) => passesOthers(index, spec.id));
        const options = spec.options.map(option => {
            const value: FilterValue = spec.kind === 'multi' ? [option.value] : option.value;
            return { ...option, count: pool.filter(item => predicate(item, value)).length };
        });

        return { ...spec, options };
    });
};
