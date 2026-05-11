import React, { type ReactNode, useState } from 'react';

import { Icon, type IconName } from '../Icon';

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
    toggleMiddleIcon?: IconName;
    toggleSize?: 'small' | 'medium';
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
    toggleSize,
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

    const hasFullRowClick = !!rightDetails;

    return (
        <div className={`collapsible-section ${className} ${isCollapsed ? 'collapsible-section__collapsed' : ''}`}>
            {title && (
                <div
                    className={`collapsible-section__header ${!hasFullRowClick ? 'collapsible-section__header--inline' : ''} ${toggleSpaceBetween ? 'collapsible-section__header--space-between' : ''} ${toggleSwap ? 'collapsible-section__header--swap' : ''} ${toggleHighlight ? 'collapsible-section__header--highlight' : ''} ${toggleAccent ? 'collapsible-section__header--accent' : ''} ${toggleSize ? `collapsible-section__header--size-${toggleSize}` : ''} ${toggleVariant ? `collapsible-section__header--variant-${toggleVariant}` : ''}`}
                    onClick={hasFullRowClick ? handleToggle : undefined}
                >
                    {hasFullRowClick ? (
                        <>
                            <div className="collapsible-section__label">{title}</div>
                            {toggleMiddleIcon && <span><Icon name={toggleMiddleIcon} /></span>}
                            <span className={`collapsible-section__icon ${isCollapsed ? 'collapsible-section__icon--collapsed' : ''}`}>
                                <Icon name="caret-up" />
                            </span>
                            <span className="collapsible-section__right-details">{rightDetails}</span>
                        </>
                    ) : (
                        <button type="button" className="collapsible-section__inline-toggle" onClick={handleToggle}>
                            <span className="collapsible-section__label">{title}</span>
                            {toggleMiddleIcon && <span><Icon name={toggleMiddleIcon} /></span>}
                            <span className={`collapsible-section__icon ${isCollapsed ? 'collapsible-section__icon--collapsed' : ''}`}>
                                <Icon name="caret-up" />
                            </span>
                        </button>
                    )}
                </div>
            )}
            <div className={`collapsible-section__content ${isCollapsed ? 'collapsible-section__content--collapsed' : ''}`}>{children}</div>
        </div>
    );
};
