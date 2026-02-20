import React, { useMemo, useState } from 'react';

import { Checkbox } from '../Checkbox';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { Pagination } from '../Pagination';

import './DataTable.scss';

export type SortDirection = 'asc' | 'desc';

export interface DataTableColumn<T> {
    key: string;
    header: React.ReactNode;
    accessor?: (row: T) => React.ReactNode;
    sortAccessor?: (row: T) => string | number;
    sortable?: boolean;
    width?: number;
    minWidth?: number;
}

export interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    data: T[];
    rowKey?: (row: T, index: number) => string | number;
    selectable?: boolean;
    onSelectionChange?: (rows: T[]) => void;
    pageSizeOptions?: number[];
    initialPageSize?: number;
}

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50];

export function DataTable<T>({
    columns,
    data,
    rowKey,
    selectable = false,
    onSelectionChange,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    initialPageSize = DEFAULT_PAGE_SIZES[1],
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
        columns.reduce((acc, column) => {
            acc[column.key] = column.width ?? 180;
            return acc;
        }, {} as Record<string, number>)
    );

    const resolvedRowKey = (row: T, index: number) => rowKey?.(row, index) ?? index;

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        const column = columns.find(col => col.key === sortKey);
        if (!column) return data;

        const accessor =
            column.sortAccessor ||
            column.accessor ||
            ((row: T) => {
                const value = (row as Record<string, unknown>)[column.key];
                return typeof value === 'string' || typeof value === 'number' ? value : '';
            });

        const sorted = [...data].sort((a, b) => {
            const aValue = accessor(a);
            const bValue = accessor(b);
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return aValue - bValue;
            }
            return String(aValue).localeCompare(String(bValue));
        });

        return sortDirection === 'asc' ? sorted : sorted.reverse();
    }, [columns, data, sortDirection, sortKey]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pagedData = sortedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);
    const pageSizeOptionsList: DropdownOption[] = pageSizeOptions.map(option => ({
        label: `${option}`,
        value: option,
    }));

    const updateSelection = (nextIds: Array<string | number>) => {
        setSelectedIds(nextIds);
        onSelectionChange?.(data.filter((row, index) => nextIds.includes(resolvedRowKey(row, index))));
    };

    const toggleSort = (column: DataTableColumn<T>) => {
        if (!column.sortable) return;
        if (sortKey === column.key) {
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column.key);
            setSortDirection('asc');
        }
    };

    const handleResizeStart = (event: React.MouseEvent, columnKey: string) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = columnWidths[columnKey] ?? 180;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const delta = moveEvent.clientX - startX;
            const minWidth = columns.find(col => col.key === columnKey)?.minWidth ?? 120;
            setColumnWidths(prev => ({
                ...prev,
                [columnKey]: Math.max(minWidth, startWidth + delta),
            }));
        };

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const allSelected = selectable && selectedIds.length > 0 && selectedIds.length === data.length;
    const partiallySelected = selectable && selectedIds.length > 0 && selectedIds.length < data.length;

    return (
        <div className="data-table">
            <div className="data-table__wrapper">
                <table>
                    <thead>
                        <tr>
                            {selectable && (
                                <th className="data-table__checkbox">
                                    <Checkbox
                                        checked={allSelected}
                                        indeterminate={partiallySelected}
                                        onChange={checked => {
                                            if (checked) {
                                                updateSelection(data.map(resolvedRowKey));
                                            } else {
                                                updateSelection([]);
                                            }
                                        }}
                                    />
                                </th>
                            )}
                            {columns.map(column => (
                                <th
                                    key={column.key}
                                    style={{ width: columnWidths[column.key] }}
                                    className={column.sortable ? 'is-sortable' : ''}
                                    onClick={() => toggleSort(column)}
                                >
                                    <span>{column.header}</span>
                                    {column.sortable && sortKey === column.key && (
                                        <span className="data-table__sort-indicator">
                                            {sortDirection === 'asc' ? 'ASC' : 'DESC'}
                                        </span>
                                    )}
                                    <span
                                        className="data-table__resizer"
                                        onMouseDown={event => handleResizeStart(event, column.key)}
                                        onClick={event => event.stopPropagation()}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pagedData.map((row, index) => {
                            const rowId = resolvedRowKey(row, index);
                            const isSelected = selectedIds.includes(rowId);
                            return (
                                <tr key={rowId} className={isSelected ? 'is-selected' : ''}>
                                    {selectable && (
                                        <td className="data-table__checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={checked => {
                                                    if (checked) {
                                                        updateSelection([...selectedIds, rowId]);
                                                    } else {
                                                        updateSelection(selectedIds.filter(id => id !== rowId));
                                                    }
                                                }}
                                            />
                                        </td>
                                    )}
                                    {columns.map(column => (
                                        <td key={column.key} style={{ width: columnWidths[column.key] }}>
                                            {column.accessor
                                                ? column.accessor(row)
                                                : (row as Record<string, React.ReactNode>)[column.key]}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        {pagedData.length === 0 && (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0)} className="data-table__empty">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="data-table__footer">
                <div className="data-table__pagination">
                    <Pagination currentPage={safeCurrentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>

                <div className="data-table__page-size">
                    <span>Rows</span>
                    <Dropdown
                        name="pageSize"
                        options={pageSizeOptionsList}
                        value={pageSize}
                        searchable={false}
                        usePortal={false}
                        onChange={option => {
                            if (option && !Array.isArray(option)) {
                                const nextSize = Number(option.value);
                                setPageSize(nextSize);
                                setCurrentPage(1);
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
