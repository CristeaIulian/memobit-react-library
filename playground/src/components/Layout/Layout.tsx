import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../Header';
import { Sidebar, SidebarSection, useBreakpoint } from '../../../../src';
import { sortedRoutes } from '../../routes';

import './Layout.scss';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);
    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Convert routes to sidebar sections
    const sidebarSections: SidebarSection[] = [
        {
            items: [
                {
                    id: 'home',
                    label: 'Home',
                    isActive: location.pathname === '/',
                    onClick: () => navigate('/'),
                },
            ],
            showDivider: true,
        },
        {
            items: sortedRoutes.map(route => ({
                id: route.path,
                label: route.label,
                className: route.path === '/theme-lab' ? 'playground-sidebar-item playground-sidebar-item--theme-lab' : undefined,
                isActive: location.pathname === route.path,
                onClick: () => navigate(route.path),
            })),
            showDivider: false,
        },
    ];

    return (
        <div className="layout">
            <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={toggleSidebar} />

            <div className="layout__container">
                <Sidebar
                    sections={sidebarSections}
                    appHeaderProps={
                        isMobile ? { icon: 'toolbox', appName: 'Playground', heading: 'Components' } : undefined
                    }
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isMobile={isMobile}
                    showOverlay={false}
                    searchPlaceholder="Search pages..."
                />

                {isMobile && isSidebarOpen && <div className="layout__overlay" onClick={() => setIsSidebarOpen(false)} />}

                <main className="layout__content">{children}</main>
            </div>
        </div>
    );
};
