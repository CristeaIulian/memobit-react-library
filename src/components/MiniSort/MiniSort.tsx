import React from 'react';

import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';
import { Tooltip } from '../Tooltip';

import './MiniSort.scss';

export type MiniSortDirection = 'asc' | 'desc';
export type MiniSortAlign = 'left' | 'center' | 'right';

export interface MiniSortItem {
    value: string;
    label?: React.ReactNode;
    icon?: IconName;
    /** Fixed direction for this item. Used only when `showDirectionToggle` is false. */
    direction?: MiniSortDirection;
    disabled?: boolean;
}

export interface MiniSortProps {
    items: MiniSortItem[];
    sortKey: string | null;
    sortDirection: MiniSortDirection;
    onSort: (value: string, direction: MiniSortDirection) => void;
    align?: MiniSortAlign;
    /** Render a trailing button that flips the active sort direction. */
    showDirectionToggle?: boolean;
    className?: string;
}

export const MiniSort: React.FC<MiniSortProps> = ({
    items,
    sortKey,
    sortDirection,
    onSort,
    align = 'left',
    showDirectionToggle = false,
    className = '',
}) => {
    if (items.length === 0) {
        return null;
    }

    const classes = ['mini-sort', `mini-sort--align-${align}`, className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {items.map((item, index) => {
                const itemDirection = item.direction ?? 'asc';
                const isActive = showDirectionToggle ? sortKey === item.value : sortKey === item.value && sortDirection === itemDirection;
                const labelText = typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : item.value;
                const directionLabel = showDirectionToggle ? '' : ` ${itemDirection === 'asc' ? 'ascending' : 'descending'}`;

                return (
                    <Tooltip key={`${item.value}-${index}`} title={`Sort by ${labelText}${directionLabel}`}>
                        <Button
                            className={`mini-sort__button${isActive ? ' is-active' : ''}`}
                            disabled={item.disabled}
                            icon={
                                item.icon ? (
                                    <Icon className="mini-sort__icon" name={item.icon} size="sm" variant={isActive ? 'accent' : 'muted'} />
                                ) : undefined
                            }
                            size="small"
                            variant="ghost"
                            onClick={() =>
                                onSort(
                                    item.value,
                                    showDirectionToggle ? (sortKey === item.value ? sortDirection : itemDirection) : itemDirection
                                )
                            }
                        >
                            {item.label ?? item.value}
                        </Button>
                    </Tooltip>
                );
            })}

            {showDirectionToggle && (
                <Tooltip title={`Direction: ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}>
                    <Button
                        className="mini-sort__button mini-sort__direction"
                        disabled={sortKey === null}
                        icon={
                            <Icon
                                className="mini-sort__icon"
                                name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
                                size="sm"
                                variant="accent"
                            />
                        }
                        size="small"
                        variant="ghost"
                        onClick={() => sortKey !== null && onSort(sortKey, sortDirection === 'asc' ? 'desc' : 'asc')}
                    />
                </Tooltip>
            )}
        </div>
    );
};
