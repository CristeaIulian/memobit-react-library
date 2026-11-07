import { useMemo } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';

import { SummaryMessages } from './filterRules';

export const useSummaryMessages = (): SummaryMessages => {
    const t = useMessages(libMessages);
    return useMemo(
        () => ({
            selectedCount: t.pageSelectedCount,
            ratingAtLeast: t.pageRatingAtLeast,
            dateSince: t.pageDateSince,
            dateUntil: t.pageDateUntil,
            anyWord: t.pageAnyWord,
            allWords: t.pageAllWords,
        }),
        [t]
    );
};
