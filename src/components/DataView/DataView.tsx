import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { getResultsCount } from '../../helpers/Pagination';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useLanguage, useMessages } from '../../hooks/useLanguage';
import { useListMotion } from '../../hooks/useListMotion';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { Pagination } from '../Pagination';
import { calculateTimelineMarkers, type TimelineMarkerInfo, type TimelineMarkersItem } from '../TimelineMarkers';
import { Tooltip } from '../Tooltip';

import { CardView } from './DataView.CardView';
import { DataViewColumnSelector } from './DataView.ColumnSelector';
import { DEFAULT_PAGE_SIZES, getColumnLabel } from './DataView.helpers';
import { DataViewMiniSort } from './DataView.MiniSort';
import { TableView } from './DataView.TableView';
import type { DataViewColumn, DataViewGroup, DataViewGroupKey, DataViewProps, SortDirection } from './DataView.types';

import './DataView.scss';

// DataView

export function DataView<T>({
    columns,
    data,
    rowKey,
    pinnedIds,
    selectable = false,
    onSelectionChange,
    selectedIds: controlledSelectedIds,
    pageSizeOptions = DEFAULT_PAGE_SIZES,
    initialPageSize = DEFAULT_PAGE_SIZES[1],
    showPageSize = true,
    card,
    actions,
    actionsWidth,
    timeline,
    onRowClick,
    rowHref,
    rowClassName,
    rowDetail,
    empty,
    initialSortKey = null,
    initialSortDirection = 'asc',
    sortKey: controlledSortKey,
    sortDirection: controlledSortDirection,
    onSortChange,
    miniSort,
    showCardSortControls = true,
    desktopView = 'table',
    cardMaxWidth,
    className,
    onPageChange,
    onPageSizeChange,
    currentPage: controlledCurrentPage,
    totalItems: controlledTotalItems,
    group,
    showResultsCount = true,
    totalCount,
    itemNoun,
    columnSelector,
    animateChanges = true,
    highlightIds,
}: DataViewProps<T>) {
    const t = useMessages(libMessages);
    const { language } = useLanguage();
    const { isMobile } = useBreakpoint();
    const rootRef = useRef<HTMLDivElement>(null);
    // Index keys shift on every insert and delete, so without `rowKey` there is nothing stable to track.
    const motion = useListMotion(rootRef, { enabled: animateChanges && rowKey !== undefined, highlightKeys: highlightIds });
    const [uncontrolledSortKey, setUncontrolledSortKey] = useState<string | null>(initialSortKey);
    const [uncontrolledSortDirection, setUncontrolledSortDirection] = useState<SortDirection>(initialSortDirection);
    const [internalSelectedIds, setInternalSelectedIds] = useState<Array<string | number>>([]);
    const selectedIds = controlledSelectedIds ?? internalSelectedIds;
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const currentPage = controlledCurrentPage ?? internalCurrentPage;
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
    const [collapsedGroups, setCollapsedGroups] = useState<Set<DataViewGroupKey>>(new Set());

    const toggleGroup = (key: DataViewGroupKey) => {
        // A whole group opening or closing is over the motion limits, but the user asked for it.
        motion.forceNext();
        setCollapsedGroups(prev => {
            const next = new Set(prev);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    };

    const resolvedRowKey = useCallback((row: T, index: number) => rowKey?.(row, index) ?? index, [rowKey]);

    const handlePageChange = useCallback(
        (page: number) => {
            // Another page is a different list, not a change to this one.
            if (page !== currentPage) motion.skipNext();
            if (controlledCurrentPage === undefined) {
                setInternalCurrentPage(page);
            }
            onPageChange?.(page);
        },
        [controlledCurrentPage, currentPage, motion, onPageChange]
    );

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

    const pinnedSet = useMemo(() => new Set(pinnedIds ?? []), [pinnedIds]);

    const sortedData = useMemo(() => {
        let base: T[] = data;

        if (sortKey) {
            const column = columns.find(col => col.key === sortKey);
            if (column) {
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

                base = sortDirection === 'asc' ? sorted : sorted.reverse();
            }
        }

        if (pinnedSet.size === 0) return base;

        const pinnedRows: T[] = [];
        const unpinnedRows: T[] = [];
        base.forEach((row, index) => {
            if (pinnedSet.has(resolvedRowKey(row, index))) {
                pinnedRows.push(row);
            } else {
                unpinnedRows.push(row);
            }
        });

        if (pinnedIds && pinnedIds.length > 1 && pinnedRows.length > 1) {
            const orderMap = new Map(pinnedIds.map((id, i) => [id, i]));
            pinnedRows.sort((a, b) => {
                const aOrder = orderMap.get(resolvedRowKey(a, 0)) ?? 0;
                const bOrder = orderMap.get(resolvedRowKey(b, 0)) ?? 0;
                return aOrder - bOrder;
            });
        }

        return [...pinnedRows, ...unpinnedRows];
    }, [columns, data, sortDirection, sortKey, pinnedSet, pinnedIds, resolvedRowKey]);

    const isServerPaginated = controlledTotalItems !== undefined;

    /**
     * With grouping on, rows have to be laid out group-by-group *before* the page slice.
     * Sorting only orders by the sort column, and sortGroups only reorders headers within
     * whatever rows a page happens to contain — so an ungrouped slice interleaves groups,
     * the same group reappears on later pages, and its header count (which is global)
     * disagrees with the handful of rows actually rendered under it.
     *
     * Server-paginated data is already a page slice; reordering it here would be wrong.
     */
    const orderedData = useMemo<T[]>(() => {
        if (!group || isServerPaginated) return sortedData;

        const buckets = new Map<DataViewGroupKey, T[]>();
        const order: DataViewGroupKey[] = [];

        sortedData.forEach(row => {
            const key = group.groupBy(row);
            const existing = buckets.get(key);
            if (existing) {
                existing.push(row);
            } else {
                buckets.set(key, [row]);
                order.push(key);
            }
        });

        const entries: DataViewGroup<T>[] = order.map(key => {
            const items = buckets.get(key) as T[];
            return { key, label: group.groupLabel(key), items, totalCount: items.length };
        });

        if (group.sortGroups) {
            entries.sort(group.sortGroups);
        } else {
            entries.sort((a, b) => {
                if (a.key === null) return 1;
                if (b.key === null) return -1;
                return 0;
            });
        }

        return entries.flatMap(entry => entry.items);
    }, [group, isServerPaginated, sortedData]);

    const totalForPagination = isServerPaginated ? controlledTotalItems : orderedData.length;
    const totalPages = Math.max(1, Math.ceil(totalForPagination / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    // When server-paginated, `data` is already the page slice, so skip client slicing.
    const pagedData = isServerPaginated ? orderedData : orderedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    // A highlighted row on another page is paged to, so the flash has something to land on.
    // Waits for the row when the highlight arrives ahead of the data that holds it.
    const pagedToHighlightRef = useRef<typeof highlightIds>(undefined);
    useEffect(() => {
        if (!highlightIds || highlightIds.length === 0 || isServerPaginated || pagedToHighlightRef.current === highlightIds) return;
        const index = orderedData.findIndex((row, i) => highlightIds.includes(resolvedRowKey(row, i)));
        if (index === -1) return;
        pagedToHighlightRef.current = highlightIds;
        const page = Math.floor(index / pageSize) + 1;
        if (page !== safeCurrentPage) handlePageChange(page);
    }, [handlePageChange, highlightIds, isServerPaginated, orderedData, pageSize, resolvedRowKey, safeCurrentPage]);

    const resultsCountLabel = showResultsCount
        ? getResultsCount(pageSize, totalForPagination, totalCount ?? totalForPagination, safeCurrentPage, itemNoun, language)
        : null;
    const groupTotals = useMemo<Map<DataViewGroupKey, number> | null>(() => {
        if (!group) return null;
        const totals = new Map<DataViewGroupKey, number>();
        orderedData.forEach(row => {
            const key = group.groupBy(row);
            totals.set(key, (totals.get(key) ?? 0) + 1);
        });
        return totals;
    }, [group, orderedData]);

    const computedGroups = useMemo<DataViewGroup<T>[] | null>(() => {
        if (!group || !groupTotals) return null;
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
            totalCount: groupTotals.get(key) ?? 0,
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
    }, [group, groupTotals, pagedData]);

    // Timeline markers for table mode. Must be called before any conditional return.
    const tableTimelineMarkers = useMemo(() => {
        if (!timeline) return new Map<number, TimelineMarkerInfo>();
        const items: TimelineMarkersItem[] = pagedData.map(row => ({
            id: timeline.idAccessor(row),
            date: timeline.dateAccessor(row),
        }));
        return calculateTimelineMarkers(items, timeline.granularity);
    }, [pagedData, timeline]);

    const updateSelection = (nextIds: Array<string | number>) => {
        if (controlledSelectedIds === undefined) {
            setInternalSelectedIds(nextIds);
        }
        onSelectionChange?.(data.filter((row, index) => nextIds.includes(resolvedRowKey(row, index))));
    };

    const toggleRowSelection = (rowId: string | number, checked: boolean) => {
        if (checked) {
            updateSelection([...selectedIds, rowId]);
        } else {
            updateSelection(selectedIds.filter(id => id !== rowId));
        }
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
    const miniSortAlign = miniSort?.align ?? 'left';
    const hasMiniSort = (miniSort?.columns ?? miniSort?.column ?? []).length > 0;
    const miniSortNode = hasMiniSort ? (
        <DataViewMiniSort columns={columns} config={miniSort} sortKey={sortKey} sortDirection={sortDirection} onSort={updateSort} />
    ) : null;
    const columnSelectorNode = columnSelector && columnSelector.options.length > 0 ? <DataViewColumnSelector config={columnSelector} /> : null;

    // Select-all covers the rows on screen, never the whole filtered set: with pagination
    // on, a bulk edit that silently reached pages the user never saw would be a trap.
    const visibleKeys = pagedData.map(resolvedRowKey);
    const selectedVisibleCount = visibleKeys.filter(key => selectedIds.includes(key)).length;
    const allVisibleSelected = Boolean(selectable) && visibleKeys.length > 0 && selectedVisibleCount === visibleKeys.length;
    const someVisibleSelected = Boolean(selectable) && selectedVisibleCount > 0 && selectedVisibleCount < visibleKeys.length;

    const toggleVisibleSelection = (checked: boolean): void => {
        if (checked) {
            // Keeps anything already picked on another page rather than discarding it.
            updateSelection([...selectedIds, ...visibleKeys.filter(key => !selectedIds.includes(key))]);
        } else {
            updateSelection(selectedIds.filter(key => !visibleKeys.includes(key)));
        }
    };

    // Card mode has no header row to hang a select-all off, so it gets an explicit control.
    const selectAllNode =
        selectable && visibleKeys.length > 0 ? (
            <label className="data-view__select-all">
                <Checkbox checked={allVisibleSelected} indeterminate={someVisibleSelected} onChange={toggleVisibleSelection} />
                <span>{allVisibleSelected ? t.clearSelection : t.selectThese(visibleKeys.length)}</span>
            </label>
        ) : null;
    const buildTopControls = (extra?: React.ReactNode): React.ReactNode =>
        resultsCountLabel || miniSortNode || columnSelectorNode || extra ? (
            <div className={`data-view__top-row data-view__top-row--mini-${miniSortAlign}`}>
                {resultsCountLabel && <div className="data-view__results-count">{resultsCountLabel}</div>}
                {extra}
                {miniSortNode}
                {columnSelectorNode}
            </div>
        ) : null;

    const topControlsNode = buildTopControls();

    const paginationNode = (
        <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            totalItems={totalForPagination}
            onPageChange={handlePageChange}
            pageSizeOptions={showPageSize ? pageSizeOptions : undefined}
            pageSize={showPageSize ? pageSize : undefined}
            onPageSizeChange={
                showPageSize
                    ? nextSize => {
                          motion.skipNext();
                          setPageSize(nextSize);
                          handlePageChange(1);
                          onPageSizeChange?.(nextSize);
                      }
                    : undefined
            }
        />
    );

    // No-columns guard — renders an empty state but keeps the column selector
    // visible so the user can re-enable a column. Card mode is driven by the
    // `card` prop, not `columns`, so an empty `columns` array is valid there.

    if (desktopView !== 'cards' && columns.length === 0) {
        return (
            <div className={`data-view${className ? ` ${className}` : ''}`} ref={rootRef}>
                {topControlsNode}
                <div className="data-view__wrapper data-view__wrapper--empty">
                    <EmptyState title={t.noColumnsTitle} description={t.noColumnsHint} />
                </div>
            </div>
        );
    }

    // Card mode

    if (desktopView === 'cards') {
        return (
            <div className={`data-view data-view--cards${className ? ` ${className}` : ''}`} ref={rootRef}>
                {buildTopControls(selectAllNode)}
                {showCardSortControls && hasSortControls && (
                    <div className="data-view__card-sort-bar">
                        <div className="data-view__card-sort-field">
                            <Dropdown
                                name="data-view-card-sort"
                                label={t.sortBy}
                                options={sortOptions}
                                value={sortKey}
                                placeholder={t.sortByPlaceholder}
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
                        <Tooltip title={sortDirection === 'asc' ? t.sortDescending : t.sortAscending}>
                            <Button
                                className="data-view__card-sort-direction"
                                disabled={!activeSortColumn}
                                onClick={() => {
                                    if (!activeSortColumn) return;
                                    updateSort(activeSortColumn.key, sortDirection === 'asc' ? 'desc' : 'asc');
                                }}
                                variant="ghost"
                            >
                                <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
                            </Button>
                        </Tooltip>
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
                    rowHref={rowHref}
                    rowClassName={rowClassName}
                    empty={empty}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    pinnedIds={pinnedIds}
                    cardMaxWidth={cardMaxWidth}
                    isMobile={isMobile}
                    groups={computedGroups ?? undefined}
                    showGroupCount={group?.showCount !== false}
                    collapsible={group?.collapsible}
                    collapsedGroups={collapsedGroups}
                    onToggleGroup={toggleGroup}
                    onToggleSelect={toggleRowSelection}
                />

                {paginationNode}
            </div>
        );
    }

    // Table mode (desktop)

    // Every header, filter cell, body cell and colSpan below derives from this list, so it is
    // the single place a column drops out. Sorting resolves against the full `columns`, so a
    // sort key on a mobile-hidden column keeps ordering the rows.
    const tableColumns = columns.filter(col => !col.hideInTable && !(isMobile && col.hideInMobile));
    const showTimeline = timeline && tableTimelineMarkers.size > 0;

    const tableContent = (
        <>
            {topControlsNode}
            <div className="data-view__wrapper">
                <TableView
                    data={pagedData}
                    columns={tableColumns}
                    rowKey={resolvedRowKey}
                    columnWidths={columnWidths}
                    onResizeStart={handleResizeStart}
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    onToggleSort={toggleSort}
                    hasFilters={hasFilters}
                    showTimeline={Boolean(showTimeline)}
                    timelineMarkers={tableTimelineMarkers}
                    selectable={selectable}
                    selectedIds={selectedIds}
                    allVisibleSelected={allVisibleSelected}
                    someVisibleSelected={someVisibleSelected}
                    onToggleVisibleSelection={toggleVisibleSelection}
                    onToggleSelect={toggleRowSelection}
                    pinnedSet={pinnedSet}
                    actions={actions}
                    actionsWidth={actionsWidth}
                    onRowClick={onRowClick}
                    rowHref={rowHref}
                    rowClassName={rowClassName}
                    rowDetail={rowDetail}
                    empty={empty}
                    groups={computedGroups}
                    group={group}
                    collapsedGroups={collapsedGroups}
                    onToggleGroup={toggleGroup}
                />
            </div>

            {paginationNode}
        </>
    );

    return (
        <div className={`data-view${className ? ` ${className}` : ''}`} ref={rootRef}>
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
