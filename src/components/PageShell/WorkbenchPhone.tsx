import { FC, useCallback, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { InputSearch } from '../InputSearch';

import { TabBar } from './AppNav';
import { BottomSheet } from './BottomSheet';
import { countActiveFilters } from './filterRules';
import { AppliedFilters, FilterSections } from './FilterSections';
import { getMenuItems, MAX_TAB_BAR_ITEMS, navToMenuItems } from './menuItems';
import { AppMark, PageMenu, PagePager, PageTabsRow, SortSheetBody } from './PageParts';
import { PageShellProps } from './PageShell.types';
import { getHeadingText, getResultLabel } from './shellText';
import { useAppFrame } from './useAppFrame';

type PhoneSheet = 'filters' | 'sort' | null;

/** The Workbench shell on a phone: top bar, search, applied chips, a result line that opens sort, and sheets. */
export const WorkbenchPhone: FC<PageShellProps> = props => {
    const {
        title,
        counts,
        primaryAction,
        actions = [],
        search,
        sort,
        view,
        filters = [],
        values = {},
        onFilterChange = () => undefined,
        onClearFilters,
        pagination,
        tabs,
        children,
    } = props;
    const t = useMessages(libMessages);
    const frame = useAppFrame();
    const [sheet, setSheet] = useState<PhoneSheet>(null);
    const closeSheet = useCallback(() => setSheet(null), []);
    const activeCount = countActiveFilters(filters, values);
    const showLabel = getResultLabel(props, t);
    const sortLabel = sort?.fields.find(field => field.value === sort.value.field)?.label;
    const resultLine = [getHeadingText(props, t), sortLabel].filter(Boolean).join(' · ');
    const nav = frame?.nav ?? [];
    const hasTabBar = nav.length > 1 && nav.length <= MAX_TAB_BAR_ITEMS;
    // Sections that don't fit a tab bar go to the top of the menu instead.
    const menuItems = [...(hasTabBar ? [] : navToMenuItems(nav)), ...getMenuItems(actions, frame?.menuItems ?? [], true)];

    return (
        <div
            className={[
                'page-shell',
                'page-shell--workbench',
                'page-shell--phone',
                hasTabBar ? 'page-shell--with-tabs' : '',
                primaryAction?.variant ? `page-shell--fab-${primaryAction.variant}` : '',
            ]
                .filter(Boolean)
                .join(' ')}
        >
            <header className="page-shell__topbar">
                {frame && <AppMark app={frame.app} logoOnly />}
                <h1 className="page-shell__title">{title}</h1>
                <span className="page-shell__spacer" />
                {filters.length > 0 && (
                    <button type="button" className="page-shell__icon-button" onClick={() => setSheet('filters')}>
                        <Icon name="tune" size="md" />
                        {activeCount > 0 && <span className="page-shell__badge page-shell__badge--corner">{activeCount}</span>}
                    </button>
                )}
                {props.status ?? frame?.status}
                <PageMenu items={menuItems} />
            </header>

            {search && (
                <div className="page-shell__search-row">
                    <InputSearch value={search.value} placeholder={search.placeholder ?? t.search} autoFocus={search.autoFocus} onChange={search.onChange} />
                </div>
            )}

            <PageTabsRow tabs={tabs} />

            <AppliedFilters filters={filters} values={values} onFilterChange={onFilterChange} onClearFilters={onClearFilters} scroll />

            {(sort || view || (pagination && pagination.pageCount > 1)) && (
                <div className="page-shell__result-row">
                    {(sort || view) && (
                        <button type="button" className="page-shell__result-line" onClick={() => setSheet('sort')}>
                            <span>{resultLine || t.pageSortAndView}</span>
                            <Icon name="caret-down" size="sm" />
                        </button>
                    )}
                    <PagePager pagination={pagination} />
                </div>
            )}

            <div className="page-shell__content">{children}</div>

            {primaryAction && (
                <button type="button" className="page-shell__fab" disabled={primaryAction.disabled} onClick={primaryAction.onClick}>
                    <Icon name={primaryAction.icon ?? 'plus'} size="lg" />
                </button>
            )}

            {hasTabBar && <TabBar nav={nav} />}

            <BottomSheet
                isOpen={sheet === 'filters'}
                tall
                title={t.filters}
                onClose={closeSheet}
                end={
                    activeCount > 0 && onClearFilters ? (
                        <button type="button" className="page-shell__link" onClick={onClearFilters}>
                            {t.pageClearAll}
                        </button>
                    ) : undefined
                }
                footer={
                    <Button variant="info" fullWidth disabled={counts?.shown === 0} onClick={closeSheet}>
                        {counts ? showLabel(counts.shown) : t.pageDone}
                    </Button>
                }
            >
                <FilterSections filters={filters} values={values} context="sheet" onFilterChange={onFilterChange} />
            </BottomSheet>

            <BottomSheet
                isOpen={sheet === 'sort'}
                title={t.pageSortAndView}
                onClose={closeSheet}
                footer={
                    <Button variant="info" fullWidth onClick={closeSheet}>
                        {t.pageDone}
                    </Button>
                }
            >
                <SortSheetBody sort={sort} view={view} />
            </BottomSheet>
        </div>
    );
};
