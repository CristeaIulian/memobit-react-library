import { FC } from 'react';

import { Icon } from '../Icon';

import { AppMark } from './PageParts';
import { AppIdentity, AppNavItem } from './PageShell.types';

const itemClass = (base: string, item: AppNavItem) => [base, item.isActive ? `${base}--active` : ''].filter(Boolean).join(' ');

/** Desktop: the sections as a list in the side column. */
export const SideNav: FC<{ nav: AppNavItem[] }> = ({ nav }) => (
    <nav className="page-shell__side-nav">
        {nav.map(item => (
            <button key={item.id} type="button" className={itemClass('page-shell__nav-row', item)} onClick={item.onSelect}>
                <Icon name={item.icon} size="sm" />
                <span className="page-shell__nav-label">{item.label}</span>
                {item.count !== undefined && <span className="page-shell__nav-count">{item.count}</span>}
            </button>
        ))}
    </nav>
);

/** Tablet: the app logo and the sections as an icon rail on the left edge. */
export const NavRail: FC<{ app?: AppIdentity; nav: AppNavItem[] }> = ({ app, nav }) => (
    <nav className="page-shell__rail">
        {app && <AppMark app={app} logoOnly />}
        {nav.map(item => (
            <button key={item.id} type="button" className={itemClass('page-shell__rail-item', item)} onClick={item.onSelect}>
                <Icon name={item.icon} size="md" />
                <span>{item.label}</span>
            </button>
        ))}
    </nav>
);

/** Phone: the sections as a tab bar along the bottom edge. */
export const TabBar: FC<{ nav: AppNavItem[] }> = ({ nav }) => (
    <nav className="page-shell__tabbar">
        {nav.map(item => (
            <button key={item.id} type="button" className={itemClass('page-shell__tab', item)} onClick={item.onSelect}>
                <Icon name={item.icon} size="md" />
                <span>{item.label}</span>
            </button>
        ))}
    </nav>
);
