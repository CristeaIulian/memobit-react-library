import { FC, Fragment, KeyboardEvent, useEffect, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { Icon } from '../Icon';
import { InputSearch } from '../InputSearch';

import { AppMark } from './PageParts';
import { AppIdentity, AppNavItem, AppNavOptions } from './PageShell.types';

const itemClass = (base: string, item: AppNavItem) => [base, item.isActive ? `${base}--active` : ''].filter(Boolean).join(' ');

// A section's icon, tinted when the section carries a colour (a category, a domain).
const NavIcon: FC<{ item: AppNavItem; size: 'sm' | 'md' }> = ({ item, size }) => (
    <span className="page-shell__nav-icon" style={item.color ? { color: item.color } : undefined}>
        <Icon name={item.icon} size={size} />
    </span>
);

const foldedKey = (appName: string) => `page-shell-nav-folded:${appName}`;

const readFolded = (appName: string | undefined): Set<string> => {
    if (!appName) return new Set();
    try {
        const saved: unknown = JSON.parse(localStorage.getItem(foldedKey(appName)) ?? '[]');
        return new Set(Array.isArray(saved) ? saved.filter((group): group is string => typeof group === 'string') : []);
    } catch {
        return new Set();
    }
};

const saveFolded = (appName: string | undefined, folded: Set<string>) => {
    if (!appName) return;
    try {
        localStorage.setItem(foldedKey(appName), JSON.stringify([...folded]));
    } catch {
        // Storage off or full: the folding just isn't remembered.
    }
};

interface SideNavProps {
    nav: AppNavItem[];
    /** Keys the remembered folded groups. */
    appName?: string;
    options?: AppNavOptions;
}

/**
 * Desktop: the sections as a list in the side column, under a heading wherever a new group starts.
 * Optionally with a search box above it and group headings that fold their sections away.
 */
export const SideNav: FC<SideNavProps> = ({ nav, appName, options = {} }) => {
    const t = useMessages(libMessages);
    const [query, setQuery] = useState('');
    const [folded, setFolded] = useState(() => (options.collapsibleGroups ? readFolded(appName) : new Set<string>()));

    const needle = query.trim().toLowerCase();
    const isSearching = needle.length > 0;
    const matches = isSearching ? nav.filter(item => item.label.toLowerCase().includes(needle) || item.group?.toLowerCase().includes(needle)) : nav;
    // Searching shows every match whatever is folded; a folded group still shows its current section.
    const canFold = options.collapsibleGroups === true && !isSearching;
    const isHidden = (item: AppNavItem) => canFold && item.group !== undefined && folded.has(item.group) && !item.isActive;

    useEffect(() => {
        if (options.collapsibleGroups) saveFolded(appName, folded);
    }, [appName, folded, options.collapsibleGroups]);

    const toggleGroup = (group: string) =>
        setFolded(prev => {
            const next = new Set(prev);
            if (!next.delete(group)) next.add(group);
            return next;
        });

    const select = (item: AppNavItem) => {
        setQuery('');
        item.onSelect();
    };

    const handleSearchKey = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && isSearching && matches[0]) select(matches[0]);
        if (event.key === 'Escape') setQuery('');
    };

    return (
        <nav className="page-shell__side-nav">
            {options.search && <InputSearch value={query} placeholder={options.search} onChange={setQuery} onKeyDown={handleSearchKey} />}
            <div className="page-shell__nav-list">
                {matches.map((item, index) => {
                    const startsGroup = item.group !== undefined && item.group !== matches[index - 1]?.group;
                    return (
                        <Fragment key={item.id}>
                            {startsGroup && item.group && (
                                <NavGroupHeading group={item.group} isFolded={canFold && folded.has(item.group)} canFold={canFold} onToggle={toggleGroup} />
                            )}
                            {!isHidden(item) && (
                                <button type="button" className={itemClass('page-shell__nav-row', item)} onClick={() => select(item)}>
                                    <NavIcon item={item} size="sm" />
                                    <span className="page-shell__nav-label">{item.label}</span>
                                    {item.count !== undefined && <span className="page-shell__nav-count">{item.count}</span>}
                                </button>
                            )}
                        </Fragment>
                    );
                })}
                {matches.length === 0 && <span className="page-shell__nav-empty">{t.pageNoMatches}</span>}
            </div>
        </nav>
    );
};

interface NavGroupHeadingProps {
    group: string;
    isFolded: boolean;
    canFold: boolean;
    onToggle: (group: string) => void;
}

const NavGroupHeading: FC<NavGroupHeadingProps> = ({ group, isFolded, canFold, onToggle }) =>
    canFold ? (
        <button type="button" className="page-shell__nav-group page-shell__nav-group--toggle" onClick={() => onToggle(group)}>
            <span className="page-shell__nav-group-label">{group}</span>
            <Icon name={isFolded ? 'caret-right' : 'caret-down'} size="sm" />
        </button>
    ) : (
        <span className="page-shell__nav-group">{group}</span>
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
