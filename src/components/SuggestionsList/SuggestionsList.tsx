import { useCallback, useMemo, useState } from 'react';

import { format2Digits } from '../../helpers/Numbers';
import { Button } from '../Button';

import './SuggestionsList.scss';

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
}

const capLimit = 10;

export const SuggestionsList = ({ data, label, title, tooltip }: SuggestionsListProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isShowMoreEnabled, setShowMoreEnabled] = useState(false);

    const slicedData = useMemo(() => (isShowMoreEnabled ? [...data] : data.slice(0, capLimit)), [data, isShowMoreEnabled]);
    const moreThanCapLimit = data.length > capLimit;

    const toggleList = () => {
        setIsVisible(!isVisible);
    };

    const toggleShowMore = useCallback(() => {
        setShowMoreEnabled(!isShowMoreEnabled);
    }, [isShowMoreEnabled]);

    const suggestionListContent = useMemo(
        () => (
            <fieldset className="fieldset-suggestions-list">
                <legend title={tooltip}>{title || 'Suggestions'}</legend>
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
                {moreThanCapLimit && (
                    <span className="link" onClick={toggleShowMore}>
                        Show {isShowMoreEnabled ? 'less' : 'more'}
                    </span>
                )}
            </fieldset>
        ),
        [isShowMoreEnabled, moreThanCapLimit, slicedData, title, toggleShowMore, tooltip]
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
