/** A page number, or a gap standing in for the pages hidden between two shown ones. */
export type PageItem = number | 'start-gap' | 'end-gap';

/** Whether a row of page buttons fits the room the pagination has. */
export type FitsCheck = (items: PageItem[]) => boolean;

const range = (from: number, to: number): number[] => Array.from({ length: Math.max(0, to - from + 1) }, (_, index) => from + index);

/** First page, `left` and `right` pages either side of the current one, last page. A gap that would hide a single page shows that page instead: it takes about the same room. */
const buildItems = (current: number, total: number, left: number, right: number): PageItem[] => {
    if (total <= 1) return [1];

    const start = Math.max(2, current - left);
    const end = Math.min(total - 1, current + right);
    const before: PageItem[] = start > 3 ? ['start-gap'] : range(2, start - 1);
    const after: PageItem[] = end < total - 2 ? ['end-gap'] : range(end + 1, total - 1);

    return [1, ...before, ...range(start, end), ...after, total];
};

/** The longest run of pages around the current one that fits, for when even 1 … current … last does not. */
const getRun = (current: number, total: number, fits: FitsCheck): number[] => {
    let from = current;
    let to = current;

    for (;;) {
        const canGrowRight = to < total && fits(range(from, to + 1));
        const canGrowLeft = from > 1 && fits(range(from - 1, to));

        if (canGrowRight && (to - current <= current - from || !canGrowLeft)) {
            to += 1;
        } else if (canGrowLeft) {
            from -= 1;
        } else {
            return range(from, to);
        }
    }
};

/**
 * The page buttons that fit. First, last and current page always show; the pages around the current one
 * are added a side at a time, the shorter side first, until the next one would not fit or a side reaches
 * `maxSiblings`. Near either end the free side keeps growing, so the room is not left empty.
 */
export const getPageItems = (current: number, total: number, fits: FitsCheck, maxSiblings: number): PageItem[] => {
    const fitting = (items: PageItem[] | null): items is PageItem[] => items !== null && fits(items);

    let left = 0;
    let right = 0;
    let items = buildItems(current, total, left, right);

    if (!fits(items)) return getRun(current, total, fits);

    for (;;) {
        // A side is complete once at most one page is left between it and the end, which buildItems shows anyway.
        const wider = left < maxSiblings && current - left > 3 ? buildItems(current, total, left + 1, right) : null;
        const longer = right < maxSiblings && current + right < total - 2 ? buildItems(current, total, left, right + 1) : null;

        // On a tie the right side goes first: paging is mostly forward.
        if (fitting(longer) && (right <= left || !fitting(wider))) {
            right += 1;
            items = longer;
        } else if (fitting(wider)) {
            left += 1;
            items = wider;
        } else {
            return items;
        }
    }
};
