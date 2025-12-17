import { type ReactNode, useState } from 'react';

import { up } from '../../icons/up';

import './CollapsibleSection.scss';

interface CollapsibleSectionProps {
    children: ReactNode;
    className?: string;
    collapsibleToggleSpaceBetween?: boolean;
    collapsibleToggleSwap?: boolean;
    defaultCollapsed?: boolean;
    isCollapsed?: boolean;
    label?: ReactNode;
    onToggle?: (isCollapsed: boolean) => void;
    rightDetails?: string;
}

export const CollapsibleSection = ({
    children,
    className = '',
    collapsibleToggleSpaceBetween,
    collapsibleToggleSwap,
    defaultCollapsed = false,
    isCollapsed: controlledIsCollapsed,
    label,
    onToggle,
    rightDetails,
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
            {label && (
                <div
                    className={`collapsible-section__header ${collapsibleToggleSpaceBetween ? 'collapsible-section__header--space-between' : ''} ${collapsibleToggleSwap ? 'collapsible-section__header--swap' : ''}`}
                    onClick={handleToggle}
                >
                    <div className="collapsible-section__label">{label}</div>
                    <span className={`collapsible-section__icon ${isCollapsed ? 'collapsible-section__icon--collapsed' : ''}`}>{up}</span>
                    {rightDetails && <span className="collapsible-section__right-details">{rightDetails}</span>}
                </div>
            )}
            <div className={`collapsible-section__content ${isCollapsed ? 'collapsible-section__content--collapsed' : ''}`}>{children}</div>
        </div>
    );
};
