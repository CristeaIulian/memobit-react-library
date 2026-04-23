import React, { ReactNode } from 'react';

import { Button, ButtonProps } from '../Button';
import { Chip } from '../Chip';
import { Dropdown, DropdownOption } from '../Dropdown';
import { InputNumber } from '../InputNumber';
import { InputText } from '../InputText';
import { Rating } from '../Rating';
import { Search } from '../Search';
import { Separator } from '../Separator';
import { useSidebarContext } from './SidebarContext';

import './Sidebar.scss';

export interface SidebarItem {
    id: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    icon?: ReactNode;
    emoji?: string;
    bulletColor?: string;
    count?: number | string;
    countLabel?: string;
}

export interface SidebarSection {
    id?: string;
    title?: string;
    heading?: string;
    icon?: ReactNode;
    description?: string;
    items: SidebarItem[];
    showDivider?: boolean;
}

export interface SidebarHeader {
    icon?: ReactNode;
    siteName?: string;
    heading?: string;
    onClick?: () => void;
}

export interface SidebarAction {
    id: string;
    label: string;
    onClick?: ButtonProps['onClick'];
    icon?: string;
    suffixIcon?: string;
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    fullWidth?: boolean;
    disabled?: boolean;
}

export interface SidebarFilterOption extends DropdownOption {
    color?: string;
    count?: number | string;
}

export type SidebarFilterType = 'radio' | 'chips' | 'dropdown' | 'text' | 'number' | 'rating' | 'range' | 'search';
export type SidebarFilterValue = string | number | string[] | number[] | null;

export interface SidebarFilter {
    id: string;
    label: string;
    type: SidebarFilterType;
    options?: SidebarFilterOption[];
    value?: SidebarFilterValue;
    placeholder?: string;
    multiple?: boolean;
    searchable?: boolean;
    min?: number;
    max?: number;
    step?: number;
    maxRate?: number;
    ratingIcon?: 'star' | 'bullet';
    ratingVariant?: 'success' | 'info' | 'warning' | 'danger';
    isActive?: boolean;
}

export interface SidebarFilterGroup {
    id?: string;
    label?: string;
    filters: SidebarFilter[];
}

export interface SidebarFilterChangeEvent {
    filterId: string;
    type: SidebarFilterType;
    value: SidebarFilterValue;
    option?: SidebarFilterOption | null;
    options?: SidebarFilterOption[];
}

export interface SidebarClearFiltersEvent {
    source: 'sidebar';
}

export interface SidebarProps {
    sections: SidebarSection[];
    width?: string;
    className?: string;
    renderItem?: (item: SidebarItem) => ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    showOverlay?: boolean;
    contained?: boolean;
    borderRadius?: string | number;
    margin?: string | number;
    shadow?: string;
    header?: SidebarHeader;
    actions?: SidebarAction[];
    filters?: SidebarFilter[] | SidebarFilterGroup[];
    filtersHeading?: string;
    filtersCount?: number;
    clearFiltersLabel?: string;
    onFilterChange?: (event: SidebarFilterChangeEvent) => void;
    onClearFilters?: (event: SidebarClearFiltersEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    sections,
    width = '280px',
    className = '',
    renderItem,
    isOpen: isOpenProp,
    onClose,
    isMobile: isMobileProp,
    showOverlay = true,
    contained = false,
    borderRadius = 0,
    margin = 0,
    shadow = 'none',
    header,
    actions = [],
    filters = [],
    filtersHeading = 'Filters',
    filtersCount,
    clearFiltersLabel = 'Clear filters',
    onFilterChange,
    onClearFilters,
}) => {
    const sidebarContext = useSidebarContext();
    const isMobile = isMobileProp ?? sidebarContext?.isMobile ?? false;
    const isOpen = isOpenProp ?? (isMobile ? (sidebarContext?.isOpen ?? false) : true);
    const close = onClose ?? sidebarContext?.close ?? (() => undefined);
    const sidebarClassName = [
        'sidebar',
        isOpen ? 'sidebar--open' : 'sidebar--closed',
        isMobile ? 'sidebar--mobile' : '',
        contained ? 'sidebar--contained' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const overlayClassName = ['sidebar__overlay', contained ? 'sidebar__overlay--contained' : ''].filter(Boolean).join(' ');
    const formatCssValue = (value: string | number): string => (typeof value === 'number' ? `${value}px` : value);
    const sidebarStyle = {
        '--sidebar-width': width,
        '--sidebar-border-radius': formatCssValue(borderRadius),
        '--sidebar-margin': formatCssValue(margin),
        '--sidebar-shadow': shadow,
    } as React.CSSProperties;

    const emitFilterChange = (event: SidebarFilterChangeEvent) => {
        onFilterChange?.(event);
    };

    const getArrayValue = (value?: SidebarFilterValue): Array<string | number> => {
        if (Array.isArray(value)) {
            return value;
        }

        if (value === null || value === undefined) {
            return [];
        }

        return [value];
    };

    const getFilterArrayValue = (value: Array<string | number>): string[] | number[] => {
        if (value.every(item => typeof item === 'number')) {
            return value as number[];
        }

        return value.map(String);
    };

    const handleItemClick = (item: SidebarItem) => {
        if (item.onClick) {
            item.onClick();
        }
        if (isMobile) {
            close();
        }
    };

    const defaultRenderItem = (item: SidebarItem) => (
        <button key={item.id} className={`sidebar__link ${item.isActive ? 'sidebar__link--active' : ''}`} onClick={() => handleItemClick(item)}>
            {item.icon && <span className="sidebar__link-icon">{item.icon}</span>}
            {item.emoji && <span className="sidebar__link-emoji">{item.emoji}</span>}
            {item.bulletColor && <span className="sidebar__link-bullet" style={{ backgroundColor: item.bulletColor }} />}
            <span className="sidebar__link-label">{item.label}</span>
            {item.count !== undefined && (
                <span className="sidebar__link-count" aria-label={item.countLabel}>
                    {item.count}
                </span>
            )}
        </button>
    );

    const normalizedFilterGroups: SidebarFilterGroup[] =
        filters.length === 0 ? [] : 'filters' in filters[0] ? (filters as SidebarFilterGroup[]) : [{ filters: filters as SidebarFilter[] }];

    const renderFilterItem = (filter: SidebarFilter) => (
        <div className="sidebar__filter" key={filter.id}>
            <span className={`sidebar__filter-title${filter.isActive ? ' sidebar__filter-title--active' : ''}`}>
                {filter.isActive && <span className="sidebar__filter-active-dot" />}
                {filter.label}
            </span>
            {renderFilter(filter)}
        </div>
    );

    const renderFilter = (filter: SidebarFilter) => {
        const selectedValues = getArrayValue(filter.value);
        const options = filter.options ?? [];

        if (filter.type === 'text') {
            return (
                <div className="sidebar__filter-text">
                    <InputText
                        onChange={value =>
                            emitFilterChange({
                                filterId: filter.id,
                                type: filter.type,
                                value,
                            })
                        }
                        placeholder={filter.placeholder}
                        value={typeof filter.value === 'string' ? filter.value : ''}
                    />
                </div>
            );
        }

        if (filter.type === 'search') {
            return (
                <Search
                    className="sidebar__filter-search"
                    onChange={value =>
                        emitFilterChange({
                            filterId: filter.id,
                            type: filter.type,
                            value,
                        })
                    }
                    placeholder={filter.placeholder}
                    value={typeof filter.value === 'string' ? filter.value : ''}
                />
            );
        }

        if (filter.type === 'number') {
            return (
                <div className="sidebar__filter-number">
                    <InputNumber
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        placeholder={filter.placeholder}
                        value={typeof filter.value === 'number' ? filter.value : undefined}
                        onChange={value =>
                            emitFilterChange({
                                filterId: filter.id,
                                type: filter.type,
                                value: value ?? null,
                            })
                        }
                    />
                </div>
            );
        }

        if (filter.type === 'rating') {
            return (
                <Rating
                    selectable
                    icon={filter.ratingIcon ?? 'star'}
                    maxRate={filter.maxRate ?? 10}
                    rating={typeof filter.value === 'number' ? filter.value : 0}
                    variant={filter.ratingVariant ?? 'warning'}
                    onSelect={value =>
                        emitFilterChange({
                            filterId: filter.id,
                            type: filter.type,
                            value,
                        })
                    }
                />
            );
        }

        if (filter.type === 'range') {
            const rangeArr = Array.isArray(filter.value) ? (filter.value as number[]) : [];
            const minVal: number | undefined = rangeArr[0];
            const maxVal: number | undefined = rangeArr[1];
            const emitRange = (newMin: number | undefined, newMax: number | undefined) => {
                const value = [newMin, newMax] as number[];
                emitFilterChange({ filterId: filter.id, type: filter.type, value });
            };
            return (
                <div className="sidebar__filter-range">
                    <InputNumber
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        placeholder="Min"
                        value={minVal}
                        onChange={value => emitRange(value, maxVal)}
                    />
                    <span className="sidebar__filter-range-sep">—</span>
                    <InputNumber
                        min={filter.min}
                        max={filter.max}
                        step={filter.step}
                        placeholder="Max"
                        value={maxVal}
                        onChange={value => emitRange(minVal, value)}
                    />
                </div>
            );
        }

        if (filter.type === 'dropdown') {
            return (
                <Dropdown
                    className="sidebar__filter-dropdown"
                    multiple={filter.multiple}
                    name={filter.id}
                    onChange={selectedOption => {
                        const selectedOptions = Array.isArray(selectedOption) ? selectedOption : selectedOption ? [selectedOption] : [];
                        emitFilterChange({
                            filterId: filter.id,
                            type: filter.type,
                            value: Array.isArray(selectedOption)
                                ? getFilterArrayValue(selectedOption.map(option => option.value))
                                : (selectedOption?.value ?? null),
                            option: Array.isArray(selectedOption) ? null : (selectedOption as SidebarFilterOption | null),
                            options: selectedOptions as SidebarFilterOption[],
                        });
                    }}
                    options={options}
                    placeholder={filter.placeholder}
                    searchable={filter.searchable ?? false}
                    selectedCountDisplay="inline"
                    usePortal={false}
                    value={filter.value}
                />
            );
        }

        if (filter.type === 'chips') {
            return (
                <div className="sidebar__filter-chips" role="group" aria-label={filter.label}>
                    {options.map(option => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                            <Chip
                                key={option.value}
                                color={option.color}
                                count={option.count}
                                onClick={() => {
                                    const nextValue = isSelected ? selectedValues.filter(value => value !== option.value) : [...selectedValues, option.value];
                                    emitFilterChange({
                                        filterId: filter.id,
                                        type: filter.type,
                                        value: getFilterArrayValue(nextValue),
                                        option,
                                        options: options.filter(filterOption => nextValue.includes(filterOption.value)),
                                    });
                                }}
                                selected={isSelected}
                            >
                                {option.label}
                            </Chip>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="sidebar__filter-list" role="radiogroup" aria-label={filter.label}>
                {options.map(option => {
                    const isSelected = filter.value === option.value;
                    return (
                        <div key={option.value} className={`sidebar__filter-radio ${isSelected ? 'sidebar__filter-radio--selected' : ''}`}>
                            <label className="sidebar__filter-radio-label">
                                <input
                                    checked={isSelected}
                                    className="sidebar__filter-radio-input"
                                    name={filter.id}
                                    onChange={() =>
                                        emitFilterChange({
                                            filterId: filter.id,
                                            type: filter.type,
                                            value: option.value,
                                            option,
                                            options: [option],
                                        })
                                    }
                                    type="radio"
                                    value={option.value}
                                />
                                {option.color && <span className="sidebar__filter-swatch" style={{ backgroundColor: option.color }} />}
                                <span className="sidebar__filter-label">{option.label}</span>
                                {option.count !== undefined && <span className="sidebar__filter-count">{option.count}</span>}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside className={sidebarClassName} style={sidebarStyle}>
                {header && (
                    <>
                        <div className={`sidebar__header ${header.onClick ? 'sidebar__header--clickable' : ''}`} onClick={header.onClick}>
                            {header.icon && <span className="sidebar__header-icon">{header.icon}</span>}
                            <div className="sidebar__header-copy">
                                {header.siteName && <span className="sidebar__site-name">{header.siteName}</span>}
                                {header.heading && <span className="sidebar__heading">{header.heading}</span>}
                            </div>
                        </div>
                        <Separator className="sidebar__header-separator" spacing={0} />
                    </>
                )}

                {actions.length > 0 && (
                    <div className="sidebar__actions">
                        {actions.map(action => (
                            <Button
                                key={action.id}
                                className="sidebar__action"
                                disabled={action.disabled}
                                fullWidth={action.fullWidth ?? true}
                                onClick={action.onClick}
                                prefixIcon={action.icon}
                                size={action.size ?? 'medium'}
                                sufixIcon={action.suffixIcon}
                                variant={action.variant ?? 'default'}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}

                <nav className="sidebar__nav">
                    {sections.map((section, sectionIndex) => (
                        <section className="sidebar__section" key={section.id ?? section.title ?? sectionIndex}>
                            {(section.title || section.heading || section.icon || section.description) && (
                                <div className="sidebar__section-header">
                                    {(section.icon || section.title || section.heading) && (
                                        <div className="sidebar__section-title-row">
                                            {section.icon && <span className="sidebar__section-icon">{section.icon}</span>}
                                            {(section.title || section.heading) && (
                                                <span className="sidebar__section-title">{section.title ?? section.heading}</span>
                                            )}
                                        </div>
                                    )}
                                    {section.description && <p className="sidebar__section-description">{section.description}</p>}
                                </div>
                            )}
                            {section.items.map(item => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
                            {section.showDivider && sectionIndex < sections.length - 1 && <div className="sidebar__divider" />}
                        </section>
                    ))}
                </nav>

                {normalizedFilterGroups.length > 0 && (
                    <div className="sidebar__filters">
                        {(filtersHeading || onClearFilters) && (
                            <div className="sidebar__filters-header">
                                <span className="sidebar__filters-heading">
                                    {filtersHeading}
                                    {filtersCount !== undefined && <span className="sidebar__filters-count">{filtersCount}</span>}
                                </span>
                                {onClearFilters && (
                                    <button className="sidebar__filters-clear" type="button" onClick={() => onClearFilters({ source: 'sidebar' })}>
                                        {clearFiltersLabel}
                                    </button>
                                )}
                            </div>
                        )}
                        {normalizedFilterGroups.map((group, groupIndex) => (
                            <div className="sidebar__filter-group" key={group.id ?? group.label ?? groupIndex}>
                                {group.label && <span className="sidebar__filter-group-label">{group.label}</span>}
                                {group.filters.map(renderFilterItem)}
                            </div>
                        ))}
                    </div>
                )}
            </aside>
        </>
    );
};
