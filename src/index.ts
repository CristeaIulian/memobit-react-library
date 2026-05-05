// Export components
export { Accordion, type AccordionProps, type AccordionItemData } from './components/Accordion';
export { AlertDialog } from './components/AlertDialog';
export { AppHeader, type AppHeaderProps } from './components/AppHeader';
export { AvatarInitials } from './components/AvatarInitials';
export { Badge, type BadgeVariant, type BadgeProps } from './components/Badge';
export { BMI } from './components/BMI';
export { Breadcrumb, type BreadcrumbItem } from './components/Breadcrumb';
export { Button } from './components/Button';
export { Calendar, type CalendarProps, type CalendarMode, type CalendarDateRange } from './components/Calendar';
export { CalendarHeatmap, type CalendarHeatmapProps, type CalendarHeatmapDataPoint } from './components/CalendarHeatmap';
export { Card } from './components/Card';
export { ChatBot } from './components/ChatBot';
export { Checkbox } from './components/Checkbox';
export { Chip, type ChipProps, type ChipSize, type ChipVariant } from './components/Chip';
export { CollapsibleSection } from './components/CollapsibleSection';
export { ConfirmDialog } from './components/ConfirmDialog';
export { CommandPalette, type CommandPaletteProps, type CommandItem } from './components/CommandPalette';
export { ContextMenu } from './components/ContextMenu';
export { CountryWithFlag } from './components/CountryWithFlag';
export { ColorPicker, type ColorPickerProps } from './components/ColorPicker';
export { EmojiPicker, type EmojiPickerProps } from './components/EmojiPicker';
export {
    DataView,
    type DataViewColumn,
    type DataViewProps,
    type DataViewCardConfig,
    type DataViewTimelineConfig,
    type DataViewEmptyConfig,
    type DataViewDisplayMode,
    type DataViewGroupConfig,
    type DataViewGroup,
    type DataViewGroupKey,
    type SortDirection,
} from './components/DataView';
export { DatePicker, type DatePickerProps } from './components/DatePicker';
export { DiffViewer } from './components/DiffViewer';
export { DateRangePicker, type DateRangePickerProps, type DateRangePreset } from './components/DateRangePicker';
export { Drawer, type DrawerHeaderAction, type DrawerPosition, type DrawerProps } from './components/Drawer';
export { Dropdown, type DropdownOption, type DropdownSelectedCountDisplay } from './components/Dropdown';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { FileDropzone, type FileDropzoneProps } from './components/FileDropzone';
export { Flag } from './components/Flag';
export { Icon, type IconName, type IconSize, type IconVariant } from './components/Icon';
export { FloatButton } from './components/FloatButton';
export { InputDate } from './components/InputDate';
export { InputEmail, validateEmail, type InputEmailProps } from './components/InputEmail';
export { InputFile } from './components/InputFile';
export { InputMask, InputMaskPresets, type InputMaskHandle } from './components/InputMask';
export { InputNumber } from './components/InputNumber';
export { InputPassword } from './components/InputPassword';
export { InputPhone } from './components/InputPhone';
export { InputText } from './components/InputText';
export { InputTime } from './components/InputTime';
export { InputUrl } from './components/InputUrl';
export { RichTextEditor } from './components/RichTextEditor';
export { List } from './components/List';
export { Loading } from './components/Loading';
export { MacronutrientsPieChart } from './components/MacronutrientsPieChart';
export { MenuHamburger, type MenuHamburgerItem } from './components/MenuHamburger';
export { NotificationPanel, type NotificationPanelItem } from './components/NotificationPanel';
export { Confetti, type ConfettiHandle } from './components/Confetti';
export { InfiniteScroll, type ScrollInfo } from './components/InfiniteScroll';
export {
    MiniStatsCard,
    type MiniStatsCardProps,
    type MiniStatsCardVariant,
    type MiniStatsCardAlign,
    type MiniStatsCardLabelPosition,
    type MiniStatsCardTrendVariant,
} from './components/MiniStatsCard';
export { Modal } from './components/Modal';
export { NavBar, type NavBarItem } from './components/NavBar';
export { Pagination } from './components/Pagination';
export { Popover, usePopover } from './components/Popover';
export { ProgressBar } from './components/ProgressBar';
export { QuickAdd } from './components/QuickAdd';
export { QuickNumberUpdate } from './components/QuickNumberUpdate';
export { QuickOptionUpdate } from './components/QuickOptionUpdate';
export { QuantitySelector, type QuantitySelectorProps } from './components/QuantitySelector';
export { Radio, type RadioProps } from './components/Radio';
export { Rating } from './components/Rating';
export { ScrollToTop } from './components/ScrollToTop';
export { Search, type SearchProps } from './components/Search';
export { Separator, type SeparatorProps, type SeparatorOrientation, type SeparatorStyle, type SeparatorAlign } from './components/Separator';
export { Sidebar, type SidebarItem, type SidebarProps, type SidebarSection, SidebarProvider, useSidebar } from './components/Sidebar';
export { ControlPanelProvider, useControlPanel, useControlPanelContext } from './components/ControlPanel';
export {
    ControlPanel,
    type ControlPanelProps,
    type ControlPanelHeader,
    type ControlPanelNavItem,
    type ControlPanelNavItemBadge,
    type ControlPanelAction,
    type ControlPanelFilter,
    type ControlPanelFilterOption,
    type ControlPanelFilterType,
    type ControlPanelFilterValue,
    type ControlPanelFilterChangeEvent,
    type ControlPanelClearFiltersEvent,
    type ControlPanelOption,
    type ControlPanelOptionGroup,
    type ControlPanelOptionItem,
    type ControlPanelOptionChangeEvent,
    type ControlPanelViewMode,
    type ControlPanelViewToggleConfig,
    type ControlPanelGroupByConfig,
    type ControlPanelVisibleColumnsConfig,
} from './components/ControlPanel';
export { SignalStrength } from './components/SignalStrength';
export { Skeleton, type SkeletonProps, type SkeletonVariant, type SkeletonAnimation } from './components/Skeleton';
export { Slider } from './components/Slider';
export { SplitPanel } from './components/SplitPanel';
export { SuggestionsList, type SuggestionsListElement } from './components/SuggestionsList';
export { Textarea } from './components/Textarea';
export { ThemeSettings, type ThemeSettingsProps, ThemeContext, ThemeProvider, useTheme } from './components/ThemeSettings';
export { TipsOfTheDay } from './components/TipsOfTheDay';
export { Toast, type ToastAction, type ToastDetails } from './components/Toast';
export { type ContextToastAction, ToastContainer, ToastProvider, type ToastType, useToast } from './components/ContextToast';
export { Timeline, type TimelineItem, type TimelineOrientation, type TimelineSize } from './components/Timeline';
export {
    TimelineMarkers,
    TimelineMarkerDot,
    TimelineMobileSeparator,
    calculateTimelineMarkers,
    type TimelineMarkerInfo,
    type TimelineMarkersItem,
} from './components/TimelineMarkers';
export { JourneyWizard, type JourneyStep, type JourneyWizardPresentation, type JourneyWizardProps } from './components/JourneyWizard';
export { ToggleButtons } from './components/ToggleButtons';
export { ToggleSwitch, type ToggleSwitchProps, type ToggleSwitchVariant } from './components/ToggleSwitch';
export { Tooltip, type TooltipPosition } from './components/Tooltip';
export { Tree, type TreeNode } from './components/Tree';
export { WHtR } from './components/WHtR';

// Export Auth components
export { Login as AuthLogin } from './components/Auth/Login';
export { ChangePasswordModal } from './components/Auth/ChangePasswordModal';

// Export Auth context
export { AuthContext, AuthProvider } from './contexts/AuthContext';

// Export Auth types
export type { User, LoginCredentials, LoginResponse, VerifyResponse, AuthConfig, AuthContextValue } from './types/auth.types';

// Export hooks
export { type Breakpoint, breakpoints, useBreakpoint } from './hooks/useBreakpoint';
export { useFiltersPersistence } from './hooks/useFiltersPersistence';
export { useBodyScrollLock } from './hooks/useBodyScrollLock';
export { useComponentEffect } from './hooks/useComponentEffect';
export { useAuth } from './hooks/useAuth';

// Export helpers
export {
    formatDuration,
    formatSecondsToMediaTime,
    formatDate,
    formatDateLocale,
    APP_DATE_FORMAT,
    formatAppDate,
    formatRelativeDuration,
    isSameDay,
    isDateInRange,
    getDaysInMonth,
    getMonthMatrix,
    isToday,
    isWeekend,
    addDays,
    addMonths,
    isBefore,
    isAfter,
    formatRelativeTime,
} from './helpers/Datetime';
export { FiltersStorage } from './helpers/FiltersStorage';
export { highlightText } from './helpers/Highlight';
export { format2Digits, getPercent, getPercentsOf2Numbers } from './helpers/Numbers';
export { slugify, shortenText, truncateText } from './helpers/Strings';
export { extractDomainFromUrl, stripQueryString, stripTrackingParams } from './helpers/Urls';
export { formatBigNumber, formatBytes, formatMoney } from './helpers/Format';
export { type LogicalOperator, matchStringsByLogicalOperator } from './helpers/LogicalOperators';
export { ensureHtml, htmlToMarkdown, htmlToPlainText, splitHtmlIntoSteps } from './helpers/HtmlContent';
export { fuzzyMatch } from './helpers/Search';
export { validateVin, type VinValidationResult } from './validators/Vin';
