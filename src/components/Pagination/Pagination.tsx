import { FC, useCallback, useLayoutEffect, useRef, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useMessages } from '../../hooks/useLanguage';
import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';

import { getPageItems, type PageItem } from './pageItems';

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

const MAX_SIBLINGS = 5; // Pages shown on each side of the current one, at most
const GAP_LABEL = '...';
// Room kept spare for sub-pixel rounding, so a row that only just fits doesn't wrap its last arrow.
const ROUNDING_SLACK = 1;

/** What the page buttons can take and what each one needs, measured from the rendered row. */
interface PageWidths {
    /** Room between the arrows, for the page buttons and their gaps. */
    room: number;
    gap: number;
    ellipsis: number;
    /** A page button by the digits in its number: [1 digit, 2 digits, …]. */
    byDigits: number[];
}

const widthOf = (element: Element): number => element.getBoundingClientRect().width;

const sameWidths = (a: PageWidths, b: PageWidths): boolean =>
    a.room === b.room &&
    a.gap === b.gap &&
    a.ellipsis === b.ellipsis &&
    a.byDigits.length === b.byDigits.length &&
    a.byDigits.every((width, index) => width === b.byDigits[index]);

/** The width the page buttons may take: the row, less the parts that share its line (page-size picker, page counter). */
const getPagesWidth = (row: HTMLElement, pages: HTMLElement): number => {
    const style = getComputedStyle(row);
    const width = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    // Stacked on a phone: every part has a line of its own.
    if (style.flexDirection.startsWith('column')) return width;

    const gap = parseFloat(style.columnGap) || 0;
    let taken = 0;
    for (const child of row.children) {
        if (child === pages) continue;
        const childWidth = widthOf(child);
        // A part as wide as the row (the page counter on a tablet) wraps to a line of its own.
        if (childWidth >= width) continue;
        taken += childWidth + gap;
    }

    return width - taken;
};

export const Pagination: FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    onPageChange,
    showPagesNumbers = false,
    pageSizeOptions,
    pageSize,
    onPageSizeChange,
    pageSizeLabel,
    horizontalAlign = 'left',
}: PaginationProps) => {
    const t = useMessages(libMessages);
    const { isAtLeast } = useBreakpoint();
    const pagesRef = useRef<HTMLDivElement>(null);
    const previousRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const probeRef = useRef<HTMLSpanElement>(null);
    // Measured before the first paint; until then every page up to MAX_SIBLINGS shows.
    const [widths, setWidths] = useState<PageWidths | null>(null);
    const tooFewItems = totalItems !== undefined && !!pageSizeOptions?.length && totalItems <= Math.min(...pageSizeOptions);
    // Also gates the measuring effect, so it attaches once the pages row actually renders.
    const hasPages = totalPages > 1 && !tooFewItems;
    const digits = String(totalPages).length;

    const measure = useCallback(() => {
        const pages = pagesRef.current;
        const row = pages?.parentElement;
        const previousButton = previousRef.current;
        const nextButton = nextRef.current;
        const probe = probeRef.current;
        if (!pages || !row || !previousButton || !nextButton || !probe) return;

        // The probe holds a hidden gap and a page button per digit count, so the widths don't depend on which pages show now.
        const [ellipsis = 0, ...byDigits] = Array.from(probe.children, widthOf);
        const measured: PageWidths = {
            room: getPagesWidth(row, pages) - widthOf(previousButton) - widthOf(nextButton) - ROUNDING_SLACK,
            gap: parseFloat(getComputedStyle(pages).columnGap) || 0,
            ellipsis,
            byDigits,
        };

        // Same widths keep the same object, so the re-measure a re-render triggers settles at once.
        setWidths(current => (current && sameWidths(current, measured) ? current : measured));
    }, []);

    const fits = (items: PageItem[]): boolean => {
        if (!widths) return true;
        // n buttons between the arrows take n widths and n + 1 gaps.
        const used = items.reduce<number>(
            (sum, item) => sum + widths.gap + (typeof item === 'number' ? (widths.byDigits[String(item).length - 1] ?? 0) : widths.ellipsis),
            widths.gap
        );
        return used <= widths.room;
    };

    useLayoutEffect(() => {
        const row = pagesRef.current?.parentElement;
        if (!hasPages || !row) return;

        // The row sets the room and its other parts take from it; the arrows and the probe change
        // size with the breakpoint (labels) and with the page count (digits).
        const observer = new ResizeObserver(measure);
        for (const element of [row, ...row.children, previousRef.current, nextRef.current, probeRef.current]) {
            if (element) observer.observe(element);
        }
        measure();

        return () => observer.disconnect();
    }, [hasPages, measure]);

    const showPageSize = pageSizeOptions && pageSize !== undefined && onPageSizeChange;

    const pageSizeOptionsList: DropdownOption[] | undefined = pageSizeOptions?.map(option => ({
        label: `${option}`,
        value: option,
    }));

    if (tooFewItems) return null;

    if (totalPages <= 1 && !showPageSize) return null;

    return (
        <div className={`pagination pagination--${horizontalAlign}${totalPages <= 1 ? ' pagination--single' : ''}`}>
            {hasPages && (
                <div className="pagination__pages" ref={pagesRef}>
                    <Button
                        ref={previousRef}
                        variant="default"
                        borders="sharp"
                        disabled={currentPage === 1}
                        icon="caret-left"
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        {isAtLeast('desktop') ? t.previous : ''}
                    </Button>

                    {getPageItems(currentPage, totalPages, fits, MAX_SIBLINGS).map(item =>
                        typeof item === 'number' ? (
                            <Button key={item} borders="sharp" variant={item === currentPage ? 'warning' : 'default'} onClick={() => onPageChange(item)}>
                                {item}
                            </Button>
                        ) : (
                            <Button key={item} borders="sharp" variant="default" disabled>
                                {GAP_LABEL}
                            </Button>
                        )
                    )}

                    <Button
                        ref={nextRef}
                        variant="default"
                        borders="sharp"
                        disabled={currentPage === totalPages}
                        sufixIcon="caret-right"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        {isAtLeast('desktop') ? t.next : ''}
                    </Button>

                    <span className="pagination__probe" ref={probeRef}>
                        <Button borders="sharp" disabled>
                            {GAP_LABEL}
                        </Button>
                        {Array.from({ length: digits }, (_, index) => (
                            <Button key={index} borders="sharp">
                                {'8'.repeat(index + 1)}
                            </Button>
                        ))}
                    </span>
                </div>
            )}

            {showPageSize && pageSizeOptionsList && (
                <div className="pagination__page-size">
                    <span>{pageSizeLabel ?? t.rows}</span>
                    <Dropdown
                        name="pageSize"
                        options={pageSizeOptionsList}
                        value={pageSize}
                        clearable={false}
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

            {showPagesNumbers && <span className="page-info">{t.pageOf(currentPage, totalPages)}</span>}
        </div>
    );
};
