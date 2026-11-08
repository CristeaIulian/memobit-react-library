import { ReactNode } from 'react';

import type { UseAccountMenuOptions } from '../../hooks/useAccountMenu';
import { ButtonVariant } from '../Button';
import { IconName } from '../Icon';
import { MenuHamburgerItem } from '../MenuHamburger';

/** What a filter's data is. The widget is chosen from this, the option count and where the filter sits. */
export type FilterKind = 'single' | 'multi' | 'range' | 'rating' | 'toggle' | 'text' | 'date' | 'date-range';

/** Forces one widget for a `single` or `multi` filter instead of letting the shell choose. */
export type FilterControl = 'segmented' | 'radio' | 'chips' | 'checklist' | 'search-list';

/** `pinned` filters start open and stay in sight; `secondary` ones sit at the end. */
export type FilterPriority = 'pinned' | 'default' | 'secondary';

/** Where a filter is drawn: the desktop side column or tablet drawer (`panel`), or the phone sheet (`sheet`). */
export type FilterContext = 'panel' | 'sheet';

export interface FilterOption {
    value: string | number;
    label: string;
    /** How many items carry this option. Shown next to the option when present. */
    count?: number | string;
    icon?: IconName;
    color?: string;
}

export interface FilterMode {
    value: string;
    label: string;
}

interface FilterSpecBase {
    id: string;
    label: string;
    priority?: FilterPriority;
    /**
     * The value the page starts with, when it isn't the empty one (e.g. status "Open", "last 30 days").
     * At this value the filter doesn't count as applied and shows no chip; removing its chip returns to it.
     */
    defaultValue?: FilterValue;
}

export interface SingleFilterSpec extends FilterSpecBase {
    kind: 'single';
    options: FilterOption[];
    control?: FilterControl;
}

export interface MultiFilterSpec extends FilterSpecBase {
    kind: 'multi';
    options: FilterOption[];
    control?: FilterControl;
    /**
     * What the applied chips list: the picked options (default), or the ones left out ("Without X"). Use `excluded`
     * with a `defaultValue` of every option, for filters where everything is on until the user turns some off.
     */
    chips?: 'selected' | 'excluded';
}

export interface RangeFilterSpec extends FilterSpecBase {
    kind: 'range';
    min: number;
    max: number;
    step?: number;
    unit?: string;
}

export interface RatingFilterSpec extends FilterSpecBase {
    kind: 'rating';
    max: number;
}

export interface ToggleFilterSpec extends FilterSpecBase {
    kind: 'toggle';
    /** How many items the toggle leaves, shown beside its label. */
    count?: number;
}

export interface TextFilterSpec extends FilterSpecBase {
    kind: 'text';
    placeholder?: string;
    /** Adds the standard "Any word / All words" choice; the value's `mode` is then a LogicalOperator ('or' or 'and'). */
    wordMatch?: boolean;
    /** Custom ways to match the typed text, when `wordMatch` doesn't fit. The first one is the default. */
    modes?: FilterMode[];
}

export interface DateFilterSpec extends FilterSpecBase {
    kind: 'date';
    /** Whether items on or after the date match (`since`, the default) or on or before it (`until`). */
    relation?: 'since' | 'until';
    /** The earliest and latest days the picker offers, as 'YYYY-MM-DD'. */
    min?: string;
    max?: string;
}

/** A span of days. Either end may stay open, e.g. a value saved from an older "from" filter. */
export interface DateRangeFilterSpec extends FilterSpecBase {
    kind: 'date-range';
    /** The earliest and latest days the picker offers, as 'YYYY-MM-DD'. */
    min?: string;
    max?: string;
}

export type FilterSpec =
    SingleFilterSpec | MultiFilterSpec | RangeFilterSpec | RatingFilterSpec | ToggleFilterSpec | TextFilterSpec | DateFilterSpec | DateRangeFilterSpec;

export interface TextFilterValue {
    text: string;
    mode?: string;
}

/**
 * A filter's value. By kind: single → option value or null; multi → option values; range → [min, max]
 * or null; rating → the minimum (0 for any); toggle → boolean; text → TextFilterValue; date → 'YYYY-MM-DD' or null;
 * date-range → ['YYYY-MM-DD', 'YYYY-MM-DD'] with '' for an open end, or null.
 */
export type FilterValue = string | number | boolean | null | Array<string | number> | TextFilterValue;

export type PageFilterValues = Record<string, FilterValue | undefined>;

export interface PageAction {
    id: string;
    label: string;
    icon?: IconName;
    variant?: ButtonVariant;
    disabled?: boolean;
    /** A hover hint on the button, e.g. why it is disabled ("Run a scan first"). */
    tooltip?: string;
    /** Always listed in the page menu, never as a button: for occasional actions such as "Manage locations". */
    menu?: boolean;
    /** In the menu, draws a divider above this action to start a new group. */
    separator?: boolean;
    onClick: () => void;
}

export interface PageSearch {
    value: string;
    placeholder?: string;
    /** Focuses the box when the page opens, for pages whose main job is searching. */
    autoFocus?: boolean;
    onChange: (value: string) => void;
}

export type PageSortDirection = 'asc' | 'desc';

export interface PageSortValue {
    field: string;
    direction: PageSortDirection;
}

export interface PageSort {
    fields: Array<{ value: string; label: string }>;
    value: PageSortValue;
    /** Marks the sort as changed from the page's default. */
    highlighted?: boolean;
    onChange: (value: PageSortValue) => void;
}

export interface PageViewMode {
    value: string;
    label: string;
    icon: IconName;
}

/** View modes the lib knows: name one and it brings its own translated label and icon. */
export type BuiltInViewMode = 'cards' | 'table' | 'gallery' | 'calendar' | 'map';

export interface PageColumns {
    options: Array<{ value: string; label: string }>;
    /** The visible ones. */
    value: string[];
    onChange: (value: string[]) => void;
}

export interface PageGroupBy {
    options: Array<{ value: string; label: string }>;
    /** The grouping field, or null for no grouping. */
    value: string | null;
    onChange: (value: string | null) => void;
}

/** An on/off display preference shown with the view options, e.g. "Hide empty fields in cards". */
export interface PageViewToggle {
    id: string;
    label: string;
    value: boolean;
    onChange: (value: boolean) => void;
}

/** A display setting that always holds one of its options (currency, whose figures). Not a filter: it never counts as applied. */
export interface PageViewChoice {
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
}

export interface PageView {
    /** The ways to show the list. Leave out (or pass one) for a page with a single way; the other options still show. */
    modes?: Array<BuiltInViewMode | PageViewMode>;
    value?: string;
    onChange?: (value: string) => void;
    /** Optional fields the user can show or hide. Listed with the view options, closed until opened. */
    columns?: PageColumns;
    groupBy?: PageGroupBy;
    toggles?: PageViewToggle[];
    choices?: PageViewChoice[];
}

/** One part of a page that has several (settings tabs, dashboard sections, one car's records). */
export interface PageTab {
    value: string;
    label: string;
    icon?: IconName;
    count?: number;
    /** Colours the tab while it isn't the current one, to flag what it holds (e.g. overdue items). */
    tone?: 'warning' | 'danger';
}

export interface PageTabs {
    items: PageTab[];
    value: string;
    onChange: (value: string) => void;
}

export interface PagePagination {
    /** 1-indexed. */
    page: number;
    pageCount: number;
    onChange: (page: number) => void;
}

/** What the list holds, singular and plural, in the app's language: { one: 'recipe', other: 'recipes' }. */
export interface PageNoun {
    one: string;
    other: string;
}

export interface PageCounts {
    /** Items left after filtering and search. */
    shown: number;
    /** All items. */
    total: number;
}

/** The layouts built so far. More shells (bar, catalog, scope, focus) arrive as pages need them. */
export type PageShellLayout = 'workbench';

export interface PageShellProps {
    layout?: PageShellLayout;
    title: string;
    /** The list's size. With `noun` it heads the page ("38 of 171 recipes") and labels the "Show 38 recipes" buttons. */
    counts?: PageCounts;
    noun?: PageNoun;
    /** Extra text for the line under the title, after the counts: e.g. "12 favourites". */
    heading?: string;
    primaryAction?: PageAction;
    /** Secondary actions: shown as buttons on desktop, folded into the menu on smaller screens. */
    actions?: PageAction[];
    search?: PageSearch;
    sort?: PageSort;
    view?: PageView;
    filters?: FilterSpec[];
    values?: PageFilterValues;
    onFilterChange?: (id: string, value: FilterValue) => void;
    onClearFilters?: () => void;
    /** Overrides the text of the "Show N" buttons, which otherwise comes from `noun` ("Show N results" without one). */
    resultLabel?: (count: number) => string;
    /** The list's current page, shown at the top (beside the applied filters) once there is more than one. */
    pagination?: PagePagination;
    /** Switches between the parts of this page; drawn under the toolbar. Not for app sections, which belong in the frame's nav. */
    tabs?: PageTabs;
    /** This page's own indicator (e.g. an overdue bell), shown where the frame's `status` goes, in its place. */
    status?: ReactNode;
    children: ReactNode;
}

export interface AppIdentity {
    name: string;
    icon?: IconName;
    /** The app's own logo, used instead of `icon`: an image URL (e.g. '/icon.svg') or any element. */
    logo?: ReactNode;
    onHomeClick?: () => void;
}

/** One of the app's sections. Shown as a side list on desktop, an icon rail on tablet and a bottom tab bar on phone. */
export interface AppNavItem {
    id: string;
    label: string;
    icon: IconName;
    count?: number;
    isActive: boolean;
    onSelect: () => void;
}

export interface AppFrameTheme {
    /** Shown in the theme dialog's "For <app>" recommended filter. */
    appName: string;
    label?: string;
}

export interface AppFrameProps {
    app: AppIdentity;
    /** The app's sections. With react-router, RouterAppFrame from '@memobit/libs/router' builds these from paths. */
    nav?: AppNavItem[];
    /** Adds the account menu (theme, password, two-factor, logout) and mounts the dialogs it opens. Needs an AuthProvider above. */
    account?: UseAccountMenuOptions;
    /** For apps without sign-in: adds just the Theme entry and its dialog. `account` already includes it. */
    theme?: AppFrameTheme;
    /** App-specific menu entries, listed before the account ones. Page actions join them on small screens. */
    menuItems?: MenuHamburgerItem[];
    /** An app-wide indicator shown beside the page menu on every page and device: a notifications bell, a monitor's health. Keep it small. */
    status?: ReactNode;
    children: ReactNode;
}
