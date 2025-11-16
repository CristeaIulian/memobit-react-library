import React, { FC, ReactElement, useRef, useState } from 'react';

import { Button } from '../Button';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (item: MenuHamburgerItem) => {
        item.onClick();
        setIsMenuOpen(false);
    };

    const isAtLeastTablet = isAtLeast('tablet');

    return (
        <div className="MenuHamburger" ref={menuRef}>
            <Button
                variant={isCompact || !isAtLeastTablet ? 'plain' : 'default'}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                prefixIcon={icon ? icon : isCompact || !isAtLeastTablet ? '⋮' : `☰`}
                aria-label="Menu"
            >
                {isAtLeastTablet && showLabel ? (label ? label : 'Menu') : ''}
            </Button>

            {isMenuOpen && (
                <>
                    <div className="MenuHamburger_overlay" onClick={() => setIsMenuOpen(false)} />
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
                </>
            )}
        </div>
    );
};
