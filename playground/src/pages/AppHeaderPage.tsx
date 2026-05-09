import { FC } from 'react';

import { AppHeader } from '../../../src';

export const AppHeaderPage: FC = () => {
    return (
        <div className="app-header-page">
            <h1>AppHeader Component</h1>
            <p>
                A reusable header component displaying an icon, app name, and headline. Can be used in control panels, toolbars, head bars, and other UI
                elements.
            </p>

            <section className="page-section">
                <h2>AppHeader Examples</h2>

                <div className="showcase-group">
                    <h3>Basic AppHeader</h3>
                    <div className="component-group">
                        <AppHeader icon="book" appName="Books" heading="My Library" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader with Click Handler</h3>
                    <div className="component-group">
                        <AppHeader icon="settings" appName="Settings" heading="User Preferences" onClick={() => alert('Header clicked!')} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader without Icon</h3>
                    <div className="component-group">
                        <AppHeader appName="Dashboard" heading="Overview" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader with App Name Only</h3>
                    <div className="component-group">
                        <AppHeader icon="home" appName="Home" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>AppHeader without Separator</h3>
                    <div className="component-group">
                        <AppHeader icon="calendar" appName="Calendar" heading="Events" showSeparator={false} />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>Different Icons</h3>
                    <div className="component-group">
                        <AppHeader icon="movie" appName="Movies" heading="Collection" />
                        <AppHeader icon="list" appName="Shopping" heading="Cart" />
                        <AppHeader icon="heart" appName="Favorites" heading="Saved Items" />
                        <AppHeader emoji="📚" appName="Library" heading="Resources" />
                    </div>
                </div>

                <div className="showcase-group">
                    <h3>With Emoji Icons</h3>
                    <div className="component-group">
                        <AppHeader emoji="🎵" appName="Music" heading="Playlists" />
                        <AppHeader emoji="🎮" appName="Games" heading="Collection" />
                        <AppHeader emoji="✈️" appName="Travel" heading="Destinations" />
                    </div>
                </div>
            </section>
        </div>
    );
};
