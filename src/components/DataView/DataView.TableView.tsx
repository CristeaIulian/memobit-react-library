import React from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { Checkbox } from '../Checkbox';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { TimelineMarkerDot, type TimelineMarkerInfo } from '../TimelineMarkers';
import { Tooltip } from '../Tooltip';

import { detailMotionKey, groupMotionKey, renderCellContent, renderColumnLabel } from './DataView.helpers';
import type { DataViewColumn, DataViewEmptyConfig, DataViewGroup, DataViewGroupConfig, DataViewGroupKey, SortDirection } from './DataView.types';

// ─── Sort icon ───────────────────────────────────────────────────────────────

interface SortIconProps {
    state: 'unsorted' | 'asc' | 'desc';
}

function SortIcon({ state }: SortIconProps) {
    return (
        <span className={`data-view__sort-icon data-view__sort-icon--${state}`}>
            <Icon name={state === 'asc' ? 'arrow-up' : state === 'desc' ? 'arrow-down' : 'arrow-bidirectional-vertical'} />
        </span>
    );
}

// ─── Table View ──────────────────────────────────────────────────────────────

export interface TableViewProps<T> {
    data: T[];
    /** Already narrowed to the columns the table shows. */
    columns: DataViewColumn<T>[];
    rowKey: (row: T, index: number) => string | number;
    columnWidths: Record<string, number>;
    onResizeStart: (event: React.MouseEvent, columnKey: string) => void;
    sortKey: string | null;
    sortDirection: SortDirection;
    onToggleSort: (column: DataViewColumn<T>) => void;
    hasFilters: boolean;
    showTimeline: boolean;
    timelineMarkers: Map<number, TimelineMarkerInfo>;
    selectable: boolean;
    selectedIds: Array<string | number>;
    allVisibleSelected: boolean;
    someVisibleSelected: boolean;
    onToggleVisibleSelection: (checked: boolean) => void;
    onToggleSelect: (rowId: string | number, checked: boolean) => void;
    pinnedSet: Set<string | number>;
    actions?: (row: T) => React.ReactNode;
    actionsWidth?: number;
    onRowClick?: (row: T, event?: React.MouseEvent) => void;
    rowHref?: (row: T) => string | undefined;
    rowClassName?: (row: T) => string;
    rowDetail?: (row: T) => React.ReactNode;
    empty?: DataViewEmptyConfig;
    groups: DataViewGroup<T>[] | null;
    group?: DataViewGroupConfig<T>;
    collapsedGroups: Set<DataViewGroupKey>;
    onToggleGroup: (key: DataViewGroupKey) => void;
}

export function TableView<T>({
    data,
    columns,
    rowKey,
    columnWidths,
    onResizeStart,
    sortKey,
    sortDirection,
    onToggleSort,
    hasFilters,
    showTimeline,
    timelineMarkers,
    selectable,
    selectedIds,
    allVisibleSelected,
    someVisibleSelected,
    onToggleVisibleSelection,
    onToggleSelect,
    pinnedSet,
    actions,
    actionsWidth,
    onRowClick,
    rowHref,
    rowClassName,
    rowDetail,
    empty,
    groups,
    group,
    collapsedGroups,
    onToggleGroup,
}: TableViewProps<T>) {
    const t = useMessages(libMessages);
    const totalCols = columns.length + (showTimeline ? 1 : 0) + (selectable ? 1 : 0) + (actions ? 1 : 0);
    const showGroupCount = group?.showCount !== false;

    const renderTableRow = (row: T, index: number) => {
        const rowId = rowKey(row, index);
        const isSelected = selectedIds.includes(rowId);
        const isPinned = pinnedSet.has(rowId);
        const marker = timelineMarkers.get(index);
        const href = rowHref?.(row);
        const isClickable = !!onRowClick || !!href;
        const handleTableRowClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
            // Modifier-click on a row with `href` should open a new tab,
            // matching the anchor card behaviour for tables.
            if (href && (e.metaKey || e.ctrlKey || e.shiftKey)) {
                window.open(href, '_blank', 'noopener,noreferrer');
                return;
            }
            if (onRowClick) {
                onRowClick(row, e);
                return;
            }
            // A <tr> can't be an anchor, so a plain click on an
            // href-only row previously did nothing at all — the row
            // looked interactive and wasn't. Follow the link the way
            // the card view's native anchor does when no onRowClick is
            // supplied. Consumers wanting client-side routing pass
            // onRowClick and are handled above.
            if (href) window.location.assign(href);
        };
        const handleTableRowAuxClick = (e: React.MouseEvent<HTMLTableRowElement>) => {
            // Middle-click — browser doesn't do anything by default on a
            // <tr>, so open the row's href ourselves.
            if (e.button !== 1 || !href) return;
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        };
        const detail = rowDetail?.(row);
        return (
            <React.Fragment key={rowId}>
                <tr
                    className={`${isSelected ? 'is-selected' : ''} ${isClickable ? 'data-view__row--clickable' : ''} ${isPinned ? 'data-view__row--pinned' : ''} ${rowClassName?.(row) || ''}`}
                    data-motion-key={rowId}
                    onClick={isClickable ? handleTableRowClick : undefined}
                    onAuxClick={href ? handleTableRowAuxClick : undefined}
                >
                    {showTimeline && <td className="data-view__timeline-cell">{marker && <TimelineMarkerDot marker={marker} />}</td>}
                    {selectable && (
                        <td className="data-view__checkbox" onClick={e => e.stopPropagation()}>
                            <Checkbox checked={isSelected} onChange={checked => onToggleSelect(rowId, checked)} />
                        </td>
                    )}
                    {columns.map((column, columnIndex) => (
                        <td key={column.key} style={columnWidths[column.key] ? { width: columnWidths[column.key] } : undefined}>
                            {columnIndex === 0 && isPinned && (
                                <Tooltip title={t.pinned}>
                                    <Icon className="data-view__pin-indicator" name="pin" size="sm" />
                                </Tooltip>
                            )}
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
                {detail != null && detail !== false && (
                    <tr className="data-view__row-detail" data-motion-key={detailMotionKey(rowId)}>
                        <td colSpan={totalCols} onClick={e => e.stopPropagation()}>
                            {detail}
                        </td>
                    </tr>
                )}
            </React.Fragment>
        );
    };

    const renderBody = () => {
        if (data.length === 0) {
            return (
                <tr>
                    <td colSpan={totalCols} className="data-view__empty">
                        {empty ? (
                            <EmptyState
                                title={empty.title}
                                description={empty.description}
                                icon={empty.icon}
                                primary={empty.primary}
                                secondary={empty.secondary}
                            />
                        ) : (
                            <EmptyState title={t.noData} />
                        )}
                    </td>
                </tr>
            );
        }

        if (groups) {
            let runningIndex = 0;
            return groups.map(grp => {
                const startIndex = runningIndex;
                runningIndex += grp.items.length;
                const isCollapsed = group?.collapsible && collapsedGroups.has(grp.key);
                return (
                    <React.Fragment key={grp.key ?? '__null__'}>
                        <tr
                            className={`data-view__group-row${group?.collapsible ? ' data-view__group-row--collapsible' : ''}`}
                            data-motion-key={groupMotionKey(grp.key)}
                            onClick={group?.collapsible ? () => onToggleGroup(grp.key) : undefined}
                        >
                            <td colSpan={totalCols} className="data-view__group-cell">
                                <span className="data-view__group-label">{grp.label}</span>
                                {showGroupCount && (
                                    <span className="data-view__group-count">
                                        {/* A group that spans a page boundary shows how much of it is on this page. */}
                                        {grp.items.length === grp.totalCount ? grp.totalCount : t.groupPartCount(grp.items.length, grp.totalCount)}
                                    </span>
                                )}
                                {group?.collapsible && <Icon className="data-view__group-chevron" name={isCollapsed ? 'caret-down' : 'caret-up'} size="sm" />}
                            </td>
                        </tr>
                        {!isCollapsed && grp.items.map((row, i) => renderTableRow(row, startIndex + i))}
                    </React.Fragment>
                );
            });
        }

        return data.map((row, index) => renderTableRow(row, index));
    };

    return (
        <table>
            <thead>
                {/* Column header row */}
                <tr>
                    {showTimeline && <th className="data-view__timeline-cell" />}
                    {selectable && (
                        <th className="data-view__checkbox">
                            <Checkbox checked={allVisibleSelected} indeterminate={someVisibleSelected} onChange={onToggleVisibleSelection} />
                        </th>
                    )}
                    {columns.map(column => {
                        const colStyle: React.CSSProperties = {};
                        if (columnWidths[column.key]) colStyle.width = columnWidths[column.key];
                        if (column.minWidth) colStyle.minWidth = column.minWidth;
                        return (
                            <th
                                key={column.key}
                                style={Object.keys(colStyle).length > 0 ? colStyle : undefined}
                                className={column.sortable ? 'is-sortable' : ''}
                                onClick={() => onToggleSort(column)}
                            >
                                <span className="data-view__th-content">
                                    {renderColumnLabel(column)}
                                    {column.sortable && <SortIcon state={sortKey === column.key ? sortDirection : 'unsorted'} />}
                                </span>
                                <span
                                    className="data-view__resizer"
                                    onMouseDown={event => onResizeStart(event, column.key)}
                                    onClick={event => event.stopPropagation()}
                                />
                            </th>
                        );
                    })}
                    {actions && (
                        <th className="data-view__actions-header" style={actionsWidth ? { width: actionsWidth } : undefined}>
                            {t.actions}
                        </th>
                    )}
                </tr>

                {/* Filter row (only when at least one column has a filter) */}
                {hasFilters && (
                    <tr className="data-view__filter-row">
                        {showTimeline && <td className="data-view__filter-cell data-view__filter-cell--spacer" />}
                        {selectable && <td className="data-view__filter-cell data-view__filter-cell--spacer" />}
                        {columns.map(column => (
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
            <tbody>{renderBody()}</tbody>
        </table>
    );
}
