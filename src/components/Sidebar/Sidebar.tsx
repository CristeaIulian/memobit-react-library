import React, { ReactNode, useState } from 'react';

import { AppHeader } from '../AppHeader';
import { Icon, type IconName } from '../Icon';
import { Search } from '../Search';
import { useSidebarContext } from './SidebarContext';

import './Sidebar.scss';

export interface SidebarItem {
    id: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    className?: string;
    icon?: IconName;
    emoji?: string;
    bulletColor?: string;
    count?: number | string;
    countLabel?: string;
}

export interface SidebarSection {
    id?: string;
    title?: string;
    heading?: string;
    icon?: IconName;
    description?: string;
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
    shadow?: string;
    searchPlaceholder?: string;
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
    shadow = 'none',
    searchPlaceholder,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const sidebarContext = useSidebarContext();
    const isMobile = isMobileProp ?? sidebarContext?.isMobile ?? false;
    const isOpen = isOpenProp ?? (isMobile ? (sidebarContext?.isOpen ?? false) : true);
    const close = onClose ?? sidebarContext?.close ?? (() => undefined);

    const visibleSections = searchPlaceholder && searchQuery
        ? sections
            .map(section => ({
                ...section,
                items: section.items.filter(item =>
                    item.label.toLowerCase().includes(searchQuery.toLowerCase())
                ),
            }))
            .filter(section => section.items.length > 0)
        : sections;

    const sidebarClassName = [
        'sidebar',
        isOpen ? 'sidebar--open' : 'sidebar--closed',
        isMobile ? 'sidebar--mobile' : '',
        contained ? 'sidebar--contained' : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');
    const overlayClassName = ['sidebar__overlay', contained ? 'sidebar__overlay--contained' : ''].filter(Boolean).join(' ');
    const sidebarStyle = {
        '--sidebar-width': width,
        '--sidebar-shadow': shadow,
    } as React.CSSProperties;

    const handleItemClick = (item: SidebarItem) => {
        item.onClick?.();
        if (isMobile) close();
    };

    const defaultRenderItem = (item: SidebarItem) => (
        <button
            key={item.id}
            className={['sidebar__link', item.isActive ? 'sidebar__link--active' : '', item.className].filter(Boolean).join(' ')}
            onClick={() => handleItemClick(item)}
        >
            {item.icon && <span className="sidebar__link-icon"><Icon name={item.icon} /></span>}
            {item.emoji && <span className="sidebar__link-emoji">{item.emoji}</span>}
            {item.bulletColor && <span className="sidebar__link-bullet" style={{ backgroundColor: item.bulletColor }} />}
            <span className="sidebar__link-label">{item.label}</span>
            {item.count !== undefined && (
                <span className="sidebar__link-count" aria-label={item.countLabel}>
                    {item.count}
                </span>
            )}
        </button>
    );

    return (
        <>
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside className={sidebarClassName} style={sidebarStyle}>
                {searchPlaceholder && (
                    <div className="sidebar__search">
                        <Search value={searchQuery} onChange={setSearchQuery} placeholder={searchPlaceholder} />
                    </div>
                )}
                {visibleSections.length > 0 && (
                    <nav className="sidebar__nav">
                        {visibleSections.map((section, sectionIndex) => (
                            <section className="sidebar__section" key={section.id ?? section.title ?? sectionIndex}>
                                {(section.title || section.heading || section.icon || section.description) && (
                                    <div className="sidebar__section-header">
                                        {(section.icon || section.title || section.heading) && (
                                            <AppHeader
                                                className="sidebar__section-app-header"
                                                icon={section.icon}
                                                appName={section.title}
                                                heading={section.heading}
                                                showSeparator={false}
                                            />
                                        )}
                                        {section.description && <p className="sidebar__section-description">{section.description}</p>}
                                    </div>
                                )}
                                {section.items.map(item => (renderItem ? renderItem(item) : defaultRenderItem(item)))}
                                {section.showDivider && sectionIndex < visibleSections.length - 1 && <div className="sidebar__divider" />}
                            </section>
                        ))}
                    </nav>
                )}
            </aside>
        </>
    );
};
