import { FC, ReactNode, useState } from 'react';

import { libMessages } from '../../contexts/LanguageContext/libMessages';
import { useMessages } from '../../hooks/useLanguage';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { Icon } from '../Icon';
import { MenuHamburger, MenuHamburgerItem } from '../MenuHamburger';
import { ToggleSwitch } from '../ToggleSwitch';
import { Tooltip } from '../Tooltip';

import { OptionRow, Segmented } from './FilterField';
import { AppIdentity, FilterContext, PageAction, PageColumns, PageGroupBy, PagePagination, PageSort, PageView, PageViewToggle } from './PageShell.types';
import { resolveViewModes } from './shellText';

export const AppMark: FC<{ app: AppIdentity; logoOnly?: boolean }> = ({ app, logoOnly = false }) => {
    const logo = typeof app.logo === 'string' ? <img src={app.logo} alt={app.name} /> : (app.logo ?? (app.icon ? <Icon name={app.icon} size="lg" /> : null));
    const content = (
        <>
            {logo && <span className="page-shell__logo">{logo}</span>}
            {!logoOnly && <span className="page-shell__app-name">{app.name}</span>}
        </>
    );

    if (!app.onHomeClick) return <span className="page-shell__app">{content}</span>;

    return (
        <button type="button" className="page-shell__app page-shell__app--clickable" onClick={app.onHomeClick}>
            {content}
        </button>
    );
};

export const ActionButton: FC<{ action: PageAction; fullWidth?: boolean }> = ({ action, fullWidth = false }) => (
    <Button icon={action.icon} variant={action.variant ?? 'default'} disabled={action.disabled} fullWidth={fullWidth} onClick={action.onClick}>
        {action.label}
    </Button>
);

export const PageMenu: FC<{ items: MenuHamburgerItem[] }> = ({ items }) =>
    items.length > 0 ? <MenuHamburger items={items} disableResponsive showLabel={false} /> : null;

/** View modes as a segmented control: icons with tooltips in a toolbar, icons and labels in a panel or sheet. */
export const ViewToggle: FC<{ view: PageView; withLabels?: boolean }> = ({ view, withLabels = false }) => {
    const t = useMessages(libMessages);

    return (
        <div className={['page-shell__view-toggle', withLabels ? 'page-shell__view-toggle--labels' : ''].filter(Boolean).join(' ')}>
            <Segmented
                items={resolveViewModes(view.modes, t).map(mode => ({
                    value: mode.value,
                    label: withLabels ? (
                        <span className="page-shell__view-option">
                            <Icon name={mode.icon} size="sm" />
                            {mode.label}
                        </span>
                    ) : (
                        <Tooltip title={mode.label}>
                            <Icon name={mode.icon} size="sm" />
                        </Tooltip>
                    ),
                }))}
                value={view.value}
                onSelect={next => {
                    if (next !== null) view.onChange(String(next));
                }}
            />
        </div>
    );
};

/** Desktop and tablet sort: a field dropdown and a direction button beside it. */
export const SortDropdown: FC<{ sort: PageSort }> = ({ sort }) => {
    const t = useMessages(libMessages);
    const ascending = sort.value.direction === 'asc';

    return (
        <div className="page-shell__sort">
            <div className="page-shell__sort-field">
                <Dropdown
                    name="page-sort"
                    options={sort.fields}
                    value={sort.value.field}
                    highlighted={sort.highlighted}
                    clearable={false}
                    searchable={false}
                    usePortal={false}
                    onChange={option => {
                        if (option && !Array.isArray(option)) sort.onChange({ field: String(option.value), direction: sort.value.direction });
                    }}
                />
            </div>
            <Tooltip title={ascending ? t.pageAscending : t.pageDescending}>
                <Button
                    icon={ascending ? 'arrow-up' : 'arrow-down'}
                    variant="default"
                    onClick={() => sort.onChange({ field: sort.value.field, direction: ascending ? 'desc' : 'asc' })}
                />
            </Tooltip>
        </div>
    );
};

/** Phone sort and view: the fields as a radio list, then direction and view mode as segmented controls. */
export const SortSheetBody: FC<{ sort?: PageSort; view?: PageView }> = ({ sort, view }) => {
    const t = useMessages(libMessages);

    return (
        <div className="filter-field filter-field--sheet page-shell__sheet-stack">
            {sort && (
                <>
                    <span className="page-shell__group-title">{t.sortBy}</span>
                    <div className="filter-field__rows">
                        {sort.fields.map(field => (
                            <OptionRow
                                key={field.value}
                                label={field.label}
                                mark="radio"
                                selected={sort.value.field === field.value}
                                onClick={() => sort.onChange({ field: field.value, direction: sort.value.direction })}
                            />
                        ))}
                    </div>
                    <Segmented
                        items={[
                            { value: 'asc', label: t.pageAscending },
                            { value: 'desc', label: t.pageDescending },
                        ]}
                        value={sort.value.direction}
                        onSelect={next => sort.onChange({ field: sort.value.field, direction: next === 'desc' ? 'desc' : 'asc' })}
                    />
                </>
            )}
            {view && (
                <>
                    <span className="page-shell__group-title">{t.pageView}</span>
                    <ViewToggle view={view} withLabels />
                    <ViewExtras view={view} context="sheet" />
                </>
            )}
        </div>
    );
};

/** A view option as a section that stays closed until opened, its header previewing the current choice. */
const ViewSection: FC<{ label: string; summary: string; context: FilterContext; children: ReactNode }> = ({ label, summary, context, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="page-filters__section">
            <button type="button" className="page-filters__header" onClick={() => setIsOpen(!isOpen)}>
                <span className="page-filters__label">{label}</span>
                <span className="page-filters__summary">{summary}</span>
                <Icon name={isOpen ? 'caret-down' : 'caret-right'} size="sm" />
            </button>
            {isOpen && <div className={`page-filters__body filter-field filter-field--${context}`}>{children}</div>}
        </div>
    );
};

const ColumnsSection: FC<{ columns: PageColumns; context: FilterContext }> = ({ columns, context }) => {
    const t = useMessages(libMessages);
    const toggle = (value: string) =>
        columns.onChange(columns.value.includes(value) ? columns.value.filter(other => other !== value) : [...columns.value, value]);

    return (
        <ViewSection label={t.columns} summary={t.pageColumnsShown(columns.value.length, columns.options.length)} context={context}>
            <div className="filter-field__rows">
                {columns.options.map(option => (
                    <OptionRow
                        key={option.value}
                        label={option.label}
                        mark="check"
                        selected={columns.value.includes(option.value)}
                        onClick={() => toggle(option.value)}
                    />
                ))}
            </div>
        </ViewSection>
    );
};

const GroupBySection: FC<{ groupBy: PageGroupBy; context: FilterContext }> = ({ groupBy, context }) => {
    const t = useMessages(libMessages);
    const current = groupBy.options.find(option => option.value === groupBy.value);

    return (
        <ViewSection label={t.groupBy} summary={current?.label ?? t.pageGroupNone} context={context}>
            <div className="filter-field__rows">
                <OptionRow label={t.pageGroupNone} mark="radio" selected={groupBy.value === null} onClick={() => groupBy.onChange(null)} />
                {groupBy.options.map(option => (
                    <OptionRow
                        key={option.value}
                        label={option.label}
                        mark="radio"
                        selected={groupBy.value === option.value}
                        onClick={() => groupBy.onChange(option.value)}
                    />
                ))}
            </div>
        </ViewSection>
    );
};

const ViewToggleRow: FC<{ toggle: PageViewToggle; context: FilterContext }> = ({ toggle, context }) => (
    <div className="page-filters__flat">
        <div className={`filter-field filter-field--${context} filter-field__switch-row`}>
            <button type="button" className="filter-field__switch-label" onClick={() => toggle.onChange(!toggle.value)}>
                {toggle.label}
            </button>
            <ToggleSwitch checked={toggle.value} size="small" showLabels={false} onChange={toggle.onChange} />
        </div>
    </div>
);

/** The view options beyond the mode: columns, grouping and on/off preferences. Renders nothing when a page has none. */
export const ViewExtras: FC<{ view: PageView; context: FilterContext }> = ({ view, context }) => {
    if (!view.columns && !view.groupBy && !view.toggles?.length) return null;

    return (
        <div className={`page-filters page-filters--${context}`}>
            {view.columns && <ColumnsSection columns={view.columns} context={context} />}
            {view.groupBy && <GroupBySection groupBy={view.groupBy} context={context} />}
            {view.toggles?.map(toggle => (
                <ViewToggleRow key={toggle.id} toggle={toggle} context={context} />
            ))}
        </div>
    );
};

/** Where the list is: "Page 3 of 9" with previous and next, so the position shows without scrolling to the bottom. */
export const PagePager: FC<{ pagination?: PagePagination }> = ({ pagination }) => {
    const t = useMessages(libMessages);

    if (!pagination || pagination.pageCount <= 1) return null;

    const { page, pageCount, onChange } = pagination;

    return (
        <div className="page-shell__pager">
            <Tooltip title={t.previous}>
                <Button icon="caret-left" variant="plain" size="small" disabled={page <= 1} onClick={() => onChange(page - 1)} />
            </Tooltip>
            <span className="page-shell__pager-label">{t.pageOf(page, pageCount)}</span>
            <Tooltip title={t.next}>
                <Button icon="caret-right" variant="plain" size="small" disabled={page >= pageCount} onClick={() => onChange(page + 1)} />
            </Tooltip>
        </div>
    );
};

/** The view options block of the side column and the tablet drawer: the mode toggle, then the columns. */
export const ViewOptions: FC<{ view: PageView; showToggle?: boolean }> = ({ view, showToggle = true }) => {
    const t = useMessages(libMessages);

    return (
        <div className="page-shell__side-group">
            <span className="page-shell__group-title">{t.pageView}</span>
            {showToggle && <ViewToggle view={view} withLabels />}
            <ViewExtras view={view} context="panel" />
        </div>
    );
};
