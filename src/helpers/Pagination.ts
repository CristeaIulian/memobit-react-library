export const getResultsCount = (visiblePageSize: number, filteredItemsCount: number, totalItemsCount: number, currentPage: number) => {
    const visibleStart = filteredItemsCount ? (currentPage - 1) * visiblePageSize + 1 : 0;
    const visibleEnd = Math.min(currentPage * visiblePageSize, filteredItemsCount);

    return filteredItemsCount === totalItemsCount
        ? `Showing ${visibleStart}-${visibleEnd} of ${totalItemsCount} total`
        : `Showing ${visibleStart}-${visibleEnd} of ${filteredItemsCount} filtered (${totalItemsCount} total)`;
};
