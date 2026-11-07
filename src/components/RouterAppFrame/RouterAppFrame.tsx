import { FC, useMemo } from 'react';

import { matchPath, useLocation, useNavigate } from 'react-router';

import { IconName } from '../Icon';
import { AppFrame } from '../PageShell/AppFrame';
import { AppFrameProps, AppNavItem } from '../PageShell/PageShell.types';

export interface AppRouteNavItem {
    path: string;
    label: string;
    icon: IconName;
    count?: number;
    /** Whether only the exact path counts as this section. Defaults to true for '/' and false otherwise, so '/archive/12' still lights up Archive. */
    end?: boolean;
    /** Other paths that belong to this section, e.g. ['/person/:id/*'] for a People section's detail pages. */
    activeOn?: string[];
}

export interface RouterAppFrameProps extends Omit<AppFrameProps, 'nav'> {
    nav: AppRouteNavItem[];
}

/** AppFrame for react-router apps: sections are given by path, the current one follows the URL, and the app logo leads home. */
export const RouterAppFrame: FC<RouterAppFrameProps> = ({ nav, app, ...props }) => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const items = useMemo<AppNavItem[]>(
        () =>
            nav.map(item => ({
                id: item.path,
                label: item.label,
                icon: item.icon,
                count: item.count,
                isActive:
                    matchPath({ path: item.path, end: item.end ?? item.path === '/' }, pathname) !== null ||
                    (item.activeOn ?? []).some(path => matchPath({ path, end: false }, pathname) !== null),
                onSelect: () => navigate(item.path),
            })),
        [nav, pathname, navigate]
    );

    const homePath = nav[0]?.path ?? '/';
    const identity = useMemo(
        () => ({ ...app, onHomeClick: app.onHomeClick ?? (pathname === homePath ? undefined : () => navigate(homePath)) }),
        [app, pathname, homePath, navigate]
    );

    return <AppFrame {...props} app={identity} nav={items} />;
};
