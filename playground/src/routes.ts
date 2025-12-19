import React from 'react';

// Import pages
import { Home } from './pages/Home';
import { UseBreakpointPage } from './pages/UseBreakpointPage';
import { BMIHorizontalBarIndicatorPage } from './pages/BMIHorizontalBarIndicatorPage';
import { BreadcrumbPage } from './pages/BreadcrumbPage';
import { ButtonPage } from './pages/ButtonPage';
import { CardPage } from './pages/CardPage';
import { ChatBotPage } from './pages/ChatBotPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { CollapsibleSectionPage } from './pages/CollapsibleSectionPage';
import { ConfirmDialogPage } from './pages/ConfirmDialogPage';
import { ContextMenuPage } from './pages/ContextMenuPage';
import { DropdownPage } from './pages/DropdownPage';
import { FloatButtonPage } from './pages/FloatButtonPage';
import { InformationTooltipPage } from './pages/InformationTooltipPage';
import { InputFilePage } from './pages/InputFilePage';
import { InputNumberPage } from './pages/InputNumberPage';
import { InputTextPage } from './pages/InputTextPage';
import { MenuHamburgerPage } from './pages/MenuHamburgerPage';
import { ModalPage } from './pages/ModalPage';
import { PaginationPage } from './pages/PaginationPage';
import { PopoverPage } from './pages/PopoverPage';
import { ProgressBarPage } from './pages/ProgressBarPage';
import { RadioPage } from './pages/RadioPage';
import { RatingPage } from './pages/RatingPage';
import { SliderPage } from './pages/SliderPage';
import { SuggestionsListPage } from './pages/SuggestionsListPage';
import { TextareaPage } from './pages/TextareaPage';
import { ThemeModalPage } from './pages/ThemeModalPage';
import { TipsOfTheDayPage } from './pages/TipsOfTheDayPage';
import { ToastPage } from './pages/ToastPage';
import { ToggleButtonsPage } from './pages/ToggleButtonsPage';
import { ToggleSwitchPage } from './pages/ToggleSwitchPage';

export interface RouteConfig {
    path: string;
    label: string;
    component: React.ComponentType;
}

export const routes: RouteConfig[] = [
    { path: '/', label: 'Home', component: Home },
    { path: '/use-breakpoint', label: 'useBreakpoint Hook', component: UseBreakpointPage },
    { path: '/bmi-horizontal-bar-indicator', label: 'BMI Horizontal Bar Indicator', component: BMIHorizontalBarIndicatorPage },
    { path: '/breadcrumb', label: 'Breadcrumb', component: BreadcrumbPage },
    { path: '/button', label: 'Button', component: ButtonPage },
    { path: '/card', label: 'Card', component: CardPage },
    { path: '/chatbot', label: 'ChatBot', component: ChatBotPage },
    { path: '/checkbox', label: 'Checkbox', component: CheckboxPage },
    { path: '/collapsible-section', label: 'Collapsible Section', component: CollapsibleSectionPage },
    { path: '/confirm-dialog', label: 'Confirm Dialog', component: ConfirmDialogPage },
    { path: '/context-menu', label: 'Context Menu', component: ContextMenuPage },
    { path: '/dropdown', label: 'Dropdown', component: DropdownPage },
    { path: '/float-button', label: 'Float Button', component: FloatButtonPage },
    { path: '/information-tooltip', label: 'Information Tooltip', component: InformationTooltipPage },
    { path: '/input-file', label: 'Input File', component: InputFilePage },
    { path: '/input-number', label: 'Input Number', component: InputNumberPage },
    { path: '/input-text', label: 'Input Text', component: InputTextPage },
    { path: '/menu-hamburger', label: 'Menu Hamburger', component: MenuHamburgerPage },
    { path: '/modal', label: 'Modal', component: ModalPage },
    { path: '/pagination', label: 'Pagination', component: PaginationPage },
    { path: '/popover', label: 'Popover', component: PopoverPage },
    { path: '/progress-bar', label: 'Progress Bar', component: ProgressBarPage },
    { path: '/radio', label: 'Radio', component: RadioPage },
    { path: '/rating', label: 'Rating', component: RatingPage },
    { path: '/slider', label: 'Slider', component: SliderPage },
    { path: '/suggestions-list', label: 'Suggestions List', component: SuggestionsListPage },
    { path: '/textarea', label: 'Textarea', component: TextareaPage },
    { path: '/theme-modal', label: 'Theme Modal', component: ThemeModalPage },
    { path: '/tips-of-the-day', label: 'Tips Of The Day', component: TipsOfTheDayPage },
    { path: '/toast', label: 'Toast', component: ToastPage },
    { path: '/toggle-buttons', label: 'Toggle Buttons', component: ToggleButtonsPage },
    { path: '/toggle-switch', label: 'Toggle Switch', component: ToggleSwitchPage },
];

// Alphabetically sorted routes for sidebar (excluding Home)
export const sortedRoutes = routes
    .filter(r => r.path !== '/')
    .sort((a, b) => a.label.localeCompare(b.label));
