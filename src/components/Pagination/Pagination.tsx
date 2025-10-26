import { FC } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';

import './Pagination.scss';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    const { isAtLeast } = useBreakpoint();

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

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
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

            <Button variant="default" borders="sharp" disabled={currentPage === totalPages} prefixIcon="»" onClick={() => onPageChange(currentPage + 1)}>
                {isAtLeast('desktop') ? 'Next' : ''}
            </Button>

            <span className="page-info">
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
};
