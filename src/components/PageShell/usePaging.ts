import { useState } from 'react';

import { PagePagination } from './PageShell.types';

interface UsePagingOptions {
    /** Items in the list as shown (after filters and search). */
    itemCount: number;
    initialPageSize?: number;
    /** Values whose change sends the list back to page 1: usually the filters, the search and the sort. */
    resetOn?: unknown[];
}

export interface PagingState {
    /** 1-indexed, and never past the last page. */
    page: number;
    pageSize: number;
    pageCount: number;
    setPage: (page: number) => void;
    /** Changes the page size and starts again from page 1. */
    setPageSize: (pageSize: number) => void;
    /** Ready for PageShell's `pagination` prop. */
    pagination: PagePagination;
}

const DEFAULT_PAGE_SIZE = 20;

/** The current page of a list, held by the page so its header and the list agree. */
export const usePaging = ({ itemCount, initialPageSize = DEFAULT_PAGE_SIZE, resetOn = [] }: UsePagingOptions): PagingState => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSizeState] = useState(initialPageSize);
    const resetKey = JSON.stringify(resetOn);
    const [lastResetKey, setLastResetKey] = useState(resetKey);

    // Adjusting state while rendering, so the list never shows a page the new filters no longer have.
    if (resetKey !== lastResetKey) {
        setLastResetKey(resetKey);
        setPage(1);
    }

    const pageCount = Math.max(1, Math.ceil(itemCount / pageSize));
    // Deleting the last items of the last page would otherwise leave the list on an empty page.
    const currentPage = Math.min(page, pageCount);
    const setPageSize = (next: number) => {
        setPageSizeState(next);
        setPage(1);
    };

    return {
        page: currentPage,
        pageSize,
        pageCount,
        setPage,
        setPageSize,
        pagination: { page: currentPage, pageCount, onChange: setPage },
    };
};
