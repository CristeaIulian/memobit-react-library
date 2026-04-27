import React, { ReactNode } from 'react';

import { Button, ButtonProps } from '../Button';
import { Chip } from '../Chip';
import { IconName } from '../Icon';
import { Dropdown, DropdownOption } from '../Dropdown';
import { InputDate } from '../InputDate';
import { InputNumber } from '../InputNumber';
import { InputText } from '../InputText';
import { Rating } from '../Rating';
import { Search } from '../Search';
import { Separator } from '../Separator';
import { useSidebarContext } from '../Sidebar/SidebarContext';

import '../Sidebar/Sidebar.scss';

export interface ControlPanelHeader {
    icon?: ReactNode;
    siteName?: string;
    heading?: string;
    onClick?: () => void;
}

export interface ControlPanelAction {
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

export interface ControlPanelFilterOption extends DropdownOption {
    color?: string;
    count?: number | string;
}

export type ControlPanelFilterType = 'radio' | 'chips' | 'dropdown' | 'text' | 'number' | 'rating' | 'range' | 'search' | 'date' | 'checkbox';
export type ControlPanelFilterValue = string | number | boolean | string[] | number[] | null;

export interface ControlPanelFilter {
    id: string;
    label: string;
    type: ControlPanelFilterType;
    options?: ControlPanelFilterOption[];
    value?: ControlPanelFilterValue;
    placeholder?: string;
    multiple?: boolean;
    searchable?: boolean;
    min?: number;
    max?: number;
    step?: number;
    maxRate?: number;
    ratingIcon?: 'star' | 'bullet';
    ratingVariant?: 'success' | 'info' | 'warning' | 'danger';
    minDate?: string;
    maxDate?: string;
    isActive?: boolean;
}

export interface ControlPanelFilterChangeEvent {
    filterId: string;
    type: ControlPanelFilterType;
    value: ControlPanelFilterValue;
    option?: ControlPanelFilterOption | null;
    options?: ControlPanelFilterOption[];
}

export interface ControlPanelClearFiltersEvent {
    source: 'control-panel';
}

export interface ControlPanelOptionItem {
    value: string | number;
    label: string;
}

export type ControlPanelOption =
    | { id: string; label: string; type: 'checkbox'; value?: boolean }
    | { id: string; label?: string; type: 'radio'; value?: string | number; options: ControlPanelOptionItem[] }
    | { id: string; label?: string; type: 'chips'; value: Array<string | number>; options: ControlPanelOptionItem[] };

export interface ControlPanelOptionGroup {
    id?: string;
    label?: string;
    options: ControlPanelOption[];
}

export interface ControlPanelOptionChangeEvent {
    optionId: string;
    value: boolean | string | number | Array<string | number>;
}

export interface ControlPanelViewToggleConfig {
    value: string;
    onChange: (value: 'grid' | 'table') => void;
}

export interface ControlPanelGroupByConfig {
    value: string | null;
    options: Array<{ value: string; label: string }>;
    onChange: (value: string | null) => void;
}

export interface ControlPanelVisibleColumnsConfig {
    value: string[];
    options: Array<{ value: string; label: string }>;
    onChange: (next: string[]) => void;
}

export interface ControlPanelProps {
    width?: string;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    showOverlay?: boolean;
    contained?: boolean;
    borderRadius?: string | number;
    margin?: string | number;
    shadow?: string;
    header?: ControlPanelHeader;
    actions?: ControlPanelAction[];
    filters?: ControlPanelFilter[];
    filtersCount?: number;
    onFilterChange?: (event: ControlPanelFilterChangeEvent) => void;
    onClearFilters?: (event: ControlPanelClearFiltersEvent) => void;
    options?: ControlPanelOption[] | ControlPanelOptionGroup[];
    onOptionChange?: (event: ControlPanelOptionChangeEvent) => void;
    viewToggle?: ControlPanelViewToggleConfig;
    groupBy?: ControlPanelGroupByConfig;
    visibleColumns?: ControlPanelVisibleColumnsConfig;
}

interface ViewToggleOptionItem {
    value: string;
    label: string;
    icon: IconName;
}

const VIEW_TOGGLE_OPTIONS: ViewToggleOptionItem[] = [
    { value: 'grid', label: 'Grid', icon: 'grid' },
    { value: 'table', label: 'Table', icon: 'table' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
    width = '280px',
    className = '',
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
    filtersCount,
    onFilterChange,
    onClearFilters,
    options = [],
    onOptionChange,
    viewToggle,
    groupBy,
    visibleColumns,
}) => {
    const sidebarContext = useSidebarContext();
    const isMobile = isMobileProp ?? sidebarContext?.isMobile ?? false;
    const isOpen = isOpenProp ?? (isMobile ? (sidebarContext?.isOpen ?? false) : true);
    const close = onClose ?? sidebarContext?.close ?? (() => undefined);

    const panelClassName = [
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
    const panelStyle = {
        '--sidebar-width': width,
        '--sidebar-border-radius': formatCssValue(borderRadius),
        '--sidebar-margin': formatCssValue(margin),
        '--sidebar-shadow': shadow,
    } as React.CSSProperties;

    const emitFilterChange = (event: ControlPanelFilterChangeEvent) => onFilterChange?.(event);

    const getArrayValue = (value?: ControlPanelFilterValue): Array<string | number> => {
        if (Array.isArray(value)) return value;
        if (value === null || value === undefined || typeof value === 'boolean') return [];
        return [value];
    };

    const getFilterArrayValue = (value: Array<string | number>): string[] | number[] => {
        if (value.every(item => typeof item === 'number')) return value as number[];
        return value.map(String);
    };

    const normalizedOptionGroups: ControlPanelOptionGroup[] =
        options.length === 0
            ? []
            : 'type' in options[0]
              ? [{ options: options as ControlPanelOption[] }]
              : (options as ControlPanelOptionGroup[]);

    const renderFilterItem = (filter: ControlPanelFilter) => (
        <div className="sidebar__filter" key={filter.id}>
            {filter.type !== 'checkbox' && (
                <span className={`sidebar__filter-title${filter.isActive ? ' sidebar__filter-title--active' : ''}`}>
                    {filter.isActive && <span className="sidebar__filter-active-dot" />}
                    {filter.label}
                </span>
            )}
            {renderFilter(filter)}
        </div>
    );

    const renderFilter = (filter: ControlPanelFilter) => {
        const selectedValues = getArrayValue(filter.value);
        const filterOptions = filter.options ?? [];

        if (filter.type === 'checkbox') {
            return (
                <Chip
                    selected={filter.value === true}
                    onClick={() => emitFilterChange({ filterId: filter.id, type: filter.type, value: filter.value !== true })}
                >
                    {filter.label}
                </Chip>
            );
        }

        if (filter.type === 'date') {
            return (
                <InputDate
                    min={filter.minDate}
                    max={filter.maxDate}
                    value={typeof filter.value === 'string' ? filter.value : ''}
                    onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value: value ?? null })}
                />
            );
        }

        if (filter.type === 'text') {
            return (
                <div className="sidebar__filter-text">
                    <InputText
                        onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
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
                    onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
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
                        onChange={value => emitFilterChange({ filterId: filter.id, type: filter.type, value: value ?? null })}
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
                    onSelect={value => emitFilterChange({ filterId: filter.id, type: filter.type, value })}
                />
            );
        }

        if (filter.type === 'range') {
            const rangeArr = Array.isArray(filter.value) ? (filter.value as number[]) : [];
            const minVal: number | undefined = rangeArr[0];
            const maxVal: number | undefined = rangeArr[1];
            const emitRange = (newMin: number | undefined, newMax: number | undefined) =>
                emitFilterChange({ filterId: filter.id, type: filter.type, value: [newMin, newMax] as number[] });
            return (
                <div className="sidebar__filter-range">
                    <InputNumber min={filter.min} max={filter.max} step={filter.step} placeholder="Min" value={minVal} onChange={v => emitRange(v, maxVal)} />
                    <span className="sidebar__filter-range-sep">—</span>
                    <InputNumber min={filter.min} max={filter.max} step={filter.step} placeholder="Max" value={maxVal} onChange={v => emitRange(minVal, v)} />
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
                                ? getFilterArrayValue(selectedOption.map(o => o.value))
                                : (selectedOption?.value ?? null),
                            option: Array.isArray(selectedOption) ? null : (selectedOption as ControlPanelFilterOption | null),
                            options: selectedOptions as ControlPanelFilterOption[],
                        });
                    }}
                    options={filterOptions}
                    placeholder={filter.placeholder}
                    searchable={filter.searchable ?? false}
                    selectedCountDisplay="inline"
                    usePortal={false}
                    value={typeof filter.value === 'boolean' ? null : filter.value}
                />
            );
        }

        if (filter.type === 'chips') {
            return (
                <div className="sidebar__filter-chips" role="group" aria-label={filter.label}>
                    {filterOptions.map(option => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                            <Chip
                                key={option.value}
                                color={option.color}
                                count={option.count}
                                selected={isSelected}
                                onClick={() => {
                                    const nextValue = isSelected
                                        ? selectedValues.filter(v => v !== option.value)
                                        : [...selectedValues, option.value];
                                    emitFilterChange({
                                        filterId: filter.id,
                                        type: filter.type,
                                        value: getFilterArrayValue(nextValue),
                                        option,
                                        options: filterOptions.filter(o => nextValue.includes(o.value)),
                                    });
                                }}
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
                {filterOptions.map(option => {
                    const isSelected = filter.value === option.value;
                    return (
                        <div key={option.value} className={`sidebar__filter-radio ${isSelected ? 'sidebar__filter-radio--selected' : ''}`}>
                            <label className="sidebar__filter-radio-label">
                                <input
                                    checked={isSelected}
                                    className="sidebar__filter-radio-input"
                                    name={filter.id}
                                    onChange={() => emitFilterChange({ filterId: filter.id, type: filter.type, value: option.value, option, options: [option] })}
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

    const hasOptions = viewToggle || groupBy || visibleColumns || normalizedOptionGroups.length > 0;

    return (
        <>
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside className={panelClassName} style={panelStyle}>
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

                {filters.length > 0 && (
                    <div className="sidebar__filters">
                        <div className="sidebar__filters-header">
                            <span className="sidebar__filters-heading">
                                Filters
                                {filtersCount !== undefined && <span className="sidebar__filters-count">{filtersCount}</span>}
                            </span>
                            {onClearFilters && (
                                <button className="sidebar__filters-clear" type="button" onClick={() => onClearFilters({ source: 'control-panel' })}>
                                    Clear filters
                                </button>
                            )}
                        </div>
                        {filters.map(renderFilterItem)}
                    </div>
                )}

                {filters.length > 0 && hasOptions && <Separator spacing={0} />}

                {hasOptions && (
                    <div className="sidebar__options">
                        <div className="sidebar__options-header">
                            <span className="sidebar__options-heading">Options</span>
                        </div>

                        {viewToggle && (
                            <div className="sidebar__option sidebar__option--view-toggle">
                                <div className="sidebar__option-view-toggle">
                                    {VIEW_TOGGLE_OPTIONS.map(opt => (
                                        <Button
                                            key={opt.value}
                                            icon={opt.icon}
                                            size="small"
                                            variant={viewToggle.value === opt.value ? 'info' : 'default'}
                                            onClick={() => viewToggle.onChange(opt.value as 'grid' | 'table')}
                                        >
                                            {opt.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {groupBy && groupBy.options.length > 0 && (
                            <>
                                {viewToggle && <Separator spacing={0} />}
                                <div className="sidebar__option sidebar__option--group-by">
                                    <span className="sidebar__filter-title">Group by</span>
                                    <div className="sidebar__filter-chips" role="group" aria-label="Group by">
                                        {groupBy.options.map(opt => {
                                            const isSelected = groupBy.value === opt.value;
                                            return (
                                                <Chip
                                                    key={opt.value}
                                                    selected={isSelected}
                                                    onClick={() => groupBy.onChange(isSelected ? null : opt.value)}
                                                >
                                                    {opt.label}
                                                </Chip>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {visibleColumns && (
                            <>
                                {(viewToggle || (groupBy && groupBy.options.length > 0)) && <Separator spacing={0} />}
                                <div className="sidebar__option sidebar__option--chips">
                                    <span className="sidebar__filter-title">Visible columns</span>
                                    <div className="sidebar__filter-chips" role="group" aria-label="Visible columns">
                                        {visibleColumns.options.map(opt => {
                                            const isSelected = visibleColumns.value.includes(opt.value);
                                            return (
                                                <Chip
                                                    key={opt.value}
                                                    selected={isSelected}
                                                    onClick={() => {
                                                        const next = isSelected
                                                            ? visibleColumns.value.filter(v => v !== opt.value)
                                                            : [...visibleColumns.value, opt.value];
                                                        visibleColumns.onChange(next);
                                                    }}
                                                >
                                                    {opt.label}
                                                </Chip>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}

                        {normalizedOptionGroups.length > 0 && (viewToggle || groupBy || visibleColumns) && <Separator spacing={0} />}

                        {normalizedOptionGroups.map((group, groupIndex) => (
                            <div className="sidebar__option-group" key={group.id ?? group.label ?? groupIndex}>
                                {group.label && <span className="sidebar__option-group-label">{group.label}</span>}
                                {group.options.map((option, optionIndex) => {
                                    const previous = optionIndex > 0 ? group.options[optionIndex - 1] : undefined;
                                    const showSeparator = !!previous && previous.type !== option.type;
                                    return (
                                        <React.Fragment key={option.id}>
                                            {showSeparator && <Separator spacing={0} />}
                                            <div className={`sidebar__option sidebar__option--${option.type}`}>
                                                {option.type === 'checkbox' && (
                                                    <Chip
                                                        selected={option.value ?? false}
                                                        onClick={() => onOptionChange?.({ optionId: option.id, value: !(option.value ?? false) })}
                                                    >
                                                        {option.label}
                                                    </Chip>
                                                )}
                                                {option.type === 'radio' && (
                                                    <>
                                                        {option.label && <span className="sidebar__filter-title">{option.label}</span>}
                                                        <div className="sidebar__filter-list" role="radiogroup" aria-label={option.label}>
                                                            {option.options.map(radioOption => {
                                                                const isSelected = option.value === radioOption.value;
                                                                return (
                                                                    <div
                                                                        key={radioOption.value}
                                                                        className={`sidebar__filter-radio ${isSelected ? 'sidebar__filter-radio--selected' : ''}`}
                                                                    >
                                                                        <label className="sidebar__filter-radio-label">
                                                                            <input
                                                                                checked={isSelected}
                                                                                className="sidebar__filter-radio-input"
                                                                                name={`control-panel-option-${option.id}`}
                                                                                onChange={() => onOptionChange?.({ optionId: option.id, value: radioOption.value })}
                                                                                type="radio"
                                                                                value={radioOption.value}
                                                                            />
                                                                            <span className="sidebar__filter-label">{radioOption.label}</span>
                                                                        </label>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                                {option.type === 'chips' && (
                                                    <>
                                                        {option.label && <span className="sidebar__filter-title">{option.label}</span>}
                                                        <div className="sidebar__filter-chips" role="group" aria-label={option.label}>
                                                            {option.options.map(chipOption => {
                                                                const isSelected = option.value.includes(chipOption.value);
                                                                return (
                                                                    <Chip
                                                                        key={chipOption.value}
                                                                        selected={isSelected}
                                                                        onClick={() => {
                                                                            const next = isSelected
                                                                                ? option.value.filter(v => v !== chipOption.value)
                                                                                : [...option.value, chipOption.value];
                                                                            onOptionChange?.({ optionId: option.id, value: next });
                                                                        }}
                                                                    >
                                                                        {chipOption.label}
                                                                    </Chip>
                                                                );
                                                            })}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </aside>
        </>
    );
};
