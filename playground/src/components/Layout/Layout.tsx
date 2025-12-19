import React, { useState } from 'react';

import { Header } from '../../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { useBreakpoint } from '../../../../src';

import './Layout.scss';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isMobile } = useBreakpoint();
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!isMobile);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout">
            <Header />

            <div className="layout__container">
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={isMobile} />

                {isMobile && isSidebarOpen && <div className="layout__overlay" onClick={() => setIsSidebarOpen(false)} />}

                <main className="layout__content">
                    {isMobile && (
                        <button className="layout__hamburger" onClick={toggleSidebar} aria-label="Toggle navigation">
                            ☰
                        </button>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
};
