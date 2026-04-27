import React from 'react';

import { Button, type ExternalButtonConfig } from '../Button';
import { Icon, type IconName } from '../Icon';

import './EmptyState.scss';

export interface EmptyStateProps {
    icon?: React.ReactNode | IconName;
    title: string;
    description?: string;
    primary?: ExternalButtonConfig;
    secondary?: ExternalButtonConfig;
    children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, primary, secondary, children }) => {
    const hasActions = primary || secondary;
    const iconContent = typeof icon === 'string' ? <Icon name={icon as IconName} size="xxxl" /> : icon;

    return (
        <div className="empty-state">
            {iconContent && <div className="empty-state__icon">{iconContent}</div>}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__description">{description}</p>}
            {children}
            {hasActions && (
                <div className="empty-state__actions">
                    {primary && (
                        <Button variant={primary.variant || 'info'} icon={primary.icon} onClick={primary.onClick}>
                            {primary.text}
                        </Button>
                    )}
                    {secondary && (
                        <Button variant={secondary.variant || 'default'} icon={secondary.icon} onClick={secondary.onClick}>
                            {secondary.text}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
