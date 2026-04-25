import React from 'react';

import { Button, ButtonProps, type ButtonVariant } from '../Button';
import { Icon, type IconName } from '../Icon';

import './EmptyState.scss';

/** @deprecated Use `buttons` on EmptyStateProps instead. */
interface EmptyStateAction {
    label: string;
    onClick: () => void;
    variant?: ButtonVariant;
}

export interface EmptyStateProps {
    icon?: React.ReactNode | IconName;
    title: string;
    description?: string;
    buttons?: ButtonProps[];
    /** @deprecated Use `buttons` instead. */
    primaryAction?: EmptyStateAction;
    /** @deprecated Use `buttons` instead. */
    secondaryAction?: EmptyStateAction;
    children?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, buttons, primaryAction, secondaryAction, children }) => {
    const hasActions = buttons?.length || primaryAction || secondaryAction;
    const iconContent = typeof icon === 'string' ? <Icon name={icon as IconName} size="xxxl" /> : icon;

    return (
        <div className="empty-state">
            {iconContent && <div className="empty-state__icon">{iconContent}</div>}
            <h3 className="empty-state__title">{title}</h3>
            {description && <p className="empty-state__description">{description}</p>}
            {children}
            {hasActions && (
                <div className="empty-state__actions">
                    {buttons?.map(({ children: label, ...btnProps }, i) => (
                        <Button key={i} {...btnProps}>{label}</Button>
                    ))}
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
