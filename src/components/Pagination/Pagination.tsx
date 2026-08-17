import { FC, useCallback, useEffect, useRef, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';

import './Pagination.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    onPageChange: (page: number) => void;
    showPagesNumbers?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeLabel?: string;
    horizontalAlign?: 'left' | 'center' | 'right';
}

const PAGE_BUTTON_WIDTH = 45;
const NAV_BUTTON_WIDTH_DESKTOP = 120;
const NAV_BUTTON_WIDTH_MOBILE = 45;
const DOTS_WIDTH = 45;
const GAP = 8;
const MAX_DELTA = 4; // Cap visible siblings per side — at most 1, c-4..c+4, …, N (≈ 13 buttons)

export const Pagination: FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    showPagesNumbers = false,
    pageSizeOptions,
    pageSize,
    onPageSizeChange,
    pageSizeLabel = 'Rows',
    horizontalAlign = 'left',
}: PaginationProps) => {
    const { isAtLeast, isMobile } = useBreakpoint();
    const pagesRef = useRef<HTMLDivElement>(null);
    const [delta, setDelta] = useState(isMobile ? 0 : 2);

    const calculateDelta = useCallback(() => {
        const container = pagesRef.current;
        const row = container?.parentElement;
        if (!container || !row) return;

        // Measure the row, not the pages container. The container is shrink-to-fit
        // in the centered layout (`flex: none`), so its own width only ever reports
        // the buttons already rendered — measuring it locks delta at whatever it
        // started as and it can never grow into free space. The siblings sharing
        // the row (page-size dropdown, page counter) are subtracted so their width
        // isn't handed out twice.
        let siblingsWidth = 0;
        for (const child of row.children) {
            if (child !== container) siblingsWidth += (child as HTMLElement).offsetWidth + GAP;
        }
        const containerWidth = row.clientWidth - siblingsWidth;
        const navButtonWidth = isAtLeast('desktop') ? NAV_BUTTON_WIDTH_DESKTOP : NAV_BUTTON_WIDTH_MOBILE;
        // Fixed space: 2 nav buttons + first page + last page + 2 dots + gaps
        const fixedWidth = navButtonWidth * 2 + PAGE_BUTTON_WIDTH * 2 + DOTS_WIDTH * 2 + GAP * 6;
        const availableWidth = containerWidth - fixedWidth;
        const maxMiddleButtons = Math.floor(availableWidth / (PAGE_BUTTON_WIDTH + GAP));
        const newDelta = Math.min(MAX_DELTA, Math.max(0, Math.floor(maxMiddleButtons / 2)));

        setDelta(newDelta);
    }, [isAtLeast]);

    useEffect(() => {
        const container = pagesRef.current;
        const row = container?.parentElement;
        if (!container || !row) return;

        // Watch the row as well: it's what the delta is derived from, and in the
        // centered layout it can widen (sidebar collapse, window resize) without
        // the shrink-to-fit pages container changing size at all.
        const observer = new ResizeObserver(() => {
            calculateDelta();
        });

        observer.observe(container);
        observer.observe(row);
        calculateDelta();

        return () => observer.disconnect();
    }, [calculateDelta]);

    const showPageSize = pageSizeOptions && pageSize !== undefined && onPageSizeChange;

    const pageSizeOptionsList: DropdownOption[] | undefined = pageSizeOptions?.map(option => ({
        label: `${option}`,
        value: option,
    }));

    const getVisiblePages = () => {
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else {
            if (totalPages > 1) {
                rangeWithDots.push(totalPages);
            }
        }

        return rangeWithDots;
    };

    if (totalItems !== undefined && pageSizeOptions?.length) {
        const minPageSize = Math.min(...pageSizeOptions);
        if (totalItems <= minPageSize) return null;
    }

    if (totalPages <= 1 && !showPageSize) return null;

    return (
        <div className={`pagination pagination--${horizontalAlign}`}>
            {totalPages > 1 && (
                <div className="pagination__pages" ref={pagesRef}>
                    <Button variant="default" borders="sharp" disabled={currentPage === 1} icon="previous" onClick={() => onPageChange(currentPage - 1)}>
                        {isAtLeast('desktop') ? 'Previous' : ''}
                    </Button>

                    {getVisiblePages().map((page, index) => (
                        <Button
                            key={index}
                            borders="sharp"
                            variant={page === currentPage ? 'warning' : 'default'}
                            disabled={typeof page === 'string'}
                            onClick={() => typeof page === 'number' && onPageChange(page)}
                        >
                            {page}
                        </Button>
                    ))}

                    <Button variant="default" borders="sharp" disabled={currentPage === totalPages} sufixIcon="next" onClick={() => onPageChange(currentPage + 1)}>
                        {isAtLeast('desktop') ? 'Next' : ''}
                    </Button>
                </div>
            )}

            {showPageSize && pageSizeOptionsList && (
                <div className="pagination__page-size">
                    <span>{pageSizeLabel}</span>
                    <Dropdown
                        name="pageSize"
                        options={pageSizeOptionsList}
                        value={pageSize}
                        searchable={false}
                        usePortal={false}
                        onChange={option => {
                            if (option && !Array.isArray(option)) {
                                onPageSizeChange(Number(option.value));
                            }
                        }}
                    />
                </div>
            )}

            {showPagesNumbers && (
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
            )}
        </div>
    );
};
