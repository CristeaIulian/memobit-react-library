import { MiniSort, type MiniSortItem } from '../MiniSort';

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

    const sortItems: MiniSortItem[] = items.map(item => {
        const column = columns.find(col => col.key === item.column);
        return {
            value: item.column,
            label: item.label ?? (column ? getColumnLabel(column) : item.column),
            icon: item.icon ?? column?.icon,
            direction: item.direction ?? 'asc',
            disabled: !column,
        };
    });

    return <MiniSort items={sortItems} sortKey={sortKey} sortDirection={sortDirection} onSort={onSort} align={config?.align ?? 'left'} />;
}
