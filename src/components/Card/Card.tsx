import React, { useEffect, useState } from 'react';

import { useComponentEffect } from '../../hooks/useComponentEffect';
import { Icon } from '../Icon';

import './Card.scss';

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    footerContent?: React.ReactNode;
    isCollapsed?: boolean;
    isCollapsible?: boolean;
    isFooterCollapsible?: boolean;
    isHighlighted?: boolean;
    noPadding?: boolean;
    onClick?: () => void;
    title?: string;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    footerContent,
    isCollapsed,
    isCollapsible,
    isFooterCollapsible = true,
    isHighlighted,
    noPadding,
    onClick,
    title,
}: CardProps) => {
    const [isCardCollapsed, seIsCardCollapsed] = useState<boolean>(isCollapsed || false);
    const effectClass = useComponentEffect('Card');

    useEffect(() => {
        if (typeof isCollapsed === 'boolean') {
            seIsCardCollapsed(isCollapsed);
        }
    }, [isCollapsed]);

    return (
        <div
            className={`card ${className || ''} ${noPadding ? 'no-padding' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${!!onClick ? 'is-clickable' : ''} ${effectClass}`}
            onClick={onClick}
        >
            {(title || isCollapsible) && (
                <h3 className={`${isCardCollapsed ? 'card-content-hidden' : ''}`}>
                    {title}
                    {isCollapsible && (
                        <span className="collapsible-button" onClick={() => seIsCardCollapsed(!isCardCollapsed)}>
                            <span className={`opener-button ${isCardCollapsed ? 'opener-button-extended' : ''}`}><Icon name="up" size="lg" /></span>
                        </span>
                    )}
                </h3>
            )}
            <div className={`card-content ${isCardCollapsed ? 'card-content-collapsed' : ''}`}>{children}</div>
            {footerContent && <div className={`card-footer ${isCardCollapsed && isFooterCollapsible ? 'card-footer-collapsed' : ''}`}>{footerContent}</div>}
        </div>
    );
};
