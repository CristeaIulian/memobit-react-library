import type { Language } from '../contexts/LanguageContext';
import { libMessages } from '../contexts/LanguageContext/libMessages';

export const getResultsCount = (
    visiblePageSize: number,
    filteredItemsCount: number,
    totalItemsCount: number,
    currentPage: number,
    itemNoun?: string,
    language: Language = 'en'
) => {
    const visibleStart = filteredItemsCount ? (currentPage - 1) * visiblePageSize + 1 : 0;
    const visibleEnd = Math.min(currentPage * visiblePageSize, filteredItemsCount);
    const suffix = itemNoun ? ` ${itemNoun}` : '';
    const t = libMessages[language];

    return filteredItemsCount === totalItemsCount
        ? t.resultsCount(visibleStart, visibleEnd, totalItemsCount, suffix)
        : t.resultsCountFiltered(visibleStart, visibleEnd, filteredItemsCount, totalItemsCount, suffix);
};
