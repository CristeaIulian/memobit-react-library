import { FC, Fragment } from 'react';

import { Icon } from '../Icon';

import { AppMark } from './PageParts';
import { AppIdentity, AppNavItem } from './PageShell.types';

const itemClass = (base: string, item: AppNavItem) => [base, item.isActive ? `${base}--active` : ''].filter(Boolean).join(' ');

// A section's icon, tinted when the section carries a colour (a category, a domain).
const NavIcon: FC<{ item: AppNavItem; size: 'sm' | 'md' }> = ({ item, size }) => (
    <span className="page-shell__nav-icon" style={item.color ? { color: item.color } : undefined}>
        <Icon name={item.icon} size={size} />
    </span>
);

/** Desktop: the sections as a list in the side column, under a heading wherever a new group starts. */
export const SideNav: FC<{ nav: AppNavItem[] }> = ({ nav }) => (
    <nav className="page-shell__side-nav">
        {nav.map((item, index) => (
            <Fragment key={item.id}>
                {item.group && item.group !== nav[index - 1]?.group && <span className="page-shell__nav-group">{item.group}</span>}
                <button type="button" className={itemClass('page-shell__nav-row', item)} onClick={item.onSelect}>
                    <NavIcon item={item} size="sm" />
                    <span className="page-shell__nav-label">{item.label}</span>
                    {item.count !== undefined && <span className="page-shell__nav-count">{item.count}</span>}
                </button>
            </Fragment>
        ))}
    </nav>
);

/** Tablet: the app logo and the sections as an icon rail on the left edge. */
export const NavRail: FC<{ app?: AppIdentity; nav: AppNavItem[] }> = ({ app, nav }) => (
    <nav className="page-shell__rail">
        {app && <AppMark app={app} logoOnly />}
        {nav.map(item => (
            <button key={item.id} type="button" className={itemClass('page-shell__rail-item', item)} onClick={item.onSelect}>
                <NavIcon item={item} size="md" />
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
