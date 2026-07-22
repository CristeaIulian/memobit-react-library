import React, { ReactNode, useState } from 'react';

import { AppHeader, type AppHeaderProps } from '../AppHeader';
import { Icon, type IconName } from '../Icon';
import { InputSearch } from '../InputSearch';
import { Tooltip } from '../Tooltip';

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
    appHeaderProps?: AppHeaderProps;
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
    appHeaderProps,
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

    const visibleSections =
        searchPlaceholder && searchQuery
            ? sections
                  .map(section => ({
                      ...section,
                      items: section.items.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase())),
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
            {item.icon && (
                <span className="sidebar__link-icon">
                    <Icon name={item.icon} />
                </span>
            )}
            {item.emoji && <span className="sidebar__link-emoji">{item.emoji}</span>}
            {item.bulletColor && <span className="sidebar__link-bullet" style={{ backgroundColor: item.bulletColor }} />}
            <span className="sidebar__link-label">{item.label}</span>
            {item.count !== undefined && (
                <Tooltip title={item.countLabel}>
                    <span className="sidebar__link-count">
                        {item.count}
                    </span>
                </Tooltip>
            )}
        </button>
    );

    return (
        <>
            {showOverlay && isMobile && isOpen && <div className={overlayClassName} onClick={close} />}
            <aside className={sidebarClassName} style={sidebarStyle}>
                {appHeaderProps && (
                    <AppHeader
                        {...appHeaderProps}
                        className={['sidebar__app-header', appHeaderProps.className].filter(Boolean).join(' ')}
                    />
                )}
                {searchPlaceholder && (
                    <div className="sidebar__search">
                        <InputSearch value={searchQuery} onChange={setSearchQuery} placeholder={searchPlaceholder} />
                    </div>
                )}
                {visibleSections.length > 0 && (
                    <nav className="sidebar__nav">
                        {visibleSections.map((section, sectionIndex) => (
                            <section className="sidebar__section" key={section.id ?? section.title ?? sectionIndex}>
                                {(section.title || section.heading || section.icon || section.description) && (
                                    <div className="sidebar__section-header">
                                        {(section.icon || section.title || section.heading) && (
                                            <div className="sidebar__section-title-row">
                                                {section.icon && (
                                                    <span className="sidebar__section-icon">
                                                        <Icon name={section.icon} />
                                                    </span>
                                                )}
                                                <div className="sidebar__section-copy">
                                                    {section.title && <span className="sidebar__section-title">{section.title}</span>}
                                                    {section.heading && <span className="sidebar__section-heading">{section.heading}</span>}
                                                </div>
                                            </div>
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
