import React, { type ReactNode, useState } from 'react';

import { useBreakpoint } from '../../hooks/useBreakpoint';
import { Button } from '../Button';
import { useControlPanelContext } from '../ControlPanel';
import { Dropdown, type DropdownOption } from '../Dropdown';
import { Icon, type IconName } from '../Icon';
import { InputSearch, type InputSearchProps } from '../InputSearch';
import { MenuHamburger, type MenuHamburgerItem } from '../MenuHamburger';
import { NotificationPanel, type NotificationPanelItem } from '../NotificationPanel';
import { Tooltip } from '../Tooltip';

import './Toolbar.scss';

export interface ToolbarControlPanelToggleConfig {
    label?: string;
    /** Active filter count shown as a badge on the toggle. Hidden when 0 or undefined. */
    count?: number;
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
    onItemClick?: (item: NotificationPanelItem) => void;
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
    /** Buttons or status shown beside the menu: at the right on desktop, in the top row on mobile. */
    actions?: ReactNode;
    /** Extra filters or controls, laid out with the search. */
    children?: ReactNode;
    className?: string;
    controlPanelToggle?: boolean | ToolbarControlPanelToggleConfig;
    /**
     * Desktop: a button hides the toolbar, leaving a small group floating in the page's top-right corner
     * (the panel toggle, search, the actions, notifications and the menu), and the page the whole height.
     * The choice is remembered (per app, as each app has its own origin).
     */
    collapsible?: boolean;
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
const COLLAPSED_STORAGE_KEY = 'memobit-toolbar-collapsed';

const readCollapsed = (): boolean => {
    try {
        return localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true';
    } catch {
        return false;
    }
};

// The toggle is icon-only by default (the `tune` icon + count badge already
// convey "filters"). A label only shows when an app explicitly opts into one.
const getControlPanelToggleLabel = (controlPanelToggle: boolean | ToolbarControlPanelToggleConfig): string | undefined =>
    typeof controlPanelToggle === 'object' ? controlPanelToggle.label : undefined;

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
    actions,
    children,
    className = '',
    collapsible = false,
    controlPanelToggle,
    heading,
    noCard = false,
    menuItems,
    notifications,
    search,
    sort,
}) => {
    const controlPanel = useControlPanelContext();
    const shouldShowControlPanelToggle = Boolean(controlPanelToggle && controlPanel?.isDrawer);
    const toggleCount = typeof controlPanelToggle === 'object' ? (controlPanelToggle.count ?? 0) : 0;
    const rootClassName = ['memobit-toolbar', noCard ? 'memobit-toolbar--no-card' : '', className].filter(Boolean).join(' ');
    const hasContent = Boolean(search || children);
    const { isMobile } = useBreakpoint();
    const [isCollapsed, setIsCollapsed] = useState(readCollapsed);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const canCollapse = collapsible && !isMobile;

    const setCollapsed = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        setIsSearchOpen(false);
        try {
            localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
        } catch {
            // Storage unavailable (private mode): the choice lasts until reload.
        }
    };

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

    const controlPanelToggleButton = shouldShowControlPanelToggle && (
        <Tooltip title="Filters">
            <Button className="memobit-toolbar__control-panel-toggle" icon="tune" onClick={controlPanel?.toggle} size="medium" variant="default">
                {controlPanelToggle && getControlPanelToggleLabel(controlPanelToggle)}
                {toggleCount > 0 && <span className="memobit-toolbar__control-panel-toggle-count">{toggleCount}</span>}
            </Button>
        </Tooltip>
    );
    const notificationPanel = notifications && (
        <NotificationPanel
            items={notifications.items}
            buttonLabel={notifications.buttonLabel}
            panelTitle={notifications.panelTitle}
            emptyMessage={notifications.emptyMessage}
            onItemClick={notifications.onItemClick}
        />
    );
    const menu = <MenuHamburger items={menuItems} disableResponsive showLabel={false} />;

    // Collapsed: the essentials float in the corner. Search opens as a box from its icon, and stays open
    // while it holds a query, so an active search is never out of sight.
    if (canCollapse && isCollapsed) {
        const isSearchShown = isSearchOpen || Boolean(search?.value);
        return (
            <div className="memobit-toolbar-floating">
                {controlPanelToggleButton}
                {search &&
                    (isSearchShown ? (
                        <div className="memobit-toolbar-floating__search">
                            <InputSearch
                                {...search}
                                autoFocus={isSearchOpen}
                                className={['memobit-toolbar__search-input', search.className].filter(Boolean).join(' ')}
                                onBlur={event => {
                                    search.onBlur?.(event);
                                    if (!event.currentTarget.value) setIsSearchOpen(false);
                                }}
                            />
                        </div>
                    ) : (
                        <Tooltip title="Search">
                            <Button icon="search" onClick={() => setIsSearchOpen(true)} size="medium" variant="default" />
                        </Tooltip>
                    ))}
                {actions}
                {notificationPanel}
                {menu}
                <Tooltip title="Show the toolbar">
                    <Button icon="caret-down" onClick={() => setCollapsed(false)} size="medium" variant="default" />
                </Tooltip>
            </div>
        );
    }

    return (
        <div className={rootClassName}>
            {controlPanelToggleButton}

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
                </div>
            )}

            {/* Sort and the actions wrap as one unit, so a toolbar too narrow for a single
                row gives the search the whole first line and puts these together below it. */}
            <div className="memobit-toolbar__end">
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

                <div className="memobit-toolbar__actions">
                    {actions}
                    {notificationPanel}
                    {menu}
                    {canCollapse && (
                        <Tooltip title="Hide the toolbar">
                            <Button icon="caret-up" onClick={() => setCollapsed(true)} size="medium" variant="default" />
                        </Tooltip>
                    )}
                </div>
            </div>
        </div>
    );
};
