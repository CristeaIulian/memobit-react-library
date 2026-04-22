import React, { ReactNode } from 'react';

import { useSidebarContext } from './SidebarContext';

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

export interface SidebarProps {
    sections: SidebarSection[];
    width?: string;
    className?: string;
    renderItem?: (item: SidebarItem) => ReactNode;
    isOpen?: boolean;
    onClose?: () => void;
    isMobile?: boolean;
    showOverlay?: boolean;
    contained?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
    sections,
    width = '280px',
    className = '',
    renderItem,
    isOpen: isOpenProp,
    onClose,
    isMobile: isMobileProp,
    showOverlay = true,
    contained = false,
}) => {
    const sidebarContext = useSidebarContext();
    const isMobile = isMobileProp ?? sidebarContext?.isMobile ?? false;
    const isOpen = isOpenProp ?? (isMobile ? sidebarContext?.isOpen ?? false : true);
    const close = onClose ?? sidebarContext?.close ?? (() => undefined);
    const sidebarClassName = [
        'sidebar',
        isOpen ? 'sidebar--open' : 'sidebar--closed',
        isMobile ? 'sidebar--mobile' : '',
        contained ? 'sidebar--contained' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const overlayClassName = ['sidebar__overlay', contained ? 'sidebar__overlay--contained' : '']
        .filter(Boolean)
        .join(' ');

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
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside
                className={sidebarClassName}
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
