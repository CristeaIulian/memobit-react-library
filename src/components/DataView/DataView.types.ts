import React from 'react';

import { type ExternalButtonConfig } from '../Button';
import { type IconName } from '../Icon';

export type SortDirection = 'asc' | 'desc';
export type DataViewDisplayMode = 'table' | 'cards';

export interface DataViewColumn<T> {
    key: string;
    header: React.ReactNode;
    icon?: IconName;
    /** Optional per-row icon rendered before the cell value. */
    cellIcon?: (row: T) => IconName | undefined;
    /** Optional filter input rendered below the column header (table) or in the filter bar (card) */
    filter?: React.ReactNode;
    accessor?: (row: T) => React.ReactNode;
    sortAccessor?: (row: T) => string | number;
    sortable?: boolean;
    width?: number;
    minWidth?: number;
    hideInCard?: boolean;
    hideInTable?: boolean;
    /** Hide this column only on mobile breakpoint (not when cards are used on desktop). */
    hideInMobile?: boolean;
}

export interface DataViewCardConfig<T> {
    icon?: (row: T) => IconName | undefined;
    /** Renders above the card header — use for thumbnails / hero images. */
    media?: (row: T) => React.ReactNode;
    title: (row: T) => React.ReactNode;
    subtitle?: (row: T) => React.ReactNode;
    badges?: (row: T) => React.ReactNode;
}

export interface DataViewTimelineConfig<T> {
    dateAccessor: (row: T) => string;
    idAccessor: (row: T) => string | number;
    granularity?: 'day' | 'month';
}

export interface DataViewEmptyConfig {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    primary?: ExternalButtonConfig;
    secondary?: ExternalButtonConfig;
}

export type DataViewGroupKey = string | number | null;

export interface DataViewGroup<T> {
    key: DataViewGroupKey;
    label: React.ReactNode;
    items: T[];
    totalCount: number;
}

export interface DataViewGroupConfig<T> {
    /** Extract group key from row. Return null for ungrouped/uncategorized items. */
    groupBy: (row: T) => DataViewGroupKey;
    /** Display label for a group header. */
    groupLabel: (groupKey: DataViewGroupKey) => React.ReactNode;
    /** Optional comparator to order groups; default keeps first-encountered order with null last. */
    sortGroups?: (a: DataViewGroup<T>, b: DataViewGroup<T>) => number;
    /** Show item count badge next to group label. Default: true. */
    showCount?: boolean;
    /** Allow users to collapse/expand individual groups by clicking the header. */
    collapsible?: boolean;
}

export interface DataViewProps<T> {
    columns: DataViewColumn<T>[];
    data: T[];
    rowKey?: (row: T, index: number) => string | number;
    selectable?: boolean;
    onSelectionChange?: (rows: T[]) => void;
    /** Controlled selection — when provided, DataView reflects this array of row keys instead of its internal state. */
    selectedIds?: Array<string | number>;
    pageSizeOptions?: number[];
    initialPageSize?: number;
    showPageSize?: boolean;
    card?: DataViewCardConfig<T>;
    actions?: (row: T) => React.ReactNode;
    actionsWidth?: number;
    timeline?: DataViewTimelineConfig<T>;
    onRowClick?: (row: T) => void;
    rowClassName?: (row: T) => string;
    empty?: DataViewEmptyConfig;
    /** Initial sorted column key for uncontrolled sorting. */
    initialSortKey?: string | null;
    /** Initial sort direction for uncontrolled sorting. */
    initialSortDirection?: SortDirection;
    /** Controlled sorted column key. */
    sortKey?: string | null;
    /** Controlled sort direction. */
    sortDirection?: SortDirection;
    onSortChange?: (sort: { key: string | null; direction: SortDirection }) => void;
    /** Show the built-in sort controls above cards. */
    showCardSortControls?: boolean;
    /** Selected layout mode. */
    desktopView?: DataViewDisplayMode;
    /** Maximum width for each card. Number values are treated as px. */
    cardMaxWidth?: number | string;
    className?: string;
    onPageChange?: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    /** Controlled current page (1-indexed). When provided, DataView uses this instead of its internal state. */
    currentPage?: number;
    /** When set, DataView assumes `data` is already a server-paged slice and uses this for the pagination total. */
    totalItems?: number;
    /** Group rows by a key. Rows render in group sections within the paginated slice. */
    group?: DataViewGroupConfig<T>;
    /** Display the "Showing X-Y of Z" results-count label above the data. Default: true. */
    showResultsCount?: boolean;
    /** Unfiltered total used to render the "filtered (… total)" form when smaller than this value. Defaults to `data.length`. */
    totalCount?: number;
    /** Noun appended to the results-count label, e.g. "books". */
    itemNoun?: string;
}


