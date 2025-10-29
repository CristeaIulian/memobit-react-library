import React, { useEffect, useState } from 'react';

import { useComponentEffect } from '../../hooks/useComponentEffect';
import { up } from '../../icons/up';

import './Card.scss';

interface CardProps {
    children?: React.ReactNode;
    className?: string;
    isCollapsed?: boolean;
    isCollapsible?: boolean;
    isHighlighted?: boolean;
    noPadding?: boolean;
    title?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, isCollapsed, isCollapsible, isHighlighted, noPadding, title }: CardProps) => {
    const [isCardCollapsed, seIsCardCollapsed] = useState<boolean>(isCollapsed || false);
    const effectClass = useComponentEffect('Card');

    useEffect(() => {
        if (typeof isCollapsed === 'boolean') {
            seIsCardCollapsed(isCollapsed);
        }
    }, [isCollapsed]);

    return (
        <div className={`card ${className || ''} ${noPadding ? 'no-padding' : ''} ${isHighlighted ? 'is-highlighted' : ''} ${effectClass}`}>
            {(title || isCollapsible) && (
                <h3 className={`${isCardCollapsed ? 'content-hidden' : ''}`}>
                    {title}
                    {isCollapsible && (
                        <span className="collapsible-button" onClick={() => seIsCardCollapsed(!isCardCollapsed)}>
                            <span className={`opener-button ${isCardCollapsed ? 'opener-button-extended' : ''}`}>{up}</span>
                        </span>
                    )}
                </h3>
            )}
            <div className={`content ${isCardCollapsed ? 'content-collapsed' : ''}`}>{children}</div>
        </div>
    );
};
