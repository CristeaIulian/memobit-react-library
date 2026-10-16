import React from 'react';

import { Icon } from '../Icon';

import type { DataViewColumn } from './DataView.types';

// ─── Constants & helpers ─────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZES = [15, 30, 50, 100, 250, 500];
export const getColumnLabel = <T,>(column: DataViewColumn<T>) => (typeof column.header === 'string' ? column.header : column.key);
export const renderColumnLabel = <T,>(column: DataViewColumn<T>) => (
    <span className="data-view__column-label">
        {column.icon && <Icon className="data-view__column-icon" name={column.icon} size="sm" variant="muted" />}
        <span>{column.header}</span>
    </span>
);
export const renderCellContent = <T,>(column: DataViewColumn<T>, row: T) => {
    const cellIcon = column.cellIcon?.(row);
    const value = column.accessor ? column.accessor(row) : (row as Record<string, React.ReactNode>)[column.key];
    if (!cellIcon) return value;
    return (
        <span className="data-view__cell-with-icon">
            <Icon className="data-view__cell-icon" name={cellIcon} />
            <span>{value}</span>
        </span>
    );
};
