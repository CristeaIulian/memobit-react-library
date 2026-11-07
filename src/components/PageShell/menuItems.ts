import { MenuHamburgerItem } from '../MenuHamburger';

import { AppNavItem, PageAction } from './PageShell.types';

/** A phone shows the sections as a bottom tab bar up to this many; past it they move into the menu. */
export const MAX_TAB_BAR_ITEMS = 5;

const toMenuItems = (actions: PageAction[]): MenuHamburgerItem[] =>
    actions.map(action => ({
        label: action.label,
        icon: action.icon,
        onClick: action.onClick,
        isActive: false,
        separator: action.separator,
        disabled: action.disabled,
    }));

/** The actions shown as buttons: everything not marked `menu`. */
export const getButtonActions = (actions: PageAction[]): PageAction[] => actions.filter(action => !action.menu);

/**
 * The page menu: the page's menu-only actions (and, where buttons don't fit, all its other actions too),
 * then the app's own entries such as the account menu.
 */
export const getMenuItems = (actions: PageAction[], frameItems: MenuHamburgerItem[], foldButtons: boolean): MenuHamburgerItem[] => [
    ...toMenuItems(foldButtons ? actions : actions.filter(action => action.menu)),
    ...frameItems,
];

/** The app's sections as menu entries, for a phone with more sections than its tab bar holds. */
export const navToMenuItems = (nav: AppNavItem[]): MenuHamburgerItem[] =>
    nav.map(item => ({ label: item.label, icon: item.icon, onClick: item.onSelect, isActive: item.isActive }));
