import React, { type ReactNode } from 'react';

import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { MenuHamburger, type MenuHamburgerItem } from '../MenuHamburger';
import { Search, type SearchProps } from '../Search';
import { useControlPanelContext } from '../ControlPanel';

import './Toolbar.scss';

export interface ToolbarControlPanelToggleConfig {
    label?: string;
}

export interface ToolbarSearchConfig extends Omit<SearchProps, 'className'> {
    className?: string;
}

export interface ToolbarSortConfig {
    className?: string;
    highlighted?: boolean;
    label?: string;
    name?: string;
    onChange: (value: string, option: DropdownOption | null) => void;
    options: DropdownOption[];
    placeholder?: string;
    searchable?: boolean;
    value?: number | string | null;
}

export interface ToolbarProps {
    children?: ReactNode;
    className?: string;
    controlPanelToggle?: boolean | ToolbarControlPanelToggleConfig;
    menuItems: MenuHamburgerItem[];
    search?: ToolbarSearchConfig;
    sort?: ToolbarSortConfig;
}

const getControlPanelToggleLabel = (controlPanelToggle: boolean | ToolbarControlPanelToggleConfig): string => {
    if (typeof controlPanelToggle === 'object' && controlPanelToggle.label) {
        return controlPanelToggle.label;
    }

    return 'Filters';
};

export const Toolbar: React.FC<ToolbarProps> = ({ children, className = '', controlPanelToggle, menuItems, search, sort }) => {
    const controlPanel = useControlPanelContext();
    const shouldShowControlPanelToggle = Boolean(controlPanelToggle && controlPanel?.isMobile);
    const rootClassName = ['memobit-toolbar', className].filter(Boolean).join(' ');
    const hasContent = Boolean(search || sort || children);

    const handleSortChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (!sort) {
            return;
        }

        if (!option || Array.isArray(option)) {
            sort.onChange('', null);
            return;
        }

        sort.onChange(String(option.value), option);
    };

    return (
        <div className={rootClassName}>
            {shouldShowControlPanelToggle && (
                <Button className="memobit-toolbar__control-panel-toggle" icon="menu-hamburger" onClick={controlPanel?.toggle} size="medium" variant="default">
                    {controlPanelToggle ? getControlPanelToggleLabel(controlPanelToggle) : 'Filters'}
                </Button>
            )}

            {hasContent && (
                <div className="memobit-toolbar__content">
                    {search && (
                        <div className="memobit-toolbar__search">
                            <Search {...search} className={['memobit-toolbar__search-input', search.className].filter(Boolean).join(' ')} />
                        </div>
                    )}

                    {children && <div className="memobit-toolbar__custom">{children}</div>}

                    {sort && (
                        <div className={['memobit-toolbar__sort', sort.className].filter(Boolean).join(' ')}>
                            <Dropdown
                                highlighted={sort.highlighted}
                                label={sort.label}
                                name={sort.name ?? 'toolbar-sort'}
                                onChange={handleSortChange}
                                options={sort.options}
                                placeholder={sort.placeholder}
                                searchable={sort.searchable ?? false}
                                usePortal={false}
                                value={sort.value}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="memobit-toolbar__actions">
                <MenuHamburger items={menuItems} disableResponsive showLabel={false} />
            </div>
        </div>
    );
};
