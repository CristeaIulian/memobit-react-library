import { FC, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useBreakpoint } from '../../hooks/useBreakpoint';
import { useMessages } from '../../hooks/useLanguage';
import { Button } from '../Button';
import { Drawer } from '../Drawer';
import { InputSearch } from '../InputSearch';

import { NavRail, SideNav } from './AppNav';
import { countActiveFilters } from './filterRules';
import { AppliedFilters, FilterSections } from './FilterSections';
import { getButtonActions, getMenuItems } from './menuItems';
import { ActionButton, AppMark, PageMenu, PagePager, PageTabsRow, SortDropdown, ViewOptions, ViewToggle } from './PageParts';
import { PageShellProps } from './PageShell.types';
import { getHeadingText, getResultLabel, hasViewExtras } from './shellText';
import { useAppFrame } from './useAppFrame';
import { useConfirmedActions } from './useConfirmedActions';
import { WorkbenchPhone } from './WorkbenchPhone';

/**
 * Workbench: a side column holds the app, the primary action, the sections, the filters and the view options;
 * a toolbar above the list holds the title, search, sort and the other actions. Tablets move the sections to an
 * icon rail and the filters into a drawer; phones get a top bar, a filter sheet, a tab bar and a floating action.
 */
export const WorkbenchShell: FC<PageShellProps> = props => {
    const { isMobile, isTablet } = useBreakpoint();
    const t = useMessages(libMessages);
    const frame = useAppFrame();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { primaryAction, actions, dialog } = useConfirmedActions(props.primaryAction, props.actions ?? []);

    if (isMobile) return <WorkbenchPhone {...props} />;

    const {
        title,
        counts,
        search,
        sort,
        view,
        filters = [],
        values = {},
        onFilterChange = () => undefined,
        onClearFilters,
        pagination,
        tabs,
        aside,
        footer,
        children,
    } = props;
    const status = props.status ?? frame?.status;
    const heading = getHeadingText(props, t);
    const resultLabel = getResultLabel(props, t);
    const activeCount = countActiveFilters(filters, values);
    const hasFilters = filters.length > 0;
    const frameItems = frame?.menuItems ?? [];
    const nav = frame?.nav ?? [];

    const sections = <FilterSections filters={filters} values={values} context="panel" onFilterChange={onFilterChange} />;
    const badge = activeCount > 0 && <span className="page-shell__badge">{activeCount}</span>;

    return (
        <div className={['page-shell', 'page-shell--workbench', isTablet ? 'page-shell--tablet' : 'page-shell--desktop'].join(' ')}>
            {!isTablet && (
                <aside className="page-shell__side">
                    {frame && <AppMark app={frame.app} />}
                    {primaryAction && <ActionButton action={primaryAction} fullWidth />}
                    {nav.length > 1 && <SideNav nav={nav} />}
                    {hasFilters && (
                        <div className="page-shell__side-group">
                            <div className="page-shell__side-head">
                                <span className="page-shell__group-title">{t.filters}</span>
                                {badge}
                                <span className="page-shell__spacer" />
                                {activeCount > 0 && onClearFilters && (
                                    <button type="button" className="page-shell__link" onClick={onClearFilters}>
                                        {t.pageClearAll}
                                    </button>
                                )}
                            </div>
                            {sections}
                        </div>
                    )}
                    {view && <ViewOptions view={view} />}
                </aside>
            )}

            {isTablet && nav.length > 1 && <NavRail app={frame?.app} nav={nav} />}

            <div className="page-shell__main">
                <header className="page-shell__toolbar">
                    {isTablet && hasFilters && (
                        <Button icon="tune" variant="default" onClick={() => setIsDrawerOpen(true)}>
                            {t.filters}
                            {badge}
                        </Button>
                    )}
                    {isTablet && frame && nav.length <= 1 && <AppMark app={frame.app} logoOnly />}
                    <div className="page-shell__titles">
                        <h1 className="page-shell__title">{title}</h1>
                        {heading && <p className="page-shell__heading">{heading}</p>}
                    </div>
                    {/* Without a search box to take the width (or with it on its own row), the controls still sit at the right edge. */}
                    {(!search || isTablet) && <span className="page-shell__spacer" />}
                    {isTablet && primaryAction && <ActionButton action={primaryAction} />}
                    {isTablet && status}
                    {isTablet && <PageMenu items={getMenuItems(actions, frameItems, true)} />}
                    {isTablet && <span className="page-shell__break" />}
                    {search && (
                        <InputSearch
                            className="page-shell__search"
                            value={search.value}
                            placeholder={search.placeholder ?? t.search}
                            autoFocus={search.autoFocus}
                            onChange={search.onChange}
                        />
                    )}
                    {sort && <SortDropdown sort={sort} />}
                    {isTablet && view && <ViewToggle view={view} />}
                    {!isTablet && getButtonActions(actions).map(action => <ActionButton key={action.id} action={action} />)}
                    {!isTablet && status}
                    {!isTablet && <PageMenu items={getMenuItems(actions, frameItems, false)} />}
                </header>

                <PageTabsRow tabs={tabs} />

                {/* One row for the list's state: applied filters on the left, the current page on the right. Empty, it hides. */}
                <div className="page-shell__status">
                    <AppliedFilters filters={filters} values={values} onFilterChange={onFilterChange} onClearFilters={onClearFilters} />
                    <PagePager pagination={pagination} />
                </div>

                <div className="page-shell__content">{children}</div>

                {/* Tablets have no room for a third column, so the panel follows the content. */}
                {isTablet && aside && <div className="page-shell__aside page-shell__aside--stacked">{aside}</div>}

                {footer && <div className="page-shell__footer">{footer}</div>}
            </div>

            {!isTablet && aside && <aside className="page-shell__aside page-shell__aside--docked">{aside}</aside>}

            {isTablet && hasFilters && (
                <Drawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    position="left"
                    title={t.filters}
                    footer={
                        <div className="page-shell__drawer-footer">
                            {activeCount > 0 && onClearFilters && (
                                <Button variant="default" onClick={onClearFilters}>
                                    {t.pageClearAll}
                                </Button>
                            )}
                            {counts && (
                                <Button variant="info" fullWidth onClick={() => setIsDrawerOpen(false)}>
                                    {resultLabel(counts.shown)}
                                </Button>
                            )}
                        </div>
                    }
                >
                    <div className="page-shell__drawer-body">
                        {sections}
                        {/* The drawer stands in for the side column, so it carries the other view options too; the mode toggle stays in the toolbar. */}
                        {view && hasViewExtras(view) && <ViewOptions view={view} showToggle={false} />}
                    </div>
                </Drawer>
            )}
            {dialog}
        </div>
    );
};
