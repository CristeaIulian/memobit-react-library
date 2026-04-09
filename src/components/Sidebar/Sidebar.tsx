import React, { ReactNode } from 'react';

import { useSidebar } from './SidebarContext';

import './Sidebar.scss';

export interface SidebarItem {
    id: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    icon?: string;
}

export interface SidebarSection {
    items: SidebarItem[];
    showDivider?: boolean;
}

interface SidebarProps {
    sections: SidebarSection[];
    width?: string;
    className?: string;
    renderItem?: (item: SidebarItem) => ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
    sections,
    width = '280px',
    className = '',
    renderItem,
}) => {
    const { isMobile, isOpen, close } = useSidebar();

    const handleItemClick = (item: SidebarItem) => {
        if (item.onClick) {
            item.onClick();
        }
        if (isMobile) {
            close();
        }
    };

    const defaultRenderItem = (item: SidebarItem) => (
        <button
            key={item.id}
            className={`sidebar__link ${item.isActive ? 'sidebar__link--active' : ''}`}
            onClick={() => handleItemClick(item)}
        >
            {item.icon && <span className="sidebar__link-icon">{item.icon}</span>}
            <span className="sidebar__link-label">{item.label}</span>
        </button>
    );

    return (
        <>
            {isMobile && isOpen && <div className="sidebar__overlay" onClick={close} />}
            <aside
                className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${isMobile ? 'sidebar--mobile' : ''} ${className}`}
                style={{ '--sidebar-width': width } as React.CSSProperties}
            >
                <nav className="sidebar__nav">
                    {sections.map((section, sectionIndex) => (
                        <React.Fragment key={sectionIndex}>
                            {section.items.map(item => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
                            {section.showDivider && sectionIndex < sections.length - 1 && <div className="sidebar__divider" />}
                        </React.Fragment>
                    ))}
                </nav>
            </aside>
        </>
    );
};
