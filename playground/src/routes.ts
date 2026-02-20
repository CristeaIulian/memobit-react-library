import React from 'react';

// Import pages
import { Home } from './pages/Home';
import { UseBreakpointPage } from './pages/UseBreakpointPage';
import { AccordionPage } from './pages/AccordionPage';
import { AlertDialogPage } from './pages/AlertDialogPage';
import { AuthLoginPage } from './pages/AuthLoginPage';
import { AvatarInitialsPage } from './pages/AvatarInitialsPage';
import { BadgePage } from './pages/BadgePage';
import { BMIHorizontalBarIndicatorPage } from './pages/BMIHorizontalBarIndicatorPage';
import { BreadcrumbPage } from './pages/BreadcrumbPage';
import { ButtonPage } from './pages/ButtonPage';
import { CalendarPage } from './pages/CalendarPage';
import { CardPage } from './pages/CardPage';
import { ChatBotPage } from './pages/ChatBotPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { CollapsibleSectionPage } from './pages/CollapsibleSectionPage';
import { ColorPickerPage } from './pages/ColorPickerPage';
import { CommandPalettePage } from './pages/CommandPalettePage';
import { ConfirmDialogPage } from './pages/ConfirmDialogPage';
import { ContextMenuPage } from './pages/ContextMenuPage';
import { ContextToastPage } from './pages/ContextToastPage';
import { CountryWithFlagPage } from './pages/CountryWithFlagPage';
import { DataTablePage } from './pages/DataTablePage';
import { DatePickerPage } from './pages/DatePickerPage';
import { DateRangePickerPage } from './pages/DateRangePickerPage';
import { DrawerPage } from './pages/DrawerPage';
import { DropdownPage } from './pages/DropdownPage';
import { EmptyStatePage } from './pages/EmptyStatePage';
import { FileDropzonePage } from './pages/FileDropzonePage';
import { FlagPage } from './pages/FlagPage';
import { FloatButtonPage } from './pages/FloatButtonPage';
import { InputDatePage } from './pages/InputDatePage';
import { InputFilePage } from './pages/InputFilePage';
import { InputEmailPage } from './pages/InputEmailPage';
import { InputNumberPage } from './pages/InputNumberPage';
import { InputPasswordPage } from './pages/InputPasswordPage';
import { InputPhonePage } from './pages/InputPhonePage';
import { InputTextPage } from './pages/InputTextPage';
import { InputTimePage } from './pages/InputTimePage';
import { ListPage } from './pages/ListPage';
import { LoadingPage } from './pages/LoadingPage';
import { MacronutrientsPieChartPage } from './pages/MacronutrientsPieChartPage';
import { MenuHamburgerPage } from './pages/MenuHamburgerPage';
import { MiniStatsCardPage } from './pages/MiniStatsCardPage';
import { ModalPage } from './pages/ModalPage';
import { NavBarPage } from './pages/NavBarPage';
import { PaginationPage } from './pages/PaginationPage';
import { PopoverPage } from './pages/PopoverPage';
import { ProgressBarPage } from './pages/ProgressBarPage';
import { QuickAddPage } from './pages/QuickAddPage';
import { QuickNumberUpdatePage } from './pages/QuickNumberUpdatePage';
import { QuickOptionUpdatePage } from './pages/QuickOptionUpdatePage';
import { RadioPage } from './pages/RadioPage';
import { RatingPage } from './pages/RatingPage';
import { SearchPage } from './pages/SearchPage';
import { SeparatorPage } from './pages/SeparatorPage';
import { SignalStrengthPage } from './pages/SignalStrengthPage';
import { SidebarPage } from './pages/SidebarPage';
import { SkeletonPage } from './pages/SkeletonPage';
import { SliderPage } from './pages/SliderPage';
import { SuggestionsListPage } from './pages/SuggestionsListPage';
import { TextareaPage } from './pages/TextareaPage';
import { ThemeModalPage } from './pages/ThemeModalPage';
import { TipsOfTheDayPage } from './pages/TipsOfTheDayPage';
import { ToastPage } from './pages/ToastPage';
import { ToggleButtonsPage } from './pages/ToggleButtonsPage';
import { ToggleSwitchPage } from './pages/ToggleSwitchPage';
import { TooltipPage } from './pages/TooltipPage';

export interface RouteConfig {
    path: string;
    label: string;
    component: React.ComponentType;
}

export const routes: RouteConfig[] = [
    { path: '/', label: 'Home', component: Home },
    { path: '/use-breakpoint', label: 'useBreakpoint Hook', component: UseBreakpointPage },
    { path: '/accordion', label: 'Accordion', component: AccordionPage },
    { path: '/alert-dialog', label: 'Alert Dialog', component: AlertDialogPage },
    { path: '/auth-login', label: 'Auth Login', component: AuthLoginPage },
    { path: '/avatar-initials', label: 'Avatar Initials', component: AvatarInitialsPage },
    { path: '/badge', label: 'Badge', component: BadgePage },
    { path: '/bmi-horizontal-bar-indicator', label: 'BMI Horizontal Bar Indicator', component: BMIHorizontalBarIndicatorPage },
    { path: '/breadcrumb', label: 'Breadcrumb', component: BreadcrumbPage },
    { path: '/button', label: 'Button', component: ButtonPage },
    { path: '/calendar', label: 'Calendar', component: CalendarPage },
    { path: '/card', label: 'Card', component: CardPage },
    { path: '/chatbot', label: 'ChatBot', component: ChatBotPage },
    { path: '/checkbox', label: 'Checkbox', component: CheckboxPage },
    { path: '/collapsible-section', label: 'Collapsible Section', component: CollapsibleSectionPage },
    { path: '/color-picker', label: 'Color Picker', component: ColorPickerPage },
    { path: '/command-palette', label: 'Command Palette', component: CommandPalettePage },
    { path: '/confirm-dialog', label: 'Confirm Dialog', component: ConfirmDialogPage },
    { path: '/context-menu', label: 'Context Menu', component: ContextMenuPage },
    { path: '/context-toast', label: 'Context Toast', component: ContextToastPage },
    { path: '/country-with-flag', label: 'Country With Flag', component: CountryWithFlagPage },
    { path: '/data-table', label: 'Data Table', component: DataTablePage },
    { path: '/datepicker', label: 'DatePicker', component: DatePickerPage },
    { path: '/date-range-picker', label: 'Date Range Picker', component: DateRangePickerPage },
    { path: '/drawer', label: 'Drawer', component: DrawerPage },
    { path: '/dropdown', label: 'Dropdown', component: DropdownPage },
    { path: '/empty-state', label: 'Empty State', component: EmptyStatePage },
    { path: '/file-dropzone', label: 'File Dropzone', component: FileDropzonePage },
    { path: '/flag', label: 'Flag', component: FlagPage },
    { path: '/float-button', label: 'Float Button', component: FloatButtonPage },
    { path: '/input-date', label: 'Input Date', component: InputDatePage },
    { path: '/input-file', label: 'Input File', component: InputFilePage },
    { path: '/input-email', label: 'Input Email', component: InputEmailPage },
    { path: '/input-number', label: 'Input Number', component: InputNumberPage },
    { path: '/input-password', label: 'Input Password', component: InputPasswordPage },
    { path: '/input-phone', label: 'Input Phone', component: InputPhonePage },
    { path: '/input-text', label: 'Input Text', component: InputTextPage },
    { path: '/input-time', label: 'Input Time', component: InputTimePage },
    { path: '/list', label: 'List', component: ListPage },
    { path: '/loading', label: 'Loading', component: LoadingPage },
    { path: '/macronutrients-pie-chart', label: 'Macronutrients Pie Chart', component: MacronutrientsPieChartPage },
    { path: '/menu-hamburger', label: 'Menu Hamburger', component: MenuHamburgerPage },
    { path: '/mini-stats-card', label: 'Mini Stats Card', component: MiniStatsCardPage },
    { path: '/modal', label: 'Modal', component: ModalPage },
    { path: '/navbar', label: 'NavBar', component: NavBarPage },
    { path: '/pagination', label: 'Pagination', component: PaginationPage },
    { path: '/popover', label: 'Popover', component: PopoverPage },
    { path: '/progress-bar', label: 'Progress Bar', component: ProgressBarPage },
    { path: '/quick-add', label: 'Quick Add', component: QuickAddPage },
    { path: '/quick-number-update', label: 'Quick Number Update', component: QuickNumberUpdatePage },
    { path: '/quick-option-update', label: 'Quick Option Update', component: QuickOptionUpdatePage },
    { path: '/radio', label: 'Radio', component: RadioPage },
    { path: '/rating', label: 'Rating', component: RatingPage },
    { path: '/search', label: 'Search', component: SearchPage },
    { path: '/separator', label: 'Separator', component: SeparatorPage },
    { path: '/signal-strength', label: 'Signal Strength', component: SignalStrengthPage },
    { path: '/sidebar', label: 'Sidebar', component: SidebarPage },
    { path: '/skeleton', label: 'Skeleton', component: SkeletonPage },
    { path: '/slider', label: 'Slider', component: SliderPage },
    { path: '/suggestions-list', label: 'Suggestions List', component: SuggestionsListPage },
    { path: '/textarea', label: 'Textarea', component: TextareaPage },
    { path: '/theme-modal', label: 'Theme Modal', component: ThemeModalPage },
    { path: '/tips-of-the-day', label: 'Tips Of The Day', component: TipsOfTheDayPage },
    { path: '/toast', label: 'Toast', component: ToastPage },
    { path: '/toggle-buttons', label: 'Toggle Buttons', component: ToggleButtonsPage },
    { path: '/toggle-switch', label: 'Toggle Switch', component: ToggleSwitchPage },
    { path: '/tooltip', label: 'Tooltip', component: TooltipPage },
];

// Alphabetically sorted routes for sidebar (excluding Home)
export const sortedRoutes = routes.filter(r => r.path !== '/').sort((a, b) => a.label.localeCompare(b.label));
