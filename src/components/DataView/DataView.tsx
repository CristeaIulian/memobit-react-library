import React, { useMemo, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Checkbox } from '../Checkbox';
import { EmptyState, type EmptyStateProps } from '../EmptyState';
import { Pagination } from '../Pagination';
import { calculateTimelineMarkers, TimelineMarkerDot, type TimelineMarkerInfo, type TimelineMarkersItem, TimelineMobileSeparator } from '../TimelineMarkers';

import './DataView.scss';

// ─── Types ───────────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc';

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
    responsive?: boolean;
    className?: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZES = [5, 10, 20, 50];

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
}: CardViewProps<T>) {
    const cardColumns = columns.filter(col => !col.hideInCard);

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

    return (
        <div className="data-view__cards">
            {data.map((row, index) => {
                const marker = timelineMarkers.get(index);
                const rowId = rowKey(row, index);
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
            })}
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
    responsive = true,
    className,
}: DataViewProps<T>) {
    const { isMobile } = useBreakpoint();
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
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
            setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column.key);
            setSortDirection('asc');
        }
        setCurrentPage(1);
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

    // ── Card mode (mobile) ───────────────────────────────────────────────────

    const showCards = responsive && isMobile;

    if (showCards) {
        return (
            <div className={`data-view data-view--cards${className ? ` ${className}` : ''}`}>
                {hasFilters && (
                    <div className="data-view__filter-bar">
                        {columns
                            .filter(col => col.filter)
                            .map(col => (
                                <div key={col.key} className="data-view__filter-bar-item">
                                    {typeof col.header === 'string' && <span className="data-view__filter-bar-label">{col.header}</span>}
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
                    totalItems={sortedData.length}
                    onPageChange={setCurrentPage}
                    pageSizeOptions={showPageSize ? pageSizeOptions : undefined}
                    pageSize={showPageSize ? pageSize : undefined}
                    onPageSizeChange={
                        showPageSize
                            ? nextSize => {
                                  setPageSize(nextSize);
                                  setCurrentPage(1);
                              }
                            : undefined
                    }
                />
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
                            {tableColumns.map(column => (
                                <th
                                    key={column.key}
                                    style={columnWidths[column.key] ? { width: columnWidths[column.key] } : undefined}
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
                            ))}
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
                        {pagedData.length === 0 ? (
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
                        ) : (
                            pagedData.map((row, index) => {
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
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                totalItems={sortedData.length}
                onPageChange={setCurrentPage}
                pageSizeOptions={showPageSize ? pageSizeOptions : undefined}
                pageSize={showPageSize ? pageSize : undefined}
                onPageSizeChange={
                    showPageSize
                        ? nextSize => {
                              setPageSize(nextSize);
                              setCurrentPage(1);
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
