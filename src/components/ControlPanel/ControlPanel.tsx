import React from 'react';

import { AppHeader } from '../AppHeader';
import { Button } from '../Button';
import { Separator } from '../Separator';

import { ControlPanelFilterItem } from './ControlPanelFilter';
import { ControlPanelNav } from './ControlPanelNav';
import { ControlPanelOptions } from './ControlPanelOptions';
import { useControlPanelContext } from './ControlPanelContext';
import { ControlPanelOption, ControlPanelOptionGroup, ControlPanelProps } from './ControlPanel.types';

import './ControlPanel.scss';

export * from './ControlPanel.types';

export const ControlPanel: React.FC<ControlPanelProps> = ({
    width = '280px',
    className = '',
    isOpen: isOpenProp,
    onClose,
    isMobile: isMobileProp,
    showOverlay = true,
    contained = false,
    shadow = 'none',
    header,
    navigation = [],
    actions = [],
    filters = [],
    filtersCount,
    onFilterChange,
    onClearFilters,
    options = [],
    onOptionChange,
    viewToggle,
    groupBy,
    visibleColumns,
}) => {
    const controlPanelContext = useControlPanelContext();
    const isMobile = isMobileProp ?? controlPanelContext?.isMobile ?? false;
    const isOpen = isOpenProp ?? (isMobile ? (controlPanelContext?.isOpen ?? false) : true);
    const close = onClose ?? controlPanelContext?.close ?? (() => undefined);

    const panelClassName = [
        'control-panel',
        isOpen ? 'control-panel--open' : 'control-panel--closed',
        isMobile ? 'control-panel--mobile' : '',
        contained ? 'control-panel--contained' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const overlayClassName = ['control-panel__overlay', contained ? 'control-panel__overlay--contained' : ''].filter(Boolean).join(' ');
    const panelStyle = {
        '--control-panel-width': width,
        '--control-panel-shadow': shadow,
    } as React.CSSProperties;

    const normalizedOptionGroups: ControlPanelOptionGroup[] =
        options.length === 0 ? [] : 'type' in options[0] ? [{ options: options as ControlPanelOption[] }] : (options as ControlPanelOptionGroup[]);

    const hasOptions = !!(viewToggle || groupBy || visibleColumns || normalizedOptionGroups.length > 0);
    const hasFiltersSection = filters.length > 0 || (filtersCount !== undefined && filtersCount > 0);

    return (
        <>
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside className={panelClassName} style={panelStyle}>
                {header && (
                    <AppHeader
                        icon={header.icon}
                        emoji={header.emoji}
                        svg={header.svg}
                        appName={header.appName ?? header.siteName}
                        heading={header.heading}
                        onClick={header.onClick}
                    />
                )}

                {actions.length > 0 && (
                    <div className="control-panel__actions">
                        {actions.map(action => (
                            <Button
                                key={action.id}
                                className="control-panel__action"
                                disabled={action.disabled}
                                fullWidth={action.fullWidth ?? true}
                                icon={action.icon}
                                onClick={action.onClick}
                                size={action.size ?? 'medium'}
                                sufixIcon={action.suffixIcon}
                                variant={action.variant ?? 'default'}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </div>
                )}

                {navigation.length > 0 && <ControlPanelNav navigation={navigation} />}

                {hasFiltersSection && (
                    <div className="control-panel__filters">
                        <div className="control-panel__filters-header">
                            <span className="control-panel__filters-heading">
                                Filters
                                {filtersCount !== undefined && <span className="control-panel__filters-count">{filtersCount}</span>}
                            </span>
                            {onClearFilters && (
                                <button className="control-panel__filters-clear" type="button" onClick={() => onClearFilters({ source: 'control-panel' })}>
                                    Clear filters
                                </button>
                            )}
                        </div>
                        {filters.map(filter => (
                            <ControlPanelFilterItem key={filter.id} filter={filter} onChange={event => onFilterChange?.(event)} />
                        ))}
                    </div>
                )}

                {hasFiltersSection && hasOptions && <Separator spacing={0} />}

                {hasOptions && (
                    <ControlPanelOptions
                        normalizedOptionGroups={normalizedOptionGroups}
                        onOptionChange={onOptionChange}
                        viewToggle={viewToggle}
                        groupBy={groupBy}
                        visibleColumns={visibleColumns}
                    />
                )}
            </aside>
        </>
    );
};
