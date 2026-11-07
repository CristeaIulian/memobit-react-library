import { MenuHamburgerItem } from '../MenuHamburger';

import { PageAction } from './PageShell.types';

/** Page actions as menu entries, for screens where they fold into the menu. */
export const toMenuItems = (actions: PageAction[]): MenuHamburgerItem[] =>
    actions.map(action => ({ label: action.label, icon: action.icon, onClick: action.onClick, isActive: false }));
