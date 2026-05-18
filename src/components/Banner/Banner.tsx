import React, { useState } from 'react';

import { Button, type ExternalButtonConfig } from '../Button';
import { Icon } from '../Icon';

import './Banner.scss';

export type BannerVariant = 'default' | 'success' | 'info' | 'warning' | 'danger';

export interface BannerProps {
    action?: ExternalButtonConfig;
    className?: string;
    description: React.ReactNode;
    dismissLabel?: string;
    onDismiss?: () => void;
    title: React.ReactNode;
    variant?: BannerVariant;
}

export const Banner: React.FC<BannerProps> = ({
    action,
    className = '',
    description,
    dismissLabel = 'Dismiss',
    onDismiss,
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
                {action && (
                    <div className="banner__action">
                        <Button {...action} size={action.size || 'small'} variant={actionVariant}>
                            {action.text}
                        </Button>
                    </div>
                )}
            </div>
            <button className="banner__dismiss" type="button" title={dismissLabel} onClick={handleDismiss}>
                <Icon name="clear" size="sm" />
            </button>
        </section>
    );
};
