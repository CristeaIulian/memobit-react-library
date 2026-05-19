import React, { useState } from 'react';

import { Button, type ExternalButtonConfig } from '../Button';
import { Icon } from '../Icon';

import './Banner.scss';

export type BannerVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BannerProps {
    action?: ExternalButtonConfig;
    /** Optional secondary button rendered next to `action`. */
    secondaryAction?: ExternalButtonConfig;
    className?: string;
    description: React.ReactNode;
    dismissLabel?: string;
    onDismiss?: () => void;
    /** Show the corner dismiss (✕) button. Default: true. */
    showDismiss?: boolean;
    title: React.ReactNode;
    variant?: BannerVariant;
}

export const Banner: React.FC<BannerProps> = ({
    action,
    secondaryAction,
    className = '',
    description,
    dismissLabel = 'Dismiss',
    onDismiss,
    showDismiss = true,
    title,
    variant = 'default',
}: BannerProps) => {
    const [isDismissed, setIsDismissed] = useState(false);
    const actionVariant = action?.variant || (variant === 'default' ? 'default' : variant);

    if (isDismissed) {
        return null;
    }

    const handleDismiss = () => {
        setIsDismissed(true);
        onDismiss?.();
    };

    return (
        <section className={`banner banner--${variant} ${className}`}>
            <div className="banner__content">
                <div className="banner__copy">
                    <h3 className="banner__title">{title}</h3>
                    <p className="banner__description">{description}</p>
                </div>
                {(action || secondaryAction) && (
                    <div className="banner__action">
                        {action && (
                            <Button {...action} size={action.size || 'small'} variant={actionVariant}>
                                {action.text}
                            </Button>
                        )}
                        {secondaryAction && (
                            <Button {...secondaryAction} size={secondaryAction.size || 'small'} variant={secondaryAction.variant || 'ghost'}>
                                {secondaryAction.text}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            {showDismiss && (
                <button className="banner__dismiss" type="button" title={dismissLabel} onClick={handleDismiss}>
                    <Icon name="clear" size="sm" />
                </button>
            )}
        </section>
    );
};
