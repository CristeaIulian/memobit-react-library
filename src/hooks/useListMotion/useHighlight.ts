import { useCallback, useState } from 'react';

import type { ListMotionKey } from './useListMotion';

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

    return { highlightIds, highlight };
};
