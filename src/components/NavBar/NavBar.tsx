import React, { ReactNode, useState } from 'react';

import { Button } from '../Button';
import { Icon, type IconName } from '../Icon';

import './NavBar.scss';

export interface NavBarItem {
    id: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    icon?: IconName;
    disabled?: boolean;
}

interface NavBarProps {
    items: NavBarItem[];
    logo?: ReactNode;
    actions?: ReactNode;
    position?: 'fixed' | 'sticky' | 'static';
    className?: string;
    renderItem?: (item: NavBarItem) => ReactNode;
    collapsible?: boolean;
    noPadding?: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({
    items,
    logo,
    actions,
    position = 'static',
    className = '',
    renderItem,
    collapsible = false,
    noPadding = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleItemClick = (item: NavBarItem) => {
        if (item.disabled) {
            return;
        }
        if (item.onClick) {
            item.onClick();
        }
        if (collapsible) {
            setIsExpanded(false);
        }
    };

    const defaultRenderItem = (item: NavBarItem) => (
        <button
            key={item.id}
            className={`navbar__item ${item.isActive ? 'navbar__item--active' : ''} ${item.disabled ? 'navbar__item--disabled' : ''}`}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
        >
            {item.icon && <span className="navbar__item-icon">{item.icon ? <Icon name={item.icon} /> : null}</span>}
            <span className="navbar__item-label">{item.label}</span>
        </button>
    );

    const visibleItems = collapsible && !isExpanded ? items.filter((item, index) => index === 0 || item.isActive) : items;

    const hiddenCount = collapsible && !isExpanded ? items.filter((item, index) => index > 0 && !item.isActive).length : 0;

    return (
        <nav className={`navbar navbar--${position} ${className} ${noPadding ? 'navbar--no-padding' : ''}`}>
            {logo && <div className="navbar__logo">{logo}</div>}

            <div className="navbar__items">
                {visibleItems.map(item => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
                {collapsible && !isExpanded && hiddenCount > 0 && (
                    <Button className="navbar__item navbar__item--expand" onClick={() => setIsExpanded(true)}>
                        <span className="navbar__item-label">+{hiddenCount} more</span>
                    </Button>
                )}
                {collapsible && isExpanded && (
                    <Button className="navbar__item navbar__item--expand" onClick={() => setIsExpanded(false)}>
                        <span className="navbar__item-label">− Less</span>
                    </Button>
                )}
            </div>

            {actions && <div className="navbar__actions">{actions}</div>}
        </nav>
    );
};
