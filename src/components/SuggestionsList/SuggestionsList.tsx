import { useCallback, useMemo, useState } from 'react';

import { format2Digits } from '../../helpers/Numbers';
import { Button } from '../Button';
import { InputSearch } from '../InputSearch';

import './SuggestionsList.scss';
import { Tooltip } from '../Tooltip';
import { Icon } from '../Icon';

type SortDirection = 'asc' | 'desc';

interface SortIconProps {
    state: 'unsorted' | 'asc' | 'desc';
}

function SortIcon({ state }: SortIconProps) {
    return (
        <span className={`suggestions-list__sort-icon suggestions-list__sort-icon--${state}`} aria-hidden="true">
            <Icon name={state === 'asc' ? 'arrow-up' : state === 'desc' ? 'arrow-down' : 'arrow-bidirectional-vertical'} />
        </span>
    );
}

export interface SuggestionsListElement {
    name: string;
    value: number | string;
    unit: string;
}

interface SuggestionsListProps {
    data: SuggestionsListElement[];
    label?: string;
    title?: string;
    tooltip?: string;
    enableSearch?: boolean;
    onRowClick?: (item: SuggestionsListElement) => void;
}

const capLimit = 10;

export const SuggestionsList = ({ data, label, title, tooltip, enableSearch = false, onRowClick }: SuggestionsListProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isShowMoreEnabled, setShowMoreEnabled] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [sortKey, setSortKey] = useState<'name' | 'value' | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return data;
        return data.filter(item => item.name.toLowerCase().includes(searchValue.toLowerCase()));
    }, [data, searchValue]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            const aValue = sortKey === 'name' ? a.name : a.value;
            const bValue = sortKey === 'name' ? b.name : b.value;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }
            return String(aValue).localeCompare(String(bValue));
        });

        return sortDirection === 'asc' ? sorted : sorted.reverse();
    }, [filteredData, sortKey, sortDirection]);

    const slicedData = useMemo(() => (isShowMoreEnabled ? [...sortedData] : sortedData.slice(0, capLimit)), [sortedData, isShowMoreEnabled]);
    const moreThanCapLimit = sortedData.length > capLimit;

    const toggleList = () => {
        setIsVisible(!isVisible);
    };

    const toggleShowMore = useCallback(() => {
        setShowMoreEnabled(!isShowMoreEnabled);
    }, [isShowMoreEnabled]);

    const toggleSort = (column: 'name' | 'value') => {
        if (sortKey === column) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column);
            setSortDirection('asc');
        }
    };

    const suggestionListContent = useMemo(
        () => (
            <div className="list-suggestions-list">
                <Tooltip title={tooltip}>
                    <legend>{title || 'Suggestions'}</legend>
                </Tooltip>
                {enableSearch && (
                    <div className="list-suggestions-list-search">
                        <InputSearch value={searchValue} onChange={setSearchValue} placeholder="Search suggestions..." />
                    </div>
                )}
                <div className="list-suggestions-list-rows">
                    <div className="list-suggestions-list-header">
                        <button
                            type="button"
                            className="list-suggestions-list-header-cell list-suggestions-list-header-cell--name"
                            onClick={() => toggleSort('name')}
                        >
                            Name
                            <SortIcon state={sortKey === 'name' ? sortDirection : 'unsorted'} />
                        </button>
                        <button
                            type="button"
                            className="list-suggestions-list-header-cell list-suggestions-list-header-cell--value"
                            onClick={() => toggleSort('value')}
                        >
                            Value
                            <SortIcon state={sortKey === 'value' ? sortDirection : 'unsorted'} />
                        </button>
                    </div>
                    {slicedData.map((el, index) => {
                        return (
                            <div
                                className={`list-suggestions-list-row ${onRowClick ? 'list-suggestions-list-row--clickable' : ''}`}
                                key={`list-suggestions-list-row-${index}`}
                                onClick={() => onRowClick?.(el)}
                                role={onRowClick ? 'button' : undefined}
                                tabIndex={onRowClick ? 0 : undefined}
                                onKeyDown={e => {
                                    if (onRowClick && (e.key === 'Enter' || e.key === ' ')) {
                                        e.preventDefault();
                                        onRowClick(el);
                                    }
                                }}
                            >
                                <div>{el.name}</div>
                                <div>
                                    {typeof el.value === 'number' && format2Digits(el.value)}
                                    {typeof el.value === 'string' && el.value}
                                    {el.unit}
                                </div>
                            </div>
                        );
                    })}
                    {slicedData.length === 0 && <div className="list-suggestions-list-empty">No results found</div>}
                </div>
                {moreThanCapLimit && (
                    <span className="link" onClick={toggleShowMore}>
                        Show {isShowMoreEnabled ? 'less' : 'more'}
                    </span>
                )}
            </div>
        ),
        [
            enableSearch,
            isShowMoreEnabled,
            moreThanCapLimit,
            onRowClick,
            searchValue,
            slicedData,
            sortKey,
            sortDirection,
            title,
            toggleShowMore,
            toggleSort,
            tooltip,
        ]
    );

    return (
        <div className="suggestions-list">
            <div>
                <Button onClick={toggleList}>
                    {isVisible ? 'Hide' : 'Show'} {label} suggestions
                </Button>
            </div>
            {isVisible && suggestionListContent}
        </div>
    );
};
