import React, { useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { EmptyState, type EmptyStateProps } from '../EmptyState';
import { Pagination } from '../Pagination';
import { calculateTimelineMarkers, TimelineMarkerDot, type TimelineMarkerInfo, type TimelineMarkersItem, TimelineMobileSeparator } from '../TimelineMarkers';

import './DataView.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';
export type DataViewDisplayMode = 'table' | 'cards';

export interface DataViewColumn<T> {
    key: string;
    header: React.ReactNode;
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
    primaryAction?: EmptyStateProps['primaryAction'];
    secondaryAction?: EmptyStateProps['secondaryAction'];
}

export type DataViewGroupKey = string | number | null;

export interface DataViewGroup<T> {
    key: DataViewGroupKey;
    label: React.ReactNode;
    items: T[];
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
}

export interface DataViewProps<T> {
    columns: DataViewColumn<T>[];
    data: T[];
    rowKey?: (row: T, index: number) => string | number;
    selectable?: boolean;
    onSelectionChange?: (rows: T[]) => void;
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
    /** Desktop layout. Mobile still renders cards when responsive is true. */
    desktopView?: DataViewDisplayMode;
    /** Maximum width for each card. Number values are treated as px. */
    cardMaxWidth?: number | string;
    responsive?: boolean;
    className?: string;
    onPageChange?: (page: number) => void;
    /**
     * Custom card renderer. When provided, each item in card mode is rendered by this function
     * instead of the default card layout. The node is placed directly in the cards container —
     * use your own card component for styling (no DataView card wrapper is added).
     */
    renderCard?: (row: T) => React.ReactNode;
    /** Group rows by a key. When set, pagination is disabled and rows render in group sections. */
    group?: DataViewGroupConfig<T>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZES = [15, 30, 50, 100, 250, 500];

const getColumnLabel = <T,>(column: DataViewColumn<T>) => (typeof column.header === 'string' ? column.header : column.key);

const getCardMaxWidthValue = (cardMaxWidth: number | string) => (typeof cardMaxWidth === 'number' ? `${cardMaxWidth}px` : cardMaxWidth);

// ─── Sort icon ───────────────────────────────────────────────────────────────

interface SortIconProps {
    state: 'unsorted' | 'asc' | 'desc';
}

function SortIcon({ state }: SortIconProps) {
    return (
        <span className={`data-view__sort-icon data-view__sort-icon--${state}`} aria-hidden="true">
            {state === 'asc' ? '↑' : state === 'desc' ? '↓' : '↕'}
        </span>
    );
}

// ─── Card View ───────────────────────────────────────────────────────────────

interface CardViewProps<T> {
    data: T[];
    columns: DataViewColumn<T>[];
    rowKey: (row: T, index: number) => string | number;
    card?: DataViewCardConfig<T>;
    actions?: (row: T) => React.ReactNode;
    timeline?: DataViewTimelineConfig<T>;
    onRowClick?: (row: T) => void;
    rowClassName?: (row: T) => string;
    empty?: DataViewEmptyConfig;
    selectable?: boolean;
    selectedIds?: Array<string | number>;
    onToggleSelect?: (rowId: string | number, checked: boolean) => void;
    cardMaxWidth?: number | string;
    isMobile?: boolean;
    renderCard?: (row: T) => React.ReactNode;
    groups?: DataViewGroup<T>[];
    showGroupCount?: boolean;
}

function CardView<T>({
    data,
    columns,
    rowKey,
    card,
    actions,
    timeline,
    onRowClick,
    rowClassName,
    empty,
    selectable,
    selectedIds = [],
    onToggleSelect,
    cardMaxWidth,
    isMobile = false,
    renderCard,
    groups,
    showGroupCount = true,
}: CardViewProps<T>) {
    const cardColumns = columns.filter(col => !col.hideInCard && !(isMobile && col.hideInMobile));
    const cardsClassName = `data-view__cards${cardMaxWidth !== undefined ? ' data-view__cards--grid' : ''}`;
    const cardsStyle =
        cardMaxWidth !== undefined
            ? ({ '--data-view-card-max-width': getCardMaxWidthValue(cardMaxWidth) } as React.CSSProperties)
            : undefined;

    const timelineMarkers = useMemo(() => {
        if (!timeline) return new Map<number, TimelineMarkerInfo>();
        const items: TimelineMarkersItem[] = data.map(row => ({
            id: timeline.idAccessor(row),
            date: timeline.dateAccessor(row),
        }));
        return calculateTimelineMarkers(items, timeline.granularity);
    }, [data, timeline]);

    if (data.length === 0) {
        if (empty) {
            return (
                <EmptyState
                    title={empty.title}
                    description={empty.description}
                    icon={empty.icon}
                    primaryAction={empty.primaryAction}
                    secondaryAction={empty.secondaryAction}
                />
            );
        }
        return <EmptyState title="No data available" />;
    }

    const renderRow = (row: T, index: number) => {
        const marker = timelineMarkers.get(index);
        const rowId = rowKey(row, index);

        if (renderCard) {
            return (
                <React.Fragment key={rowId}>
                    {marker && <TimelineMobileSeparator marker={marker} />}
                    {renderCard(row)}
                </React.Fragment>
            );
        }

        const isSelected = selectable && selectedIds.includes(rowId);

        return (
            <React.Fragment key={rowId}>
                {marker && <TimelineMobileSeparator marker={marker} />}
                <div
                    className={`data-view__card ${onRowClick ? 'data-view__card--clickable' : ''} ${isSelected ? 'data-view__card--selected' : ''} ${rowClassName?.(row) || ''}`}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                    {selectable && onToggleSelect && (
                        <div className="data-view__card-select" onClick={e => e.stopPropagation()}>
                            <Checkbox checked={isSelected || false} onChange={checked => onToggleSelect(rowId, checked)} />
                        </div>
                    )}
                    {card && (
                        <div className="data-view__card-header">
                            <div className="data-view__card-title-row">
                                <span className="data-view__card-title">{card.title(row)}</span>
                                {card.subtitle && <span className="data-view__card-subtitle">{card.subtitle(row)}</span>}
                            </div>
                            {card.badges && <div className="data-view__card-badges">{card.badges(row)}</div>}
                        </div>
                    )}

                    {cardColumns.length > 0 && (
                        <div className="data-view__card-body">
                            {cardColumns.map(col => (
                                <div key={col.key} className="data-view__card-field">
                                    <span className="data-view__card-label">{col.header}</span>
                                    <span className="data-view__card-value">
                                        {col.accessor ? col.accessor(row) : (row as Record<string, React.ReactNode>)[col.key]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {actions && (
                        <div className="data-view__card-actions" onClick={e => e.stopPropagation()}>
                            {actions(row)}
                        </div>
                    )}
                </div>
            </React.Fragment>
        );
    };

    if (groups) {
        let runningIndex = 0;
        return (
            <div className="data-view__groups">
                {groups.map(group => {
                    const startIndex = runningIndex;
                    runningIndex += group.items.length;
                    return (
                        <section key={group.key ?? '__null__'} className="data-view__group">
                            <header className="data-view__group-header">
                                <span className="data-view__group-label">{group.label}</span>
                                {showGroupCount && <span className="data-view__group-count">{group.items.length}</span>}
                            </header>
                            <div className={cardsClassName} style={cardsStyle}>
                                {group.items.map((row, i) => renderRow(row, startIndex + i))}
                            </div>
                        </section>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={cardsClassName} style={cardsStyle}>
            {data.map((row, index) => renderRow(row, index))}
        </div>
    );
}

// ─── DataView ───────────────────────────────────────────────────────────────

export function DataView<T>({
    columns,
    data,
    rowKey,
    selectable = false,
    onSelectionChange,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    initialPageSize = DEFAULT_PAGE_SIZES[1],
    showPageSize = true,
    card,
    actions,
    actionsWidth,
    timeline,
    onRowClick,
    rowClassName,
    empty,
    initialSortKey = null,
    initialSortDirection = 'asc',
    sortKey: controlledSortKey,
    sortDirection: controlledSortDirection,
    onSortChange,
    showCardSortControls = true,
    desktopView = 'table',
    cardMaxWidth,
    responsive = true,
    className,
    onPageChange,
    renderCard,
    group,
}: DataViewProps<T>) {
    const { isMobile } = useBreakpoint();
    const [uncontrolledSortKey, setUncontrolledSortKey] = useState<string | null>(initialSortKey);
    const [uncontrolledSortDirection, setUncontrolledSortDirection] = useState<SortDirection>(initialSortDirection);
    const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() =>
        columns.reduce(
            (acc, column) => {
                if (column.width) {
                    acc[column.key] = column.width;
                }
                return acc;
            },
            {} as Record<string, number>
        )
    );

    const resolvedRowKey = (row: T, index: number) => rowKey?.(row, index) ?? index;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        onPageChange?.(page);
    };

    const sortKey = controlledSortKey !== undefined ? controlledSortKey : uncontrolledSortKey;
    const sortDirection = controlledSortDirection ?? uncontrolledSortDirection;

    const updateSort = (nextSortKey: string | null, nextSortDirection: SortDirection) => {
        if (controlledSortKey === undefined) {
            setUncontrolledSortKey(nextSortKey);
        }
        if (controlledSortDirection === undefined) {
            setUncontrolledSortDirection(nextSortDirection);
        }
        onSortChange?.({ key: nextSortKey, direction: nextSortDirection });
        handlePageChange(1);
    };

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

    const isGrouped = !!group;
    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const pagedData = isGrouped ? sortedData : sortedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const computedGroups = useMemo<DataViewGroup<T>[] | null>(() => {
        if (!group) return null;
        const map = new Map<DataViewGroupKey, T[]>();
        const order: DataViewGroupKey[] = [];
        pagedData.forEach(row => {
            const key = group.groupBy(row);
            const existing = map.get(key);
            if (existing) {
                existing.push(row);
            } else {
                map.set(key, [row]);
                order.push(key);
            }
        });
        const entries: DataViewGroup<T>[] = order.map(key => ({
            key,
            label: group.groupLabel(key),
            items: map.get(key) as T[],
        }));
        if (group.sortGroups) {
            entries.sort(group.sortGroups);
        } else {
            entries.sort((a, b) => {
                if (a.key === null) return 1;
                if (b.key === null) return -1;
                return 0;
            });
        }
        return entries;
    }, [group, pagedData]);

    // Timeline markers for table mode — must be called before any conditional return
    const tableTimelineMarkers = useMemo(() => {
        if (!timeline) return new Map<number, TimelineMarkerInfo>();
        const items: TimelineMarkersItem[] = pagedData.map(row => ({
            id: timeline.idAccessor(row),
            date: timeline.dateAccessor(row),
        }));
        return calculateTimelineMarkers(items, timeline.granularity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagedData, timeline]);

    const updateSelection = (nextIds: Array<string | number>) => {
        setSelectedIds(nextIds);
        onSelectionChange?.(data.filter((row, index) => nextIds.includes(resolvedRowKey(row, index))));
    };

    const toggleSort = (column: DataViewColumn<T>) => {
        if (!column.sortable) return;
        if (sortKey === column.key) {
            updateSort(column.key, sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            updateSort(column.key, 'asc');
        }
    };

    const handleResizeStart = (event: React.MouseEvent, columnKey: string) => {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = columnWidths[columnKey] ?? 150;

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

    const hasFilters = columns.some(col => col.filter);
    const sortableColumns = columns.filter(col => col.sortable);
    const sortOptions: DropdownOption[] = sortableColumns.map(column => ({
        label: getColumnLabel(column),
        value: column.key,
    }));
    const hasSortControls = sortableColumns.length > 0;
    const activeSortColumn = sortKey ? sortableColumns.find(column => column.key === sortKey) : undefined;

    // ── Card mode ────────────────────────────────────────────────────────────

    const showCards = (responsive && isMobile) || (!isMobile && desktopView === 'cards');

    if (showCards) {
        return (
            <div className={`data-view data-view--cards${className ? ` ${className}` : ''}`}>
                {showCardSortControls && hasSortControls && (
                    <div className="data-view__card-sort-bar">
                        <div className="data-view__card-sort-field">
                            <Dropdown
                                name="data-view-card-sort"
                                label="Sort by"
                                options={sortOptions}
                                value={sortKey}
                                placeholder="Sort by..."
                                searchable={false}
                                usePortal={false}
                                onChange={option => {
                                    if (!option || Array.isArray(option)) {
                                        updateSort(null, sortDirection);
                                        return;
                                    }

                                    const nextSortKey = String(option.value);
                                    updateSort(nextSortKey, sortKey === nextSortKey ? sortDirection : 'asc');
                                }}
                            />
                        </div>
                        <Button
                            ariaLabel={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                            className="data-view__card-sort-direction"
                            disabled={!activeSortColumn}
                            onClick={() => {
                                if (!activeSortColumn) return;
                                updateSort(activeSortColumn.key, sortDirection === 'asc' ? 'desc' : 'asc');
                            }}
                            title={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
                            variant="ghost"
                        >
                            {sortDirection === 'asc' ? '↑' : '↓'}
                        </Button>
                    </div>
                )}

                {hasFilters && (
                    <div className="data-view__filter-bar">
                        {columns
                            .filter(col => col.filter)
                            .map(col => (
                                <div key={col.key} className="data-view__filter-bar-item">
                                    {col.filter}
                                </div>
                            ))}
                    </div>
                )}

                <CardView
                    data={pagedData}
                    columns={columns}
                    rowKey={resolvedRowKey}
                    card={card}
                    actions={actions}
                    timeline={timeline}
                    onRowClick={onRowClick}
                    rowClassName={rowClassName}
                    empty={empty}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    cardMaxWidth={cardMaxWidth}
                    isMobile={isMobile}
                    renderCard={renderCard}
                    groups={computedGroups ?? undefined}
                    showGroupCount={group?.showCount !== false}
                    onToggleSelect={(rowId, checked) => {
                        if (checked) {
                            updateSelection([...selectedIds, rowId]);
                        } else {
                            updateSelection(selectedIds.filter(id => id !== rowId));
                        }
                    }}
                />

                {!isGrouped && (
                    <Pagination
                        currentPage={safeCurrentPage}
                        totalPages={totalPages}
                        totalItems={sortedData.length}
                        onPageChange={handlePageChange}
                        pageSizeOptions={showPageSize ? pageSizeOptions : undefined}
                        pageSize={showPageSize ? pageSize : undefined}
                        onPageSizeChange={
                            showPageSize
                                ? nextSize => {
                                      setPageSize(nextSize);
                                      handlePageChange(1);
                                  }
                                : undefined
                        }
                    />
                )}
            </div>
        );
    }

    // ── Table mode (desktop) ─────────────────────────────────────────────────

    const tableColumns = columns.filter(col => !col.hideInTable);
    const allSelected = selectable && selectedIds.length > 0 && selectedIds.length === data.length;
    const partiallySelected = selectable && selectedIds.length > 0 && selectedIds.length < data.length;
    const showTimeline = timeline && tableTimelineMarkers.size > 0;

    const tableContent = (
        <>
            <div className="data-view__wrapper">
                <table>
                    <thead>
                        {/* ── Column header row ── */}
                        <tr>
                            {showTimeline && <th className="data-view__timeline-cell" />}
                            {selectable && (
                                <th className="data-view__checkbox">
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
                            {tableColumns.map(column => {
                                const colStyle: React.CSSProperties = {};
                                if (columnWidths[column.key]) colStyle.width = columnWidths[column.key];
                                if (column.minWidth) colStyle.minWidth = column.minWidth;
                                return (
                                    <th
                                        key={column.key}
                                        style={Object.keys(colStyle).length > 0 ? colStyle : undefined}
                                        className={column.sortable ? 'is-sortable' : ''}
                                        onClick={() => toggleSort(column)}
                                    >
                                        <span className="data-view__th-content">
                                            <span>{column.header}</span>
                                            {column.sortable && <SortIcon state={sortKey === column.key ? sortDirection : 'unsorted'} />}
                                        </span>
                                        <span
                                            className="data-view__resizer"
                                            onMouseDown={event => handleResizeStart(event, column.key)}
                                            onClick={event => event.stopPropagation()}
                                        />
                                    </th>
                                );
                            })}
                            {actions && (
                                <th className="data-view__actions-header" style={actionsWidth ? { width: actionsWidth } : undefined}>
                                    Actions
                                </th>
                            )}
                        </tr>

                        {/* ── Filter row (only when at least one column has a filter) ── */}
                        {hasFilters && (
                            <tr className="data-view__filter-row">
                                {showTimeline && <td className="data-view__filter-cell data-view__filter-cell--spacer" />}
                                {selectable && <td className="data-view__filter-cell data-view__filter-cell--spacer" />}
                                {tableColumns.map(column => (
                                    <td
                                        key={column.key}
                                        className="data-view__filter-cell"
                                        style={columnWidths[column.key] ? { width: columnWidths[column.key] } : undefined}
                                    >
                                        {column.filter ?? null}
                                    </td>
                                ))}
                                {actions && <td className="data-view__filter-cell data-view__filter-cell--spacer" />}
                            </tr>
                        )}
                    </thead>
                    <tbody>
                        {(() => {
                            if (pagedData.length === 0) {
                                return (
                                    <tr>
                                        <td
                                            colSpan={tableColumns.length + (showTimeline ? 1 : 0) + (selectable ? 1 : 0) + (actions ? 1 : 0)}
                                            className="data-view__empty"
                                        >
                                            {empty ? (
                                                <EmptyState
                                                    title={empty.title}
                                                    description={empty.description}
                                                    icon={empty.icon}
                                                    primaryAction={empty.primaryAction}
                                                    secondaryAction={empty.secondaryAction}
                                                />
                                            ) : (
                                                <EmptyState title="No data available" />
                                            )}
                                        </td>
                                    </tr>
                                );
                            }

                            const totalCols = tableColumns.length + (showTimeline ? 1 : 0) + (selectable ? 1 : 0) + (actions ? 1 : 0);
                            const showGroupCount = group?.showCount !== false;

                            const renderTableRow = (row: T, index: number) => {
                                const rowId = resolvedRowKey(row, index);
                                const isSelected = selectedIds.includes(rowId);
                                const marker = tableTimelineMarkers.get(index);
                                return (
                                    <tr
                                        key={rowId}
                                        className={`${isSelected ? 'is-selected' : ''} ${onRowClick ? 'data-view__row--clickable' : ''} ${rowClassName?.(row) || ''}`}
                                        onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    >
                                        {showTimeline && <td className="data-view__timeline-cell">{marker && <TimelineMarkerDot marker={marker} />}</td>}
                                        {selectable && (
                                            <td className="data-view__checkbox">
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
                                        {tableColumns.map(column => (
                                            <td key={column.key} style={columnWidths[column.key] ? { width: columnWidths[column.key] } : undefined}>
                                                {column.accessor ? column.accessor(row) : (row as Record<string, React.ReactNode>)[column.key]}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="data-view__actions-cell" style={actionsWidth ? { width: actionsWidth } : undefined}>
                                                <div className="data-view__table-actions" onClick={e => e.stopPropagation()}>
                                                    {actions(row)}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            };

                            if (computedGroups) {
                                let runningIndex = 0;
                                return computedGroups.map(grp => {
                                    const startIndex = runningIndex;
                                    runningIndex += grp.items.length;
                                    return (
                                        <React.Fragment key={grp.key ?? '__null__'}>
                                            <tr className="data-view__group-row">
                                                <td colSpan={totalCols} className="data-view__group-cell">
                                                    <span className="data-view__group-label">{grp.label}</span>
                                                    {showGroupCount && <span className="data-view__group-count">{grp.items.length}</span>}
                                                </td>
                                            </tr>
                                            {grp.items.map((row, i) => renderTableRow(row, startIndex + i))}
                                        </React.Fragment>
                                    );
                                });
                            }

                            return pagedData.map((row, index) => renderTableRow(row, index));
                        })()}
                    </tbody>
                </table>
            </div>

            {!isGrouped && (
                <Pagination
                    currentPage={safeCurrentPage}
                    totalPages={totalPages}
                    totalItems={sortedData.length}
                    onPageChange={handlePageChange}
                    pageSizeOptions={showPageSize ? pageSizeOptions : undefined}
                    pageSize={showPageSize ? pageSize : undefined}
                    onPageSizeChange={
                        showPageSize
                            ? nextSize => {
                                  setPageSize(nextSize);
                                  handlePageChange(1);
                              }
                            : undefined
                    }
                />
            )}
        </>
    );

    return (
        <div className={`data-view${className ? ` ${className}` : ''}`}>
            {showTimeline ? (
                <div className="timeline-markers">
                    <div className="timeline-markers__track" />
                    {tableContent}
                </div>
            ) : (
                tableContent
            )}
        </div>
    );
}
