import React, { type FC, type ReactElement, type MouseEvent, useState } from 'react';

import { Button } from '../Button';
import { ContextMenu } from '../ContextMenu';
import { useBreakpoint } from '../../hooks/useBreakpoint';

import './MenuHamburger.scss';

export interface MenuHamburgerItem {
    label: string;
    icon: string;
    onClick: () => void;
    isActive: boolean;
}

interface MenuHamburgerProps {
    icon?: string;
    isCompact?: boolean;
    items: MenuHamburgerItem[];
    label?: string;
    showLabel?: boolean;
}

export const MenuHamburger: FC<MenuHamburgerProps> = ({ icon, isCompact, items, label, showLabel = true }: MenuHamburgerProps): ReactElement => {
    const { isAtLeast } = useBreakpoint();
    const [menuTarget, setMenuTarget] = useState<EventTarget | null>(null);

    const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        setMenuTarget(event.currentTarget);
    };

    const closeMenu = () => {
        setMenuTarget(null);
    };

    const handleItemClick = (item: MenuHamburgerItem) => {
        item.onClick();
        closeMenu();
    };

    const isAtLeastTablet = isAtLeast('tablet');

    return (
        <div className="MenuHamburger">
            <Button
                variant={isCompact || !isAtLeastTablet ? 'plain' : 'default'}
                onClick={handleButtonClick}
                prefixIcon={icon ? icon : isCompact || !isAtLeastTablet ? '⋮' : `☰`}
                aria-label="Menu"
            >
                {isAtLeastTablet && showLabel ? (label ? label : 'Menu') : ''}
            </Button>

            {menuTarget && (
                <ContextMenu target={menuTarget} onClose={closeMenu}>
                    <div className="MenuHamburger_dropdown">
                        {items.map((item, index) => (
                            <Button
                                variant={'plain'}
                                key={index}
                                className={`MenuHamburger_item ${item.isActive ? 'MenuHamburger_item--active' : ''}`}
                                onClick={() => handleItemClick(item)}
                            >
                                <span className="MenuHamburger_item__icon">{item.icon}</span>
                                <span className="MenuHamburger_item__label">{item.label}</span>
                            </Button>
                        ))}
                    </div>
                </ContextMenu>
            )}
        </div>
    );
};
