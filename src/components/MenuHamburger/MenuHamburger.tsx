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
    icon = 'menu-hamburger',
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

    const isAtLeastTablet = disableResponsive ? true : isAtLeast('tablet');

    if (items.length === 1) {
        const item = items[0];
        const hasSingleItemLabel = isAtLeastTablet && showLabel;

        return (
            <div className="MenuHamburger">
                <Button
                    variant={isCompact || !isAtLeastTablet ? 'plain' : 'default'}
                    onClick={item.onClick}
                    icon={item.icon}
                    className={`MenuHamburger_single-item ${hasSingleItemLabel ? '' : 'MenuHamburger_single-item--icon-only'} ${
                        item.isActive ? 'MenuHamburger_item--active' : ''
                    }`}
                >
                    {hasSingleItemLabel ? item.label : ''}
                </Button>
            </div>
        );
    }

    const handleItemClick = (item: MenuHamburgerItem) => {
        item.onClick();
        closeMenu();
    };

    const hasOpenerLabel = isAtLeastTablet && showLabel && Boolean(label);

    return (
        <div className="MenuHamburger">
            <Button
                variant={isCompact || !isAtLeastTablet ? 'plain' : 'default'}
                onClick={handleButtonClick}
                icon={icon}
                className={hasOpenerLabel ? '' : 'MenuHamburger_opener--icon-only'}
            >
                {hasOpenerLabel ? label : ''}
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
