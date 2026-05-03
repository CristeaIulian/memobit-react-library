import React, { FC } from 'react';

import { AppHeader, Icon } from '../../../src';

export const AppHeaderPage: FC = () => {
    return (
        <div className="app-header-page">
            <h1>AppHeader Component</h1>
            <p>A reusable header component displaying an icon, app name, and headline. Can be used in control panels, toolbars, head bars, and other UI elements.</p>

            <section className="page-section">
                <h2>AppHeader Examples</h2>

                <div className="showcase-group">
                    <h3>Basic AppHeader</h3>
                    <div className="component-group">
                        <AppHeader icon={<Icon name="book" />} appName="Books" headline="My Library" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader with Click Handler</h3>
                    <div className="component-group">
                        <AppHeader icon={<Icon name="settings" />} appName="Settings" headline="User Preferences" onClick={() => alert('Header clicked!')} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader without Icon</h3>
                    <div className="component-group">
                        <AppHeader appName="Dashboard" headline="Overview" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader with App Name Only</h3>
                    <div className="component-group">
                        <AppHeader icon={<Icon name="home" />} appName="Home" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader without Separator</h3>
                    <div className="component-group">
                        <AppHeader icon={<Icon name="calendar" />} appName="Calendar" headline="Events" showSeparator={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Different Icons</h3>
                    <div className="component-group">
                        <AppHeader icon={<Icon name="movie" />} appName="Movies" headline="Collection" />
                        <AppHeader icon={<Icon name="shopping-cart" />} appName="Shopping" headline="Cart" />
                        <AppHeader icon={<Icon name="heart" />} appName="Favorites" headline="Saved Items" />
                        <AppHeader icon="📚" appName="Library" headline="Resources" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Emoji Icons</h3>
                    <div className="component-group">
                        <AppHeader icon="🎵" appName="Music" headline="Playlists" />
                        <AppHeader icon="🎮" appName="Games" headline="Collection" />
                        <AppHeader icon="✈️" appName="Travel" headline="Destinations" />
                    </div>
                </div>
            </section>
        </div>
    );
};
