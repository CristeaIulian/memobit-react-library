import React from 'react';

import { Icon } from '../Icon';

import { ControlPanelNavItem } from './ControlPanel.types';

interface ControlPanelNavProps {
    navigation: ControlPanelNavItem[];
}

export const ControlPanelNav: React.FC<ControlPanelNavProps> = ({ navigation }) => {
    // Only reserve the expand/collapse column when at least one item is expandable;
    // otherwise a flat list would carry a dead-space placeholder before every item.
    const showToggleColumn = navigation.some(item => (item.children?.length ?? 0) > 0);
    return (
        <nav className="control-panel__nav">
            {navigation.map(item => renderNavItem(item, showToggleColumn))}
        </nav>
    );
};

function renderNavItem(item: ControlPanelNavItem, showToggleColumn: boolean, depth = 0): React.ReactNode {
    const children = item.children ?? [];
    const hasChildren = children.length > 0;
    const isOpen = item.isOpen ?? false;
    const itemClassName = [
        'control-panel__nav-item',
        item.isActive ? 'control-panel__nav-item--active' : '',
        item.dimmed ? 'control-panel__nav-item--dimmed' : '',
        hasChildren ? 'control-panel__nav-item--has-children' : '',
    ]
        .filter(Boolean)
        .join(' ');

    const handleClick = () => {
        if (item.onClick) {
            item.onClick();
            return;
        }

        if (hasChildren) item.onOpenChange?.(!isOpen, item);
    };

    const handleToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        item.onOpenChange?.(!isOpen, item);
    };

    return (
        <div key={item.id} className="control-panel__nav-node">
            <div className="control-panel__nav-row" style={{ '--control-panel-nav-depth': depth } as React.CSSProperties}>
                {showToggleColumn &&
                    (hasChildren ? (
                        <button className={`control-panel__nav-toggle${isOpen ? ' control-panel__nav-toggle--open' : ''}`} onClick={handleToggle} type="button">
                            <Icon name="caret-right" />
                        </button>
                    ) : (
                        <span className="control-panel__nav-toggle-placeholder" />
                    ))}
                <button className={itemClassName} onClick={handleClick} type="button">
                    {item.icon && <Icon name={item.icon} />}
                    {item.color && <span className="control-panel__nav-dot" style={{ backgroundColor: item.color }} />}
                    <span className="control-panel__nav-label">{item.label}</span>
                    {item.count !== undefined && <span className="control-panel__nav-count">{item.count}</span>}
                    {item.badges && item.badges.length > 0 && (
                        <span className="control-panel__nav-badges">
                            {item.badges.map((badge, i) => (
                                <span key={i} className={`control-panel__nav-badge control-panel__nav-badge--${badge.variant}`}>
                                    {badge.count}
                                </span>
                            ))}
                        </span>
                    )}
                </button>
            </div>
            {hasChildren && (
                <div className={`control-panel__nav-children${isOpen ? ' control-panel__nav-children--open' : ''}`}>
                    {children.map(child => renderNavItem(child, showToggleColumn, depth + 1))}
                </div>
            )}
        </div>
    );
}
