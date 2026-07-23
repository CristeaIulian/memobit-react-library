import React, { useState } from 'react';

import { AppHeader } from '../AppHeader';
import { Button } from '../Button';
import { ConfirmPopover } from '../ConfirmPopover';
import { Separator } from '../Separator';
import { Tooltip } from '../Tooltip';

import { ControlPanelAction, ControlPanelOption, ControlPanelOptionGroup, ControlPanelProps } from './ControlPanel.types';
import { useControlPanelContext } from './ControlPanelContext';
import { ControlPanelFilterItem } from './ControlPanelFilter';
import { ControlPanelNav } from './ControlPanelNav';
import { ControlPanelOptions } from './ControlPanelOptions';

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
    flush = false,
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
        flush ? 'control-panel--flush' : '',
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
                        onClick={
                            header.onClick
                                ? () => {
                                      header.onClick?.();
                                      if (isMobile) close();
                                  }
                                : undefined
                        }
                    />
                )}

                {actions.length > 0 && (
                    <div className="control-panel__actions">
                        {actions.map(action => (
                            <ControlPanelActionButton key={action.id} action={action} onActionComplete={isMobile ? close : undefined} />
                        ))}
                    </div>
                )}

                {navigation.length > 0 && <ControlPanelNav navigation={navigation} onNavigate={isMobile ? close : undefined} />}

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
                        onViewToggleComplete={isMobile ? close : undefined}
                        groupBy={groupBy}
                        visibleColumns={visibleColumns}
                    />
                )}
            </aside>
        </>
    );
};

// Renders a single action button. When `action.confirm` is set, intercepts the
// click and opens a small ConfirmPopover anchored to the button instead of
// firing onClick immediately. The user's onClick fires only after they pick the
// confirm option, keeping the consumer API as simple as a plain button.
interface ControlPanelActionButtonProps {
    action: ControlPanelAction;
    // Called after the action's onClick has fired. On mobile this closes the
    // panel drawer; undefined on desktop where the panel is a persistent sidebar.
    // Also runs after a confirm flow resolves.
    onActionComplete?: () => void;
}

const ControlPanelActionButton: React.FC<ControlPanelActionButtonProps> = ({ action, onActionComplete }) => {
    // Anchor captured from the click event since Button doesn't forward refs.
    // anchorEl stays set after the popover closes so position recomputes work
    // correctly if the user reopens — and React reusing the same DOM node
    // means we don't need to refresh it on every render.
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = event => {
        if (action.confirm) {
            setAnchorEl(event.currentTarget);
            setConfirmVisible(true);
            return;
        }
        action.onClick?.(event);
        onActionComplete?.();
    };

    const handleConfirm = () => {
        // Synthetic event isn't meaningful for a confirm flow — the action's
        // onClick signature accepts a MouseEvent only because Button's onClick
        // does. Pass a minimal event-like value cast to satisfy the type.
        action.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
        onActionComplete?.();
    };

    const button = (
        <Button
            className="control-panel__action"
            disabled={action.disabled}
            fullWidth={action.fullWidth ?? true}
            icon={action.icon}
            onClick={handleClick}
            size={action.size ?? 'medium'}
            sufixIcon={action.suffixIcon}
            variant={action.variant ?? 'default'}
        >
            {action.label}
        </Button>
    );

    return (
        <>
            {action.tooltip ? <Tooltip title={action.tooltip} position="right">{button}</Tooltip> : button}
            {action.confirm && (
                <ConfirmPopover
                    visible={confirmVisible}
                    onClose={() => setConfirmVisible(false)}
                    anchorEl={anchorEl}
                    title={action.confirm.title ?? action.label}
                    message={action.confirm.message}
                    icon={action.confirm.icon}
                    placement={action.confirm.placement ?? 'right'}
                    confirm={{
                        text: action.confirm.confirm?.text ?? 'Confirm',
                        icon: action.confirm.confirm?.icon,
                        variant: action.confirm.confirm?.variant ?? action.variant ?? 'info',
                        onClick: handleConfirm,
                    }}
                    cancel={{
                        text: action.confirm.cancel?.text ?? 'Cancel',
                        icon: action.confirm.cancel?.icon,
                        variant: action.confirm.cancel?.variant ?? 'default',
                    }}
                />
            )}
        </>
    );
};
