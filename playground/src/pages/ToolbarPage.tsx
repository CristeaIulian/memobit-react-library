import React, { useMemo, useState } from 'react';

import {
    Badge,
    Button,
    ControlPanelProvider,
    type DropdownOption,
    InputSearch,
    type MenuHamburgerItem,
    type NotificationPanelItem,
    ToggleButtons,
    Toolbar,
    Tooltip,
    useControlPanelContext,
} from '../../../src';

const sortOptions: DropdownOption[] = [
    { label: 'Title asc', value: 'title-asc' },
    { label: 'Title desc', value: 'title-desc' },
    { label: 'Updated asc', value: 'updated-asc' },
    { label: 'Updated desc', value: 'updated-desc' },
];

const notificationItems: NotificationPanelItem[] = [
    { id: 'disk', severity: 'critical', message: 'Backup disk is 96% full' },
    { id: 'cert', severity: 'warning', message: 'TLS certificate expires in 9 days' },
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
    const [selectedCount, setSelectedCount] = useState(2);
    const [readerView, setReaderView] = useState('page');
    const [lastAction, setLastAction] = useState('none');
    const [isPrivate, setIsPrivate] = useState(true);

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
                <h2>Actions</h2>
                <p>
                    <code>actions</code> holds buttons and status: at the right beside the menu on desktop, and in the top row next to the filter toggle on
                    mobile. Extra filters and controls stay in <code>children</code>.
                </p>

                <div className="showcase-group">
                    <h3>Selection Actions Beside Search And Sort</h3>
                    <ControlPanelProvider>
                        <Toolbar
                            controlPanelToggle
                            menuItems={menuItems}
                            search={{ onChange: setSearch, placeholder: 'Search by name...', value: search }}
                            sort={{ onChange: value => setSort(value || 'title-asc'), options: sortOptions, value: sort }}
                            actions={
                                <>
                                    {selectedCount >= 2 && (
                                        <Tooltip title={`Compare ${selectedCount} selected items`}>
                                            <Button variant="info" icon="chart" onClick={() => setLastAction(`compare ${selectedCount}`)}>
                                                Compare ({selectedCount})
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {selectedCount > 0 && (
                                        <Tooltip title="Clear selection">
                                            <Button variant="ghost" icon="deselect-all" onClick={() => setSelectedCount(0)} />
                                        </Tooltip>
                                    )}
                                </>
                            }
                        />
                    </ControlPanelProvider>
                    <p style={{ marginTop: '12px' }}>
                        Selected: {selectedCount} | Last action: {lastAction}{' '}
                        <Button size="small" variant="ghost" icon="plus" onClick={() => setSelectedCount(count => count + 1)}>
                            Select one more
                        </Button>
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>A Control In Children, Icon Actions Beside The Menu</h3>
                    <Toolbar
                        menuItems={menuItems}
                        actions={
                            <>
                                <Tooltip title="Go to a page or chapter">
                                    <Button variant="ghost" icon="compass" onClick={() => setLastAction('navigate')} />
                                </Tooltip>
                                <Tooltip title="Download">
                                    <Button variant="ghost" icon="download" onClick={() => setLastAction('download')} />
                                </Tooltip>
                            </>
                        }
                    >
                        <ToggleButtons
                            size="small"
                            state={readerView}
                            states={[
                                { key: 'page', label: 'Page', icon: 'filetype-pdf' },
                                { key: 'text', label: 'Text', icon: 'reading' },
                            ]}
                            onToggleChange={setReaderView}
                        />
                    </Toolbar>
                    <p style={{ marginTop: '12px' }}>
                        View: {readerView} | Last action: {lastAction}
                    </p>
                </div>

                <div className="showcase-group">
                    <h3>Status Badge With Notifications</h3>
                    <Toolbar
                        heading={{ title: 'Lifeline', description: '128 memories' }}
                        menuItems={menuItems}
                        notifications={{ items: notificationItems }}
                        actions={
                            isPrivate && (
                                <Badge variant="success" size="small">
                                    Private mode
                                </Badge>
                            )
                        }
                    />
                    <p style={{ marginTop: '12px' }}>
                        <Button size="small" variant="ghost" icon={isPrivate ? 'lock' : 'lock-open'} onClick={() => setIsPrivate(value => !value)}>
                            {isPrivate ? 'Lock private memories' : 'Unlock private memories'}
                        </Button>
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
