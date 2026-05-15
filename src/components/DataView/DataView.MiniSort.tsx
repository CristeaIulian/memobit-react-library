import { Icon } from '../Icon';

import { getColumnLabel } from './DataView.CardView';
import type { DataViewColumn, DataViewMiniSortConfig, SortDirection } from './DataView.types';

interface DataViewMiniSortProps<T> {
    columns: DataViewColumn<T>[];
    config?: DataViewMiniSortConfig;
    sortDirection: SortDirection;
    sortKey: string | null;
    onSort: (column: string, direction: SortDirection) => void;
}

export function DataViewMiniSort<T>({ columns, config, sortDirection, sortKey, onSort }: DataViewMiniSortProps<T>) {
    const items = config?.columns ?? config?.column ?? [];
    if (items.length === 0) return null;

    return (
        <nav className="data-view__mini-sort" aria-label="Quick sort">
            {items.map((item, index) => {
                const direction = item.direction ?? 'asc';
                const column = columns.find(col => col.key === item.column);
                const label = item.label ?? (column ? getColumnLabel(column) : item.column);
                const icon = item.icon ?? column?.icon;
                const isActive = sortKey === item.column && sortDirection === direction;
                const labelText = typeof label === 'string' || typeof label === 'number' ? String(label) : item.column;

                return (
                    <button
                        key={`${item.column}-${direction}-${index}`}
                        type="button"
                        className={`data-view__mini-sort-button${isActive ? ' is-active' : ''}`}
                        disabled={!column}
                        aria-label={`Sort ${labelText} ${direction === 'asc' ? 'ascending' : 'descending'}`}
                        aria-pressed={isActive}
                        title={`Sort ${labelText} ${direction === 'asc' ? 'ascending' : 'descending'}`}
                        onClick={() => onSort(item.column, direction)}
                    >
                        {icon && <Icon className="data-view__mini-sort-icon" name={icon} size="sm" variant={isActive ? 'accent' : 'muted'} />}
                        <span className="data-view__mini-sort-label">{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
