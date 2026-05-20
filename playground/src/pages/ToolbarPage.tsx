import React, { useMemo, useState } from 'react';

import { ControlPanelProvider, InputSearch, Toolbar, type DropdownOption, type MenuHamburgerItem, useControlPanelContext } from '../../../src';

const sortOptions: DropdownOption[] = [
    { label: 'Title asc', value: 'title-asc' },
    { label: 'Title desc', value: 'title-desc' },
    { label: 'Updated asc', value: 'updated-asc' },
    { label: 'Updated desc', value: 'updated-desc' },
];

const ControlPanelState = () => {
    const controlPanel = useControlPanelContext();

    if (!controlPanel) {
        return null;
    }

    return (
        <p style={{ marginTop: '12px', color: 'var(--body-color-muted)' }}>
            Control panel: {controlPanel.isOpen ? 'open' : 'closed'} ({controlPanel.isMobile ? 'mobile' : 'desktop'})
        </p>
    );
};

export const ToolbarPage: React.FC = () => {
    const [activeMenu, setActiveMenu] = useState('list');
    const [search, setSearch] = useState('');
    const [moviesSearch, setMoviesSearch] = useState('');
    const [imdbSearch, setImdbSearch] = useState('');
    const [sort, setSort] = useState('title-asc');
    const [movieSort, setMovieSort] = useState('updated-desc');

    const menuItems = useMemo<MenuHamburgerItem[]>(
        () => [
            {
                label: 'List',
                icon: 'list',
                isActive: activeMenu === 'list',
                onClick: () => setActiveMenu('list'),
            },
            {
                label: 'Archive',
                icon: 'archive',
                isActive: activeMenu === 'archive',
                onClick: () => setActiveMenu('archive'),
            },
            {
                label: 'Theme',
                icon: 'theme-picker',
                isActive: false,
                onClick: () => setActiveMenu('theme'),
                separator: true,
            },
            {
                label: 'Logout demo-user',
                icon: 'logout',
                isActive: false,
                onClick: () => setActiveMenu('logout'),
            },
        ],
        [activeMenu]
    );

    const singleMenuItem = useMemo<MenuHamburgerItem[]>(
        () => [
            {
                label: 'Theme',
                icon: 'theme-picker',
                isActive: false,
                onClick: () => setActiveMenu('theme'),
            },
        ],
        []
    );

    return (
        <div className="component-page">
            <h1>Toolbar Component</h1>
            <p>A router-agnostic app toolbar with project-owned menu items and optional search, sort, and extra controls.</p>

            <section className="page-section">
                <h2>Menu Only</h2>
                <div className="showcase-group">
                    <h3>Navigation Shell</h3>
                    <Toolbar menuItems={menuItems} />
                    <p style={{ marginTop: '12px' }}>Last action: {activeMenu}</p>
                </div>

                <div className="showcase-group">
                    <h3>Heading without Card Chrome</h3>
                    <Toolbar
                        heading={{ title: 'Production queue', description: '12 deployments waiting for review' }}
                        noCard
                        menuItems={menuItems}
                        search={{ onChange: setSearch, placeholder: 'Search queue...', value: search }}
                    />
                </div>
            </section>

            <section className="page-section">
                <h2>Single Menu Item</h2>
                <div className="showcase-group">
                    <h3>Direct Action</h3>
                    <Toolbar menuItems={singleMenuItem} search={{ onChange: setSearch, placeholder: 'Search...', value: search }} />
                </div>
            </section>

            <section className="page-section">
                <h2>Search And Sort</h2>
                <div className="showcase-group">
                    <h3>Common List Toolbar</h3>
                    <Toolbar
                        menuItems={menuItems}
                        search={{
                            label: 'Search',
                            onChange: setSearch,
                            placeholder: 'Search by title...',
                            value: search,
                        }}
                        sort={{
                            highlighted: sort !== 'title-asc',
                            label: 'Sort By',
                            onChange: value => setSort(value || 'title-asc'),
                            options: sortOptions,
                            value: sort,
                        }}
                    />
                    <p style={{ marginTop: '12px' }}>
                        Search: {search || '(empty)'} | Sort: {sort}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Extra Controls</h2>
                <div className="showcase-group">
                    <h3>Injected Input Between Search And Sort</h3>
                    <Toolbar
                        menuItems={menuItems}
                        search={{
                            label: 'Search',
                            onChange: setMoviesSearch,
                            placeholder: 'Search titles...',
                            value: moviesSearch,
                        }}
                        sort={{
                            highlighted: movieSort !== 'title-asc',
                            label: 'Sort By',
                            onChange: value => setMovieSort(value || 'title-asc'),
                            options: sortOptions,
                            value: movieSort,
                        }}
                    >
                        <InputSearch label="IMDB ID" onChange={setImdbSearch} placeholder="tt1234567" value={imdbSearch} />
                    </Toolbar>
                    <p style={{ marginTop: '12px' }}>
                        Title: {moviesSearch || '(empty)'} | IMDB: {imdbSearch || '(empty)'} | Sort: {movieSort}
                    </p>
                </div>
            </section>

            <section className="page-section">
                <h2>Control Panel Toggle</h2>
                <div className="showcase-group">
                    <h3>Mobile ControlPanel Toggle</h3>
                    <ControlPanelProvider>
                        <Toolbar controlPanelToggle menuItems={menuItems} search={{ onChange: setSearch, placeholder: 'Search...', value: search }} />
                        <ControlPanelState />
                    </ControlPanelProvider>
                </div>
            </section>
        </div>
    );
};
