import { type FC, type ReactElement, type MouseEvent, useState } from 'react';

import { Button } from '../Button';
import { ContextMenu } from '../ContextMenu';
import { Icon, type IconName } from '../Icon';
import { useBreakpoint } from '../../hooks/useBreakpoint';

import './MenuHamburger.scss';

export interface MenuHamburgerItem {
    label: string;
    icon?: IconName;
    onClick: () => void;
    isActive: boolean;
    separator?: boolean;
}

interface MenuHamburgerProps {
    icon?: IconName;
    isCompact?: boolean;
    items: MenuHamburgerItem[];
    label?: string;
    showLabel?: boolean;
    disableResponsive?: boolean;
}

export const MenuHamburger: FC<MenuHamburgerProps> = ({
    icon,
    isCompact,
    items,
    label,
    showLabel = true,
    disableResponsive = false,
}: MenuHamburgerProps): ReactElement => {
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

    const isAtLeastTablet = disableResponsive ? true : isAtLeast('tablet');

    return (
        <div className="MenuHamburger">
            <Button
                variant={isCompact || !isAtLeastTablet ? 'plain' : 'default'}
                onClick={handleButtonClick}
                icon={icon}
                aria-label="Menu"
                className={icon ? '' : 'MenuHamburger__opnener-three-dots'}
            >
                {isAtLeastTablet && showLabel ? (label ? label : 'Menu') : ''}
            </Button>

            {menuTarget && (
                <ContextMenu target={menuTarget} onClose={closeMenu}>
                    <div className="MenuHamburger_dropdown">
                        {items.map((item, index) => (
                            <div key={index} className="MenuHamburger_entry">
                                {item.separator && <div className="MenuHamburger_separator" />}
                                <Button
                                    variant={'plain'}
                                    className={`MenuHamburger_item ${item.isActive ? 'MenuHamburger_item--active' : ''}`}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <span className="MenuHamburger_item__icon">{item.icon ? <Icon name={item.icon} /> : null}</span>
                                    <span className="MenuHamburger_item__label">{item.label}</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </ContextMenu>
            )}
        </div>
    );
};
