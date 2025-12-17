import React, { type ReactNode, useState } from 'react';

import { up } from '../../icons/up';

import './CollapsibleSection.scss';

interface CollapsibleSectionProps {
    children: ReactNode;
    className?: string;
    defaultCollapsed?: boolean;
    isCollapsed?: boolean;
    onToggle?: (isCollapsed: boolean) => void;
    rightDetails?: string;
    title?: ReactNode;
    toggleAccent?: boolean;
    toggleHighlight?: boolean;
    toggleMiddleIcon?: string;
    toggleSpaceBetween?: boolean;
    toggleSwap?: boolean;
    toggleVariant?: 'success' | 'info' | 'warning' | 'danger';
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    children,
    className = '',
    defaultCollapsed = false,
    isCollapsed: controlledIsCollapsed,
    onToggle,
    rightDetails,
    title,
    toggleAccent,
    toggleHighlight,
    toggleMiddleIcon,
    toggleSpaceBetween,
    toggleSwap,
    toggleVariant,
}: CollapsibleSectionProps) => {
    const [internalIsCollapsed, setInternalIsCollapsed] = useState(defaultCollapsed);

    const isControlled = controlledIsCollapsed !== undefined;
    const isCollapsed = isControlled ? controlledIsCollapsed : internalIsCollapsed;

    const handleToggle = () => {
        const newCollapsedState = !isCollapsed;

        if (!isControlled) {
            setInternalIsCollapsed(newCollapsedState);
        }

        onToggle?.(newCollapsedState);
    };

    return (
        <div className={`collapsible-section ${className}`}>
            {title && (
                <div
                    className={`collapsible-section__header ${toggleSpaceBetween ? 'collapsible-section__header--space-between' : ''} ${toggleSwap ? 'collapsible-section__header--swap' : ''} ${toggleHighlight ? 'collapsible-section__header--highlight' : ''} ${toggleAccent ? 'collapsible-section__header--accent' : ''} ${toggleVariant ? `collapsible-section__header--variant-${toggleVariant}` : ''}`}
                    onClick={handleToggle}
                >
                    <div className="collapsible-section__label">{title}</div>
                    {toggleMiddleIcon && <span>{toggleMiddleIcon}</span>}
                    <span className={`collapsible-section__icon ${isCollapsed ? 'collapsible-section__icon--collapsed' : ''}`}>{up}</span>
                    {rightDetails && <span className="collapsible-section__right-details">{rightDetails}</span>}
                </div>
            )}
            <div className={`collapsible-section__content ${isCollapsed ? 'collapsible-section__content--collapsed' : ''}`}>{children}</div>
        </div>
    );
};
