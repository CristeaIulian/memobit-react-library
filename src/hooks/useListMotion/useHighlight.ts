import { useCallback, useEffect, useState } from 'react';

import { HIGHLIGHT_WAIT_MS, type ListMotionKey } from './useListMotion';

export interface UseHighlightReturn {
    /** Pass to DataView `highlightIds` (or useListMotion `highlightKeys`). */
    highlightIds: ListMotionKey[];
    /** Scroll to and flash these items. Safe to call before they are in the list: it waits for them. */
    highlight: (...ids: ListMotionKey[]) => void;
}

/** Points the user at items after an add, edit or undo, so they can see where the change landed. */
export const useHighlight = (): UseHighlightReturn => {
    const [highlightIds, setHighlightIds] = useState<ListMotionKey[]>([]);

    // A fresh array every call, so highlighting the same item twice replays the flash.
    const highlight = useCallback((...ids: ListMotionKey[]) => setHighlightIds(ids), []);

    // Cleared once the list has stopped waiting for the items, so a list that mounts later
    // (another tab, a view switch) does not replay an old highlight.
    useEffect(() => {
        if (highlightIds.length === 0) return;

        const timer = setTimeout(() => setHighlightIds([]), HIGHLIGHT_WAIT_MS);

        return () => clearTimeout(timer);
    }, [highlightIds]);

    return { highlightIds, highlight };
};
