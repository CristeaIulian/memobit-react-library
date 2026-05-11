export const getResultsCount = (
    visiblePageSize: number,
    filteredItemsCount: number,
    totalItemsCount: number,
    currentPage: number,
    itemNoun?: string
) => {
    const visibleStart = filteredItemsCount ? (currentPage - 1) * visiblePageSize + 1 : 0;
    const visibleEnd = Math.min(currentPage * visiblePageSize, filteredItemsCount);
    const suffix = itemNoun ? ` ${itemNoun}` : '';

    return filteredItemsCount === totalItemsCount
        ? `Showing ${visibleStart}-${visibleEnd} of ${totalItemsCount}${suffix}`
        : `Showing ${visibleStart}-${visibleEnd} of ${filteredItemsCount} filtered${suffix} (${totalItemsCount} total)`;
};
