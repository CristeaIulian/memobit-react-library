import { formatAppDate } from '../../helpers/Datetime';

import {
    FilterContext,
    FilterControl,
    FilterMode,
    FilterOption,
    FilterSpec,
    FilterValue,
    PageFilterValues,
    TextFilterSpec,
    TextFilterValue,
} from './PageShell.types';

/** Option-count limits that decide which widget a `single` or `multi` filter gets. */
const SEGMENTED_MAX = 4;
/** A segmented control also needs short labels: their total length, "Any" included, stays within this. */
const SEGMENTED_MAX_CHARS = 24;
const RADIO_MAX = 10;
const CHIPS_MAX = 8;
const CHECKLIST_MAX = 14;
/** A checklist past this many options shows the first ones and a "Show all" link. */
export const CHECKLIST_PREVIEW = 6;
/** Ratings up to this scale get a segmented control; larger scales get the star picker. */
export const RATING_SEGMENTED_MAX = 5;

export const isScalar = (value: unknown): value is string | number => typeof value === 'string' || typeof value === 'number';

export const toList = (value: FilterValue | undefined): Array<string | number> => (Array.isArray(value) ? value.filter(isScalar) : []);

export const toScalar = (value: FilterValue | undefined): string | number | null => (isScalar(value) && value !== '' ? value : null);

export const toNumber = (value: FilterValue | undefined): number => (typeof value === 'number' ? value : 0);

export const toRange = (value: FilterValue | undefined, min: number, max: number): [number, number] => {
    const [lo, hi] = toList(value);
    return [typeof lo === 'number' ? lo : min, typeof hi === 'number' ? hi : max];
};

/** A date-range value's two ends, '' where open. */
export const toDateRange = (value: FilterValue | undefined): [string, string] => {
    const [from, to] = toList(value);
    return [typeof from === 'string' ? from : '', typeof to === 'string' ? to : ''];
};

export const isTextFilterValue = (value: FilterValue | undefined): value is TextFilterValue =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

export const toText = (value: FilterValue | undefined): TextFilterValue => (isTextFilterValue(value) ? value : { text: '' });

export interface WordMatchLabels {
    anyWord: string;
    allWords: string;
}

/** A text filter's match choices: the standard any/all words pair (LogicalOperator values) or the spec's own. */
export const getTextModes = (spec: TextFilterSpec, labels: WordMatchLabels): FilterMode[] | undefined =>
    spec.wordMatch
        ? [
              { value: 'or', label: labels.anyWord },
              { value: 'and', label: labels.allWords },
          ]
        : spec.modes;

/** The value a filter returns to when cleared: its `defaultValue`, else its kind's empty value. */
export const defaultFilterValue = (spec: FilterSpec): FilterValue => {
    if (spec.defaultValue !== undefined) return spec.defaultValue;

    switch (spec.kind) {
        case 'multi':
            return [];
        case 'rating':
            return 0;
        case 'toggle':
            return false;
        case 'text':
            return { text: '', mode: spec.wordMatch ? 'or' : spec.modes?.[0]?.value };
        default:
            return null;
    }
};

// Lists compare as sets, so ['a', 'b'] equals ['b', 'a'].
const normalizeValue = (value: FilterValue | undefined): string => JSON.stringify(Array.isArray(value) ? [...value].map(String).sort() : (value ?? null));

export const isFilterActive = (spec: FilterSpec, value: FilterValue | undefined): boolean => {
    if (spec.defaultValue !== undefined) return normalizeValue(value) !== normalizeValue(spec.defaultValue);

    switch (spec.kind) {
        case 'single':
        case 'date':
            return toScalar(value) !== null;
        case 'multi':
            return toList(value).length > 0;
        case 'range': {
            const [lo, hi] = toRange(value, spec.min, spec.max);
            return lo > spec.min || hi < spec.max;
        }
        case 'rating':
            return toNumber(value) > 0;
        case 'toggle':
            return value === true;
        case 'text':
            return toText(value).text.trim() !== '';
        case 'date-range':
            return toDateRange(value).some(end => end !== '');
    }
};

export const countActiveFilters = (filters: FilterSpec[], values: PageFilterValues): number =>
    filters.filter(spec => isFilterActive(spec, values[spec.id])).length;

export const optionLabel = (options: FilterOption[], value: string | number): string => options.find(option => option.value === value)?.label ?? String(value);

/** Picks the widget for a `single` or `multi` filter from its option count and where it is drawn. */
export const pickControl = (spec: FilterSpec, context: FilterContext): FilterControl | null => {
    if (spec.kind !== 'single' && spec.kind !== 'multi') return null;
    if (spec.control) return spec.control;

    const count = spec.options.length;

    if (spec.kind === 'single') {
        if (count > RADIO_MAX) return 'search-list';
        const labelChars = spec.options.reduce((total, option) => total + option.label.length, 'Any'.length);
        if (count <= SEGMENTED_MAX && labelChars <= SEGMENTED_MAX_CHARS) return 'segmented';
        return context === 'sheet' ? 'chips' : 'radio';
    }

    if (count > CHECKLIST_MAX) return 'search-list';
    if (count <= CHIPS_MAX || context === 'sheet') return 'chips';
    return 'checklist';
};

export interface SummaryMessages extends WordMatchLabels {
    any: string;
    selectedCount: (count: number) => string;
    without: (label: string) => string;
    ratingAtLeast: (value: number) => string;
    dateSince: (date: string) => string;
    dateUntil: (date: string) => string;
}

/** The short text shown for an applied filter: in a collapsed section header and in the applied-filter chips. */
export const filterSummary = (spec: FilterSpec, value: FilterValue | undefined, messages: SummaryMessages): string => {
    switch (spec.kind) {
        case 'single': {
            const selected = toScalar(value);
            // "Any" only reads as applied when the filter has another default (e.g. last 30 days), so it names the filter.
            return selected === null ? `${spec.label}: ${messages.any}` : optionLabel(spec.options, selected);
        }
        case 'multi': {
            const selected = toList(value);
            if (spec.chips === 'excluded') {
                const excluded = spec.options.filter(option => !selected.includes(option.value));
                return excluded.length === 1 ? messages.without(excluded[0].label) : messages.selectedCount(selected.length);
            }
            return selected.length === 1 ? optionLabel(spec.options, selected[0]) : messages.selectedCount(selected.length);
        }
        case 'range': {
            const [lo, hi] = toRange(value, spec.min, spec.max);
            const unit = spec.unit ? ` ${spec.unit}` : '';
            if (lo > spec.min && hi < spec.max) return `${lo}–${hi}${unit}`;
            return lo > spec.min ? `≥ ${lo}${unit}` : `≤ ${hi}${unit}`;
        }
        case 'rating':
            return messages.ratingAtLeast(toNumber(value));
        case 'toggle':
            return spec.label;
        case 'text': {
            const { text, mode } = toText(value);
            const modes = getTextModes(spec, messages);
            const modeLabel = modes && mode !== modes[0]?.value ? modes.find(m => m.value === mode)?.label : undefined;
            return modeLabel ? `“${text.trim()}” · ${modeLabel}` : `“${text.trim()}”`;
        }
        case 'date': {
            const date = toScalar(value);
            if (date === null) return '';
            const formatted = formatAppDate(String(date));
            return spec.relation === 'until' ? messages.dateUntil(formatted) : messages.dateSince(formatted);
        }
        case 'date-range': {
            const [from, to] = toDateRange(value);
            if (from && to) return `${formatAppDate(from)} – ${formatAppDate(to)}`;
            if (from) return messages.dateSince(formatAppDate(from));
            return to ? messages.dateUntil(formatAppDate(to)) : '';
        }
    }
};

export interface AppliedFilter {
    key: string;
    filterId: string;
    label: string;
    /** The filter's value once this chip is removed. */
    next: FilterValue;
}

/** One chip per applied value: multi filters get one chip per selected option, the rest one chip each. */
export const getAppliedFilters = (filters: FilterSpec[], values: PageFilterValues, messages: SummaryMessages): AppliedFilter[] =>
    filters.flatMap(spec => {
        const value = values[spec.id];
        if (!isFilterActive(spec, value)) return [];

        if (spec.kind === 'multi' && spec.chips === 'excluded') {
            const selected = toList(value);
            return spec.options
                .filter(option => !selected.includes(option.value))
                .map(option => ({
                    key: `${spec.id}:${option.value}`,
                    filterId: spec.id,
                    label: messages.without(option.label),
                    next: [...selected, option.value],
                }));
        }

        if (spec.kind === 'multi') {
            const selected = toList(value);
            return selected.map(item => ({
                key: `${spec.id}:${item}`,
                filterId: spec.id,
                label: optionLabel(spec.options, item),
                next: selected.filter(other => other !== item),
            }));
        }

        const next = spec.kind === 'text' ? { ...toText(value), text: '' } : defaultFilterValue(spec);
        return [{ key: spec.id, filterId: spec.id, label: filterSummary(spec, value, messages), next }];
    });
