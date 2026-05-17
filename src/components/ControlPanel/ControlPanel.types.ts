import { ReactNode } from 'react';

import { ButtonProps } from '../Button';
import { DropdownOption } from '../Dropdown';
import { IconName } from '../Icon';

export interface ControlPanelHeader {
    icon?: IconName;
    emoji?: string;
    svg?: ReactNode;
    appName?: string;
    siteName?: string;
    heading?: string;
    onClick?: () => void;
}

export interface ControlPanelAction {
    id: string;
    label: string;
    onClick?: ButtonProps['onClick'];
    icon?: IconName;
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

export interface ControlPanelDateRangePreset {
    label: string;
    days: number;
}

export type ControlPanelFilterType = 'radio' | 'chips' | 'dropdown' | 'text' | 'number' | 'rating' | 'range' | 'date-range' | 'search' | 'date' | 'checkbox';
export type ControlPanelFilterValue = string | number | boolean | string[] | number[] | null;

export interface ControlPanelFilter {
    id: string;
    label: string;
    icon?: IconName;
    type: ControlPanelFilterType;
    options?: ControlPanelFilterOption[];
    value?: ControlPanelFilterValue;
    count?: number | string;
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
    presets?: ControlPanelDateRangePreset[];
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

export type ControlPanelViewMode = 'table' | 'cards' | 'gallery';

export interface ControlPanelViewToggleConfig {
    value: string;
    showGallery?: boolean;
    onChange: (value: ControlPanelViewMode) => void;
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

export interface ControlPanelNavItemBadge {
    count: number;
    variant: 'danger' | 'warning';
}

export interface ControlPanelNavItem {
    id: string;
    label: string;
    isActive: boolean;
    onClick?: () => void;
    icon?: IconName;
    color?: string;
    count?: number;
    badges?: ControlPanelNavItemBadge[];
    children?: ControlPanelNavItem[];
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean, item: ControlPanelNavItem) => void;
}

export interface ControlPanelProps {
    width?: string;
    className?: string;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    showOverlay?: boolean;
    contained?: boolean;
    shadow?: string;
    header?: ControlPanelHeader;
    navigation?: ControlPanelNavItem[];
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

export const DEFAULT_DATE_RANGE_PRESETS: ControlPanelDateRangePreset[] = [
    { label: '7d', days: 7 },
    { label: '14d', days: 14 },
    { label: '30d', days: 30 },
    { label: '90d', days: 90 },
];
