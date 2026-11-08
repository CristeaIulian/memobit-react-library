import { useMemo } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';

import { SummaryMessages } from './filterRules';

export const useSummaryMessages = (): SummaryMessages => {
    const t = useMessages(libMessages);
    return useMemo(
        () => ({
            any: t.pageAny,
            selectedCount: t.pageSelectedCount,
            without: t.pageWithout,
            ratingAtLeast: t.pageRatingAtLeast,
            dateSince: t.pageDateSince,
            dateUntil: t.pageDateUntil,
            anyWord: t.pageAnyWord,
            allWords: t.pageAllWords,
        }),
        [t]
    );
};
