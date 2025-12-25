import React, { ReactNode } from 'react';

import './NavBar.scss';

export interface NavBarItem {
    id: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    icon?: string;
    disabled?: boolean;
}

interface NavBarProps {
    items: NavBarItem[];
    logo?: ReactNode;
    actions?: ReactNode;
    position?: 'fixed' | 'sticky' | 'static';
    className?: string;
    renderItem?: (item: NavBarItem) => ReactNode;
}

export const NavBar: React.FC<NavBarProps> = ({
    items,
    logo,
    actions,
    position = 'static',
    className = '',
    renderItem,
}) => {
    const handleItemClick = (item: NavBarItem) => {
        if (item.disabled) {
            return;
        }
        if (item.onClick) {
            item.onClick();
        }
    };

    const defaultRenderItem = (item: NavBarItem) => (
        <button
            key={item.id}
            className={`navbar__item ${item.isActive ? 'navbar__item--active' : ''} ${item.disabled ? 'navbar__item--disabled' : ''}`}
            onClick={() => handleItemClick(item)}
            disabled={item.disabled}
        >
            {item.icon && <span className="navbar__item-icon">{item.icon}</span>}
            <span className="navbar__item-label">{item.label}</span>
        </button>
    );

    return (
        <nav className={`navbar navbar--${position} ${className}`}>
            {logo && <div className="navbar__logo">{logo}</div>}

            <div className="navbar__items">
                {items.map(item => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
            </div>

            {actions && <div className="navbar__actions">{actions}</div>}
        </nav>
    );
};
