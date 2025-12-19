import React from 'react';
import { NavLink } from 'react-router-dom';

import { sortedRoutes } from '../../routes';

import './Sidebar.scss';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    isMobile: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isMobile }) => {
    const handleLinkClick = () => {
        if (isMobile) {
            onClose();
        }
    };

    return (
        <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''} ${isMobile ? 'sidebar--mobile' : ''}`}>
            <nav className="sidebar__nav">
                <NavLink to="/" className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} onClick={handleLinkClick}>
                    Home
                </NavLink>

                <div className="sidebar__divider" />

                {sortedRoutes.map(route => (
                    <NavLink
                        key={route.path}
                        to={route.path}
                        className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
                        onClick={handleLinkClick}
                    >
                        {route.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};
