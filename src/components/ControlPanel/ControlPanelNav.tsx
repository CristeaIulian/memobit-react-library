import React from 'react';

import { Icon } from '../Icon';

import { ControlPanelNavItem } from './ControlPanel.types';

interface ControlPanelNavProps {
    navigation: ControlPanelNavItem[];
}

export const ControlPanelNav: React.FC<ControlPanelNavProps> = ({ navigation }) => (
    <nav className="control-panel__nav">
        {navigation.map(item => (
            <button
                key={item.id}
                className={`control-panel__nav-item${item.isActive ? ' control-panel__nav-item--active' : ''}`}
                onClick={item.onClick}
                type="button"
            >
                {item.icon && (
                    <>
                        <Icon name={item.icon} /> &nbsp;
                    </>
                )}
                {item.color && <span className="control-panel__nav-dot" style={{ backgroundColor: item.color }} />}
                {item.label}
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
        ))}
    </nav>
);
