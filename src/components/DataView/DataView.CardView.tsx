import React, { useMemo } from 'react';

import { Checkbox } from '../Checkbox';
import { EmptyState } from '../EmptyState';
import { Icon } from '../Icon';
import { calculateTimelineMarkers, TimelineMobileSeparator, type TimelineMarkerInfo, type TimelineMarkersItem } from '../TimelineMarkers';

import type { DataViewCardConfig, DataViewColumn, DataViewEmptyConfig, DataViewGroup, DataViewGroupKey, DataViewTimelineConfig } from './DataView.types';

// ─── Constants & helpers ─────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZES = [15, 30, 50, 100, 250, 500];

export const getColumnLabel = <T,>(column: DataViewColumn<T>) => (typeof column.header === 'string' ? column.header : column.key);

const getCardMaxWidthValue = (cardMaxWidth: number | string) => (typeof cardMaxWidth === 'number' ? `${cardMaxWidth}px` : cardMaxWidth);

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

// ─── Card View ───────────────────────────────────────────────────────────────

export interface CardViewProps<T> {
    data: T[];
    columns: DataViewColumn<T>[];
    rowKey: (row: T, index: number) => string | number;
    card?: DataViewCardConfig<T>;
    actions?: (row: T) => React.ReactNode;
    timeline?: DataViewTimelineConfig<T>;
    onRowClick?: (row: T, event?: React.MouseEvent) => void;
    rowHref?: (row: T) => string | undefined;
    rowClassName?: (row: T) => string;
    empty?: DataViewEmptyConfig;
    selectable?: boolean;
    selectedIds?: Array<string | number>;
    pinnedIds?: Array<string | number>;
    onToggleSelect?: (rowId: string | number, checked: boolean) => void;
    cardMaxWidth?: number | string;
    isMobile?: boolean;
    groups?: DataViewGroup<T>[];
    showGroupCount?: boolean;
    collapsible?: boolean;
    collapsedGroups?: Set<DataViewGroupKey>;
    onToggleGroup?: (key: DataViewGroupKey) => void;
}

export function CardView<T>({
    data,
    columns,
    rowKey,
    card,
    actions,
    timeline,
    onRowClick,
    rowHref,
    rowClassName,
    empty,
    selectable,
    selectedIds = [],
    pinnedIds,
    onToggleSelect,
    cardMaxWidth,
    isMobile = false,
    groups,
    showGroupCount = true,
    collapsible = false,
    collapsedGroups,
    onToggleGroup,
}: CardViewProps<T>) {
    const cardColumns = columns.filter(col => !col.hideInCard && !(isMobile && col.hideInMobile));
    const pinnedSet = useMemo(() => new Set(pinnedIds ?? []), [pinnedIds]);
    const cardsClassName = `data-view__cards${cardMaxWidth !== undefined ? ' data-view__cards--grid' : ''}`;
    const cardsStyle = cardMaxWidth !== undefined ? ({ '--data-view-card-max-width': getCardMaxWidthValue(cardMaxWidth) } as React.CSSProperties) : undefined;

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
            return <EmptyState title={empty.title} description={empty.description} icon={empty.icon} primary={empty.primary} secondary={empty.secondary} />;
        }
        return <EmptyState title="No data available" />;
    }

    const renderRow = (row: T, index: number) => {
        const marker = timelineMarkers.get(index);
        const rowId = rowKey(row, index);
        const isSelected = selectable && selectedIds.includes(rowId);
        const isPinned = pinnedSet.has(rowId);
        const href = rowHref?.(row);
        const isClickable = !!onRowClick || !!href;
        const cardClass = `data-view__card ${isClickable ? 'data-view__card--clickable' : ''} ${isSelected ? 'data-view__card--selected' : ''} ${isPinned ? 'data-view__card--pinned' : ''} ${rowClassName?.(row) || ''}`;

        // When `rowHref` is set, render the card as an <a> so middle-click,
        // Ctrl/Cmd-click and "Open link in new tab" work natively. Plain
        // left-click is intercepted so the host can keep client-side routing.
        const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            if (onRowClick) {
                e.preventDefault();
                onRowClick(row, e);
            }
        };

        const cardInner = (
            <>
                {isPinned && (
                    <span className="data-view__card-pin" title="Pinned">
                        <Icon name="pin" size="sm" />
                    </span>
                )}
                {selectable && onToggleSelect && (
                    <div className="data-view__card-select" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={isSelected || false} onChange={checked => onToggleSelect(rowId, checked)} />
                    </div>
                )}
                {card?.media && (
                    <div className="data-view__card-media">{card.media(row)}</div>
                )}
                {card && (() => {
                    const cardIcon = card.icon?.(row);
                    return (
                        <div className="data-view__card-header">
                            <div className="data-view__card-title-row">
                                <div className="data-view__card-title-line">
                                    {cardIcon && <Icon className="data-view__card-icon" name={cardIcon} />}
                                    <span className="data-view__card-title">{card.title(row)}</span>
                                </div>
                                {card.subtitle && <span className="data-view__card-subtitle">{card.subtitle(row)}</span>}
                            </div>
                            {card.badges && <div className="data-view__card-badges">{card.badges(row)}</div>}
                        </div>
                    );
                })()}

                {cardColumns.length > 0 && (
                    <div className="data-view__card-body">
                        {cardColumns.map(col => (
                            <div key={col.key} className="data-view__card-field">
                                <span className="data-view__card-label">{renderColumnLabel(col)}</span>
                                <span className="data-view__card-value">
                                    {renderCellContent(col, row)}
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
            </>
        );

        return (
            <React.Fragment key={rowId}>
                {marker && <TimelineMobileSeparator marker={marker} />}
                {href ? (
                    <a className={cardClass} href={href} onClick={handleAnchorClick}>
                        {cardInner}
                    </a>
                ) : (
                    <div
                        className={cardClass}
                        onClick={onRowClick ? (e) => onRowClick(row, e) : undefined}
                    >
                        {cardInner}
                    </div>
                )}
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
                    const isCollapsed = collapsible && collapsedGroups?.has(group.key);
                    return (
                        <section key={group.key ?? '__null__'} className="data-view__group">
                            <header
                                className={`data-view__group-header${collapsible ? ' data-view__group-header--collapsible' : ''}`}
                                onClick={collapsible ? () => onToggleGroup?.(group.key) : undefined}
                            >
                                <span className="data-view__group-label">{group.label}</span>
                                {showGroupCount && <span className="data-view__group-count">{group.totalCount}</span>}
                                {collapsible && <Icon className="data-view__group-chevron" name={isCollapsed ? 'caret-down' : 'caret-up'} size="sm" />}
                            </header>
                            {!isCollapsed && (
                                <div className={cardsClassName} style={cardsStyle}>
                                    {group.items.map((row, i) => renderRow(row, startIndex + i))}
                                </div>
                            )}
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
