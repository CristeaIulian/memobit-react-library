import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SidebarProvider, ThemeProvider } from '../../src';
import { Layout } from './components/Layout/Layout';
import { routes } from './routes';

import '../../src/styles/variables.scss';
import '../../src/styles/effects.scss';
import '../../src/styles/highlight.scss';
import '../../src/styles/theming/arctic-blue.scss';
import '../../src/styles/theming/azure-night.scss';
import '../../src/styles/theming/cobalt-pulse.scss';
import '../../src/styles/theming/crimson-dusk.scss';
import '../../src/styles/theming/cyber-forest.scss';
import '../../src/styles/theming/dashdarkx.scss';
import '../../src/styles/theming/ember-night.scss';
import '../../src/styles/theming/frost-petal.scss';
import '../../src/styles/theming/lavender-mist.scss';
import '../../src/styles/theming/light-blue.scss';
import '../../src/styles/theming/luna.scss';
import '../../src/styles/theming/midnight-amber.scss';
import '../../src/styles/theming/mint-meadow.scss';
import '../../src/styles/theming/mintone.scss';
import '../../src/styles/theming/neon-tokyo.scss';
import '../../src/styles/theming/ocean-breeze.scss';
import '../../src/styles/theming/ocean-depths.scss';
import '../../src/styles/theming/sandstone.scss';
import '../../src/styles/theming/sandy-parchment.scss';
import '../../src/styles/theming/tailwind-vue-dark.scss';
import '../../src/styles/theming/twilight-pulse.scss';
import '../../src/styles/utilities.scss';

import './App.scss';

function App() {
    return (
        <SidebarProvider>
            <ThemeProvider>
                <Router>
                    <Layout>
                        <Routes>
                            {routes.map(route => (
                                <Route key={route.path} path={route.path} element={<route.component />} />
                            ))}
                        </Routes>
                    </Layout>
                </Router>
            </ThemeProvider>
        </SidebarProvider>
    );
}

export default App;
