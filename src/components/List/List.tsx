import React, { useState } from 'react';

import './List.scss';

export interface ListItem {
    id: string | number;
    label: React.ReactNode;
    disabled?: boolean;
}

interface ListProps {
    items: ListItem[];
    direction?: 'vertical' | 'horizontal';
    selectable?: boolean;
    defaultSelectedId?: string | number;
    onSelect?: (item: ListItem) => void;
    className?: string;
}

export const List: React.FC<ListProps> = ({
    items,
    direction = 'vertical',
    selectable = false,
    defaultSelectedId,
    onSelect,
    className = '',
}) => {
    const [selectedId, setSelectedId] = useState<string | number | undefined>(defaultSelectedId);

    const handleClick = (item: ListItem) => {
        if (!selectable || item.disabled) return;
        setSelectedId(item.id);
        onSelect?.(item);
    };

    return (
        <ul
            className={`list list--${direction} ${selectable ? 'list--selectable' : ''} ${className}`}
        >
            {items.map((item, index) => {
                const isActive = selectable && selectedId === item.id;

                return (
                    <li
                        key={item.id}
                        className={[
                            'list__item',
                            index % 2 === 1 ? 'list__item--alternate' : '',
                            isActive ? 'list__item--active' : '',
                            item.disabled ? 'list__item--disabled' : '',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                        onClick={() => handleClick(item)}
                    >
                        {item.label}
                    </li>
                );
            })}
        </ul>
    );
};
