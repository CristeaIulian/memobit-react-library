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
    /**
     * Starting direction for this item when `showDirectionToggle` is false. Clicking the already-active
     * item reverses it — unless another item sorts the same `value` (e.g. a "Newest"/"Oldest" pair),
     * in which case each item keeps its own fixed direction.
     */
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

export const MiniSort: React.FC<MiniSortProps> = ({ items, sortKey, sortDirection, onSort, align = 'left', showDirectionToggle = false, className = '' }) => {
    if (items.length === 0) {
        return null;
    }

    const classes = ['mini-sort', `mini-sort--align-${align}`, className].filter(Boolean).join(' ');

    return (
        <div className={classes}>
            {items.map((item, index) => {
                const itemDirection = item.direction ?? 'asc';
                const isSelected = sortKey === item.value;
                // Items that share a value with a sibling are a fixed asc/desc pair; a lone item is reversible.
                const isReversible = !showDirectionToggle && items.filter(other => other.value === item.value).length === 1;
                const isActive = showDirectionToggle || isReversible ? isSelected : isSelected && sortDirection === itemDirection;
                const labelText = typeof item.label === 'string' || typeof item.label === 'number' ? String(item.label) : item.value;
                const describe = (direction: MiniSortDirection) => (direction === 'asc' ? 'ascending' : 'descending');
                const flipped: MiniSortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                const nextDirection = showDirectionToggle ? (isSelected ? sortDirection : itemDirection) : isReversible && isActive ? flipped : itemDirection;
                const tooltip = showDirectionToggle
                    ? `Sort by ${labelText}`
                    : isReversible && isActive
                      ? `Sorted by ${labelText} ${describe(sortDirection)} — click to reverse`
                      : `Sort by ${labelText} ${describe(itemDirection)}`;

                return (
                    <Tooltip key={`${item.value}-${index}`} title={tooltip}>
                        <Button
                            className={`mini-sort__button${isActive ? ' is-active' : ''}`}
                            disabled={item.disabled}
                            icon={
                                item.icon ? <Icon className="mini-sort__icon" name={item.icon} size="sm" variant={isActive ? 'accent' : 'muted'} /> : undefined
                            }
                            sufixIcon={
                                isReversible && isActive ? (
                                    <Icon className="mini-sort__icon" name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size="sm" />
                                ) : undefined
                            }
                            size="small"
                            variant="ghost"
                            onClick={() => onSort(item.value, nextDirection)}
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
                        icon={<Icon className="mini-sort__icon" name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'} size="sm" variant="accent" />}
                        size="small"
                        variant="ghost"
                        onClick={() => sortKey !== null && onSort(sortKey, sortDirection === 'asc' ? 'desc' : 'asc')}
                    />
                </Tooltip>
            )}
        </div>
    );
};
