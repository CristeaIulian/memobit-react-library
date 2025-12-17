import { type ReactNode, useState } from 'react';

import { up } from '../../icons/up';

import './CollapsibleSection.scss';

interface CollapsibleSectionProps {
    children: ReactNode;
    className?: string;
    defaultCollapsed?: boolean;
    isCollapsed?: boolean;
    label?: ReactNode;
    onToggle?: (isCollapsed: boolean) => void;
}

export const CollapsibleSection = ({
    children,
    className = '',
    defaultCollapsed = false,
    isCollapsed: controlledIsCollapsed,
    label,
    onToggle,
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
                <div className="collapsible-section__header" onClick={handleToggle}>
                    <div className="collapsible-section__label">{label}</div>
                    <span className={`collapsible-section__icon ${isCollapsed ? 'collapsible-section__icon--collapsed' : ''}`}>
                        {up}
                    </span>
                </div>
            )}
            <div className={`collapsible-section__content ${isCollapsed ? 'collapsible-section__content--collapsed' : ''}`}>
                {children}
            </div>
        </div>
    );
};
