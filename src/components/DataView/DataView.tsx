import React, { useMemo, useState } from 'react';

import { getResultsCount } from '../../helpers/Pagination';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { Pagination } from '../Pagination';
import { calculateTimelineMarkers, TimelineMarkerDot, type TimelineMarkerInfo, type TimelineMarkersItem } from '../TimelineMarkers';

import { CardView, DEFAULT_PAGE_SIZES, getColumnLabel, renderCellContent, renderColumnLabel } from './DataView.CardView';
import { DataViewMiniSort } from './DataView.MiniSort';
import type { DataViewColumn, DataViewGroup, DataViewGroupKey, DataViewProps, SortDirection } from './DataView.types';

import './DataView.scss';

// Sort icon

interface SortIconProps {
    state: 'unsorted' | 'asc' | 'desc';
}

function SortIcon({ state }: SortIconProps) {
    return (
        <span className={`data-view__sort-icon data-view__sort-icon--${state}`} aria-hidden="true">
            <Icon name={state === 'asc' ? 'arrow-up' : state === 'desc' ? 'arrow-down' : 'arrow-bidirectional-vertical'} />
        </span>
    );
}

// DataView

export function DataView<T>({
    columns,
    data,
    rowKey,
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
    rowClassName,
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
}: DataViewProps<T>) {
    const { isMobile } = useBreakpoint();
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

    const resolvedRowKey = (row: T, index: number) => rowKey?.(row, index) ?? index;

    const handlePageChange = (page: number) => {
        if (controlledCurrentPage === undefined) {
            setInternalCurrentPage(page);
        }
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

    const isServerPaginated = controlledTotalItems !== undefined;
    const totalForPagination = isServerPaginated ? controlledTotalItems : sortedData.length;
    const totalPages = Math.max(1, Math.ceil(totalForPagination / pageSize));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    // When server-paginated, `data` is already the page slice, so skip client slicing.
    const pagedData = isServerPaginated ? sortedData : sortedData.slice((safeCurrentPage - 1) * pageSize, safeCurrentPage * pageSize);

    const resultsCountLabel = showResultsCount
        ? getResultsCount(pageSize, totalForPagination, totalCount ?? totalForPagination, safeCurrentPage, itemNoun)
        : null;
    const groupTotals = useMemo<Map<DataViewGroupKey, number> | null>(() => {
        if (!group) return null;
        const totals = new Map<DataViewGroupKey, number>();
        sortedData.forEach(row => {
            const key = group.groupBy(row);
            totals.set(key, (totals.get(key) ?? 0) + 1);
        });
        return totals;
    }, [group, sortedData]);

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
    const topControlsNode =
        resultsCountLabel || miniSortNode ? (
            <div className={`data-view__top-row data-view__top-row--mini-${miniSortAlign}`}>
                {resultsCountLabel && <div className="data-view__results-count">{resultsCountLabel}</div>}
                {miniSortNode}
            </div>
        ) : null;

    // Card mode

    if (desktopView === 'cards') {
        return (
            <div className={`data-view data-view--cards${className ? ` ${className}` : ''}`}>
                {topControlsNode}
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
                            <Icon name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} />
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
                    groups={computedGroups ?? undefined}
                    showGroupCount={group?.showCount !== false}
                    collapsible={group?.collapsible}
                    collapsedGroups={collapsedGroups}
                    onToggleGroup={toggleGroup}
                    onToggleSelect={(rowId, checked) => {
                        if (checked) {
                            updateSelection([...selectedIds, rowId]);
                        } else {
                            updateSelection(selectedIds.filter(id => id !== rowId));
                        }
                    }}
                />

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
                                  setPageSize(nextSize);
                                  handlePageChange(1);
                                  onPageSizeChange?.(nextSize);
                              }
                            : undefined
                    }
                />
            </div>
        );
    }

    // Table mode (desktop)

    const tableColumns = columns.filter(col => !col.hideInTable);
    const allSelected = selectable && selectedIds.length > 0 && selectedIds.length === data.length;
    const partiallySelected = selectable && selectedIds.length > 0 && selectedIds.length < data.length;
    const showTimeline = timeline && tableTimelineMarkers.size > 0;

    const tableContent = (
        <>
            {topControlsNode}
            <div className="data-view__wrapper">
                <table>
                    <thead>
                        {/* Column header row */}
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
                                            {renderColumnLabel(column)}
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

                        {/* Filter row (only when at least one column has a filter) */}
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
                                                    primary={empty.primary}
                                                    secondary={empty.secondary}
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
                                                {renderCellContent(column, row)}
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
                                    const isCollapsed = group?.collapsible && collapsedGroups.has(grp.key);
                                    return (
                                        <React.Fragment key={grp.key ?? '__null__'}>
                                            <tr
                                                className={`data-view__group-row${group?.collapsible ? ' data-view__group-row--collapsible' : ''}`}
                                                onClick={group?.collapsible ? () => toggleGroup(grp.key) : undefined}
                                            >
                                                <td colSpan={totalCols} className="data-view__group-cell">
                                                    <span className="data-view__group-label">{grp.label}</span>
                                                    {showGroupCount && <span className="data-view__group-count">{grp.totalCount}</span>}
                                                    {group?.collapsible && (
                                                        <Icon className="data-view__group-chevron" name={isCollapsed ? 'caret-down' : 'caret-up'} size="sm" />
                                                    )}
                                                </td>
                                            </tr>
                                            {!isCollapsed && grp.items.map((row, i) => renderTableRow(row, startIndex + i))}
                                        </React.Fragment>
                                    );
                                });
                            }

                            return pagedData.map((row, index) => renderTableRow(row, index));
                        })()}
                    </tbody>
                </table>
            </div>

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
                              onPageSizeChange?.(nextSize);
                          }
                        : undefined
                }
            />
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

