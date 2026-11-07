import { FC, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { Chip } from '../Chip';
import { Icon } from '../Icon';

import { FilterField } from './FilterField';
import { filterSummary, getAppliedFilters, isFilterActive } from './filterRules';
import { FilterContext, FilterSpec, FilterValue, PageFilterValues } from './PageShell.types';
import { useSummaryMessages } from './useSummaryMessages';

interface FilterSectionsProps {
    filters: FilterSpec[];
    values: PageFilterValues;
    context: FilterContext;
    onFilterChange: (id: string, value: FilterValue) => void;
}

/** Without pinned filters, this many sections start open. */
const DEFAULT_OPEN_COUNT = 3;

const getInitiallyOpen = (filters: FilterSpec[], values: PageFilterValues): Set<string> => {
    const sections = filters.filter(spec => spec.kind !== 'toggle');
    const pinned = sections.filter(spec => spec.priority === 'pinned');
    const open = pinned.length > 0 ? pinned : sections.slice(0, DEFAULT_OPEN_COUNT);
    // A filter that already holds a value starts open too, so nothing applied is hidden on arrival.
    const applied = sections.filter(spec => isFilterActive(spec, values[spec.id]));
    return new Set([...open, ...applied].map(spec => spec.id));
};

/** Every filter as a collapsible section. A closed section previews its value; toggles sit as plain switch rows. */
export const FilterSections: FC<FilterSectionsProps> = ({ filters, values, context, onFilterChange }) => {
    const summaryMessages = useSummaryMessages();
    const [open, setOpen] = useState(() => getInitiallyOpen(filters, values));

    const toggle = (id: string) =>
        setOpen(previous => {
            const next = new Set(previous);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });

    return (
        <div className={`page-filters page-filters--${context}`}>
            {filters.map(spec => {
                const value = values[spec.id];
                const field = <FilterField spec={spec} value={value} context={context} onChange={next => onFilterChange(spec.id, next)} />;

                if (spec.kind === 'toggle') {
                    return (
                        <div key={spec.id} className="page-filters__flat">
                            {field}
                        </div>
                    );
                }

                const isOpen = open.has(spec.id);
                const isActive = isFilterActive(spec, value);

                return (
                    <div key={spec.id} className="page-filters__section">
                        <button type="button" className="page-filters__header" onClick={() => toggle(spec.id)}>
                            <span className="page-filters__label">{spec.label}</span>
                            {!isOpen && isActive ? (
                                <span className="page-filters__summary">{filterSummary(spec, value, summaryMessages)}</span>
                            ) : (
                                <span className="page-filters__spacer" />
                            )}
                            {isOpen && isActive && <span className="page-filters__dot" />}
                            <Icon name={isOpen ? 'caret-down' : 'caret-right'} size="sm" />
                        </button>
                        {isOpen && <div className="page-filters__body">{field}</div>}
                    </div>
                );
            })}
        </div>
    );
};

interface AppliedFiltersProps {
    filters: FilterSpec[];
    values: PageFilterValues;
    onFilterChange: (id: string, value: FilterValue) => void;
    onClearFilters?: () => void;
    /** One line that scrolls sideways (phone) instead of wrapping. */
    scroll?: boolean;
}

/** The applied filters as removable chips, with Clear all at the end. Renders nothing while no filter is applied. */
export const AppliedFilters: FC<AppliedFiltersProps> = ({ filters, values, onFilterChange, onClearFilters, scroll = false }) => {
    const t = useMessages(libMessages);
    const summaryMessages = useSummaryMessages();
    const applied = getAppliedFilters(filters, values, summaryMessages);

    if (applied.length === 0) return null;

    return (
        <div className={['page-applied', scroll ? 'page-applied--scroll' : ''].filter(Boolean).join(' ')}>
            {applied.map(item => (
                <Chip key={item.key} selected size="small" onClick={() => onFilterChange(item.filterId, item.next)}>
                    <span className="page-applied__label">{item.label}</span>
                    <Icon name="clear" size="sm" />
                </Chip>
            ))}
            {onClearFilters && (
                <button type="button" className="page-shell__link" onClick={onClearFilters}>
                    {t.pageClearAll}
                </button>
            )}
        </div>
    );
};
