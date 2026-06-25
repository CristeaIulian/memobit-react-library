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

export interface ControlPanelActionConfirmButton {
    text?: string;
    icon?: IconName;
    variant?: ButtonProps['variant'];
}

export interface ControlPanelActionConfirm {
    /** Short heading shown above the message. Defaults to the action's label. */
    title?: string;
    /** Optional explanatory body. */
    message?: string;
    /** Optional leading icon next to the title. */
    icon?: IconName;
    /** Popover placement relative to the action button. Defaults to 'right'
     *  so the popover floats out into the main content area instead of
     *  obscuring the rest of the sidebar. */
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
    /** Overrides for the confirm (primary) button label/icon/variant.
     *  The click handler always comes from the parent `ControlPanelAction.onClick`. */
    confirm?: ControlPanelActionConfirmButton;
    /** Overrides for the cancel (secondary) button. */
    cancel?: ControlPanelActionConfirmButton;
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
    /** When set, clicking the action opens a small confirmation popover anchored
     *  to the button instead of firing onClick directly. onClick fires only after
     *  the user picks the confirm option inside the popover. */
    confirm?: ControlPanelActionConfirm;
}

export interface ControlPanelFilterOption extends DropdownOption {
    color?: string;
    count?: number | string;
    /** Optional image URL rendered as a small round avatar before the option label.
     *  Used by the `chips` filter to show a face crop / product thumbnail / etc. */
    imageUrl?: string;
    /** Optional icon rendered before the option label (chips filter today). */
    icon?: IconName;
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
    /** Optional cap on the rendered options area. When set, the chip/option
     *  list becomes vertically scrollable past this height. Number is taken as
     *  px; string is passed through (`'40vh'`, `'320px'`, etc.). Omit to let
     *  the list expand freely. Honored by the `chips` filter today. */
    maxHeight?: string | number;
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
    /** Optional hover tooltip describing the option. */
    title?: string;
    /** When true, the item cannot be selected. */
    disabled?: boolean;
    /** Optional icon rendered before the option label (radio + chips options). */
    icon?: IconName;
}

export type ControlPanelOption =
    | { id: string; label: string; type: 'checkbox'; value?: boolean; icon?: IconName }
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

export interface ControlPanelViewToggleOption {
    value: ControlPanelViewMode;
    label: string;
    icon: IconName;
}

export interface ControlPanelViewToggleConfig {
    value: string;
    showGallery?: boolean;
    /** Override the default Grid/Table/Gallery buttons with custom labels and icons. */
    options?: ControlPanelViewToggleOption[];
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
    /** Visually fades the item (e.g. a toggled-off entry) while keeping it clickable. */
    dimmed?: boolean;
    onClick?: () => void;
    icon?: IconName;
    color?: string;
    count?: number | string;
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
    /** Removes the desktop margin and border-radius so the panel sits flush against content. */
    flush?: boolean;
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
