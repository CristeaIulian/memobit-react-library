// Export components
export { Accordion, type AccordionProps, type AccordionItemData } from './components/Accordion';
export { AlertDialog } from './components/AlertDialog';
export { AvatarInitials } from './components/AvatarInitials';
export { Badge, type BadgeVariant } from './components/Badge';
export { BMIHorizontalBarIndicator } from './components/BMIHorizontalBarIndicator';
export { Breadcrumb, type BreadcrumbItem } from './components/Breadcrumb';
export { Button } from './components/Button';
export { Calendar, type CalendarProps, type CalendarMode, type CalendarDateRange } from './components/Calendar';
export { Card } from './components/Card';
export { ChatBot } from './components/ChatBot';
export { Checkbox } from './components/Checkbox';
export { CollapsibleSection } from './components/CollapsibleSection';
export { ConfirmDialog } from './components/ConfirmDialog';
export { CommandPalette, type CommandPaletteProps, type CommandItem } from './components/CommandPalette';
export { ContextMenu } from './components/ContextMenu';
export { CountryWithFlag } from './components/CountryWithFlag';
export { ColorPicker, type ColorPickerProps } from './components/ColorPicker';
export { DataTable, type DataTableColumn, type DataTableProps, type SortDirection } from './components/DataTable';
export { DatePicker, type DatePickerProps } from './components/DatePicker';
export { DateRangePicker, type DateRangePickerProps } from './components/DateRangePicker';
export { Drawer, type DrawerPosition } from './components/Drawer';
export { Dropdown, type DropdownOption, type DropdownSelectedCountDisplay } from './components/Dropdown';
export { EmptyState, type EmptyStateProps } from './components/EmptyState';
export { FileDropzone, type FileDropzoneProps } from './components/FileDropzone';
export { Flag } from './components/Flag';
export { FloatButton } from './components/FloatButton';
export { InputDate } from './components/InputDate';
export { InputEmail, validateEmail, type InputEmailProps } from './components/InputEmail';
export { InputFile } from './components/InputFile';
export { InputNumber } from './components/InputNumber';
export { InputPassword } from './components/InputPassword';
export { InputPhone } from './components/InputPhone';
export { InputText } from './components/InputText';
export { InputTime } from './components/InputTime';
export { List } from './components/List';
export { Loading } from './components/Loading';
export { MacronutrientsPieChart } from './components/MacronutrientsPieChart';
export { MenuHamburger, type MenuHamburgerItem } from './components/MenuHamburger';
export {
    MiniStatsCard,
    type MiniStatsCardProps,
    type MiniStatsCardVariant,
    type MiniStatsCardAlign,
    type MiniStatsCardLabelPosition,
    type MiniStatsCardTrendVariant,
} from './components/MiniStatsCard';
export { Modal, type ModalButtonConfig } from './components/Modal';
export { NavBar, type NavBarItem } from './components/NavBar';
export { Pagination } from './components/Pagination';
export { Popover, usePopover } from './components/Popover';
export { ProgressBar } from './components/ProgressBar';
export { QuickAdd } from './components/QuickAdd';
export { QuickNumberUpdate } from './components/QuickNumberUpdate';
export { QuickOptionUpdate } from './components/QuickOptionUpdate';
export { Radio } from './components/Radio';
export { Rating } from './components/Rating';
export { Search, type SearchProps } from './components/Search';
export { Separator, type SeparatorProps, type SeparatorOrientation, type SeparatorStyle, type SeparatorAlign } from './components/Separator';
export { Sidebar, type SidebarItem, type SidebarSection } from './components/Sidebar';
export { SignalStrength } from './components/SignalStrength';
export { Skeleton, type SkeletonProps, type SkeletonVariant, type SkeletonAnimation } from './components/Skeleton';
export { Slider } from './components/Slider';
export { SuggestionsList, type SuggestionsListElement } from './components/SuggestionsList';
export { Textarea } from './components/Textarea';
export { ThemeModal, ThemeContext, ThemeProvider, useTheme } from './components/ThemeModal';
export { TipsOfTheDay } from './components/TipsOfTheDay';
export { Toast, type ToastAction, type ToastDetails } from './components/Toast';
export { ToastContainer, ToastProvider, type ToastType, useToast } from './components/ContextToast';
export { ToggleButtons } from './components/ToggleButtons';
export { ToggleSwitch, type ToggleSwitchProps, type ToggleSwitchVariant } from './components/ToggleSwitch';
export { Tooltip, type TooltipPosition } from './components/Tooltip';

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
} from './helpers/Datetime';
export { FiltersStorage } from './helpers/FiltersStorage';
export { format2Digits, getPercent, getPercentsOf2Numbers } from './helpers/Numbers';
export { slugify, shortenText, truncateText } from './helpers/Strings';
export { extractDomainFromUrl } from './helpers/Urls';
export { formatBigNumber, formatMoney } from './helpers/Format';
export { type LogicalOperator, matchStringsByLogicalOperator } from './helpers/LogicalOperators';
