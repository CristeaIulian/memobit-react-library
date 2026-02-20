import React from 'react';

import { Button, type ButtonVariant } from '../Button';

import './EmptyState.scss';

interface EmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
}

export interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    primaryAction?: EmptyStateAction;
    secondaryAction?: EmptyStateAction;
    children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, primaryAction, secondaryAction, children }) => {
    return (
        <div className="empty-state">
            {icon && <div className="empty-state__icon">{icon}</div>}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__description">{description}</p>}
            {children}
            {(primaryAction || secondaryAction) && (
                <div className="empty-state__actions">
                    {primaryAction && (
                        <Button variant={primaryAction.variant || 'info'} onClick={primaryAction.onClick}>
                            {primaryAction.label}
                        </Button>
                    )}
                    {secondaryAction && (
                        <Button variant={secondaryAction.variant || 'default'} onClick={secondaryAction.onClick}>
                            {secondaryAction.label}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
