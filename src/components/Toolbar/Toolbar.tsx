import React, { type ReactNode } from 'react';

import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { Icon, type IconName } from '../Icon';
import { MenuHamburger, type MenuHamburgerItem } from '../MenuHamburger';
import { NotificationPanel, type NotificationPanelItem } from '../NotificationPanel';
import { InputSearch, type InputSearchProps } from '../InputSearch';
import { useControlPanelContext } from '../ControlPanel';

import './Toolbar.scss';

export interface ToolbarControlPanelToggleConfig {
    label?: string;
}

export interface ToolbarSearchConfig extends Omit<InputSearchProps, 'className'> {
    className?: string;
}

export interface ToolbarSortField {
    label: string;
    value: string;
}

export interface ToolbarSortValue {
    direction: 'asc' | 'desc';
    field: string;
}

interface ToolbarSortConfigBase {
    className?: string;
    highlighted?: boolean;
    label?: string;
    name?: string;
    placeholder?: string;
    searchable?: boolean;
}

export interface ToolbarSortConfigWithFields extends ToolbarSortConfigBase {
    fields: ToolbarSortField[];
    onChange: (value: ToolbarSortValue) => void;
    value?: ToolbarSortValue;
}

export interface ToolbarSortConfigWithOptions extends ToolbarSortConfigBase {
    onChange: (value: string, option: DropdownOption | null) => void;
    options: DropdownOption[];
    value?: number | string | null;
}

export type ToolbarSortConfig = ToolbarSortConfigWithFields | ToolbarSortConfigWithOptions;

export interface ToolbarNotificationsConfig {
    items: NotificationPanelItem[];
    buttonLabel?: string;
    panelTitle?: string;
    emptyMessage?: string;
}

export interface ToolbarHeadingConfig {
    title: string;
    description?: string;
    /** Brand icon shown left of the title. Pass one of svg / icon / emoji. */
    svg?: ReactNode;
    icon?: IconName;
    emoji?: string;
    /** Makes the heading clickable (e.g. to navigate home). */
    onClick?: () => void;
}

export interface ToolbarProps {
    children?: ReactNode;
    className?: string;
    controlPanelToggle?: boolean | ToolbarControlPanelToggleConfig;
    /** Descriptive headline shown at the far left of the toolbar. */
    heading?: ToolbarHeadingConfig;
    /** When true, drops the toolbar's card chrome (background, border, radius, padding). */
    noCard?: boolean;
    menuItems: MenuHamburgerItem[];
    notifications?: ToolbarNotificationsConfig;
    search?: ToolbarSearchConfig;
    sort?: ToolbarSortConfig;
}

const SORT_DIRECTION_SEPARATOR = '::';

const getControlPanelToggleLabel = (controlPanelToggle: boolean | ToolbarControlPanelToggleConfig): string => {
    if (typeof controlPanelToggle === 'object' && controlPanelToggle.label) {
        return controlPanelToggle.label;
    }

    return 'Filters';
};

const getSortDropdownOptions = (sort: ToolbarSortConfig): DropdownOption[] => {
    if ('fields' in sort) {
        return sort.fields.flatMap(field => [
            { value: `${field.value}${SORT_DIRECTION_SEPARATOR}asc`, label: field.label, suffixIcon: 'arrow-up' as const },
            { value: `${field.value}${SORT_DIRECTION_SEPARATOR}desc`, label: field.label, suffixIcon: 'arrow-down' as const },
        ]);
    }

    return sort.options;
};

const getSortDropdownValue = (sort: ToolbarSortConfig): string | number | null | undefined => {
    if ('fields' in sort) {
        return sort.value ? `${sort.value.field}${SORT_DIRECTION_SEPARATOR}${sort.value.direction}` : null;
    }

    return sort.value;
};

export const Toolbar: React.FC<ToolbarProps> = ({
    children,
    className = '',
    controlPanelToggle,
    heading,
    noCard = false,
    menuItems,
    notifications,
    search,
    sort,
}) => {
    const controlPanel = useControlPanelContext();
    const shouldShowControlPanelToggle = Boolean(controlPanelToggle && controlPanel?.isMobile);
    const rootClassName = ['memobit-toolbar', noCard ? 'memobit-toolbar--no-card' : '', className].filter(Boolean).join(' ');
    const hasContent = Boolean(search || sort || children);

    const handleSortChange = (option: DropdownOption | DropdownOption[] | null) => {
        if (!sort) {
            return;
        }

        if (!option || Array.isArray(option)) {
            if (!('fields' in sort)) {
                sort.onChange('', null);
            }
            return;
        }

        if ('fields' in sort) {
            const stringValue = String(option.value);
            const separatorIndex = stringValue.lastIndexOf(SORT_DIRECTION_SEPARATOR);
            const field = stringValue.substring(0, separatorIndex);
            const direction = stringValue.substring(separatorIndex + SORT_DIRECTION_SEPARATOR.length) as 'asc' | 'desc';
            sort.onChange({ field, direction });
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

            {heading && (
                <div
                    className={['memobit-toolbar__heading', heading.onClick ? 'memobit-toolbar__heading--clickable' : ''].filter(Boolean).join(' ')}
                    onClick={heading.onClick}
                >
                    {(heading.svg || heading.icon || heading.emoji) && (
                        <span className="memobit-toolbar__heading-icon">
                            {heading.svg}
                            {heading.icon && <Icon name={heading.icon} />}
                            {heading.emoji}
                        </span>
                    )}
                    <div className="memobit-toolbar__heading-copy">
                        <span className="memobit-toolbar__heading-title">{heading.title}</span>
                        {heading.description && <span className="memobit-toolbar__heading-description">{heading.description}</span>}
                    </div>
                </div>
            )}

            {hasContent && (
                <div className="memobit-toolbar__content">
                    {search && (
                        <div className="memobit-toolbar__search">
                            <InputSearch {...search} className={['memobit-toolbar__search-input', search.className].filter(Boolean).join(' ')} />
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
                                options={getSortDropdownOptions(sort)}
                                placeholder={sort.placeholder}
                                searchable={sort.searchable ?? false}
                                usePortal={false}
                                value={getSortDropdownValue(sort)}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="memobit-toolbar__actions">
                {notifications && (
                    <NotificationPanel
                        items={notifications.items}
                        buttonLabel={notifications.buttonLabel}
                        panelTitle={notifications.panelTitle}
                        emptyMessage={notifications.emptyMessage}
                    />
                )}
                <MenuHamburger items={menuItems} disableResponsive showLabel={false} />
            </div>
        </div>
    );
};
