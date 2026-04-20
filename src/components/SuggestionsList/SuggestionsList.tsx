import { useCallback, useMemo, useState } from 'react';

import { format2Digits } from '../../helpers/Numbers';
import { Button } from '../Button';
import { Search } from '../Search';

import './SuggestionsList.scss';
import { Tooltip } from '../Tooltip';

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
}

const capLimit = 10;

export const SuggestionsList = ({ data, label, title, tooltip, enableSearch = false }: SuggestionsListProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isShowMoreEnabled, setShowMoreEnabled] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) return data;
        return data.filter(item =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [data, searchValue]);

    const slicedData = useMemo(
        () => (isShowMoreEnabled ? [...filteredData] : filteredData.slice(0, capLimit)),
        [filteredData, isShowMoreEnabled]
    );
    const moreThanCapLimit = filteredData.length > capLimit;

    const toggleList = () => {
        setIsVisible(!isVisible);
    };

    const toggleShowMore = useCallback(() => {
        setShowMoreEnabled(!isShowMoreEnabled);
    }, [isShowMoreEnabled]);

    const suggestionListContent = useMemo(
        () => (
            <fieldset className="fieldset-suggestions-list">
                <Tooltip title={tooltip}>
                    <legend>{title || 'Suggestions'}</legend>
                </Tooltip>
                {enableSearch && (
                    <div className="fieldset-suggestions-list-search">
                        <Search
                            value={searchValue}
                            onChange={setSearchValue}
                            placeholder="Search suggestions..."
                        />
                    </div>
                )}
                <div className="fieldset-suggestions-list-rows">
                    {slicedData.map((el, index) => {
                        return (
                            <div className="fieldset-suggestions-list-row" key={`fieldset-suggestions-list-row-${index}`}>
                                <div>{el.name}</div>
                                <div>
                                    {typeof el.value === 'number' && format2Digits(el.value)}
                                    {typeof el.value === 'string' && el.value}
                                    {el.unit}
                                </div>
                            </div>
                        );
                    })}
                    {slicedData.length === 0 && (
                        <div className="fieldset-suggestions-list-empty">
                            No results found
                        </div>
                    )}
                </div>
                {moreThanCapLimit && (
                    <span className="link" onClick={toggleShowMore}>
                        Show {isShowMoreEnabled ? 'less' : 'more'}
                    </span>
                )}
            </fieldset>
        ),
        [enableSearch, isShowMoreEnabled, moreThanCapLimit, searchValue, slicedData, title, toggleShowMore, tooltip]
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
