import { FC } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';

import './Pagination.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showPagesNumbers?: boolean;
    pageSizeOptions?: number[];
    pageSize?: number;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeLabel?: string;
}

export const Pagination: FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    showPagesNumbers = false,
    pageSizeOptions,
    pageSize,
    onPageSizeChange,
    pageSizeLabel = 'Rows',
}: PaginationProps) => {
    const { isAtLeast } = useBreakpoint();

    const showPageSize = pageSizeOptions && pageSize !== undefined && onPageSizeChange;

    const pageSizeOptionsList: DropdownOption[] | undefined = pageSizeOptions?.map(option => ({
        label: `${option}`,
        value: option,
    }));

    const getVisiblePages = () => {
        const delta = 2;
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

    if (totalPages <= 1 && !showPageSize) return null;

    return (
        <div className="pagination">
            {totalPages > 1 && (
                <div className="pagination__pages">
                    <Button variant="default" borders="sharp" disabled={currentPage === 1} prefixIcon="«" onClick={() => onPageChange(currentPage - 1)}>
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

                    <Button variant="default" borders="sharp" disabled={currentPage === totalPages} sufixIcon="»" onClick={() => onPageChange(currentPage + 1)}>
                        {isAtLeast('desktop') ? 'Next' : ''}
                    </Button>
                </div>
            )}

            {showPagesNumbers && (
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
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
        </div>
    );
};
