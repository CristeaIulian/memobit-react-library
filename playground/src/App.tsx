import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { SidebarProvider, type Theme, ThemeProvider, useAppPersistence } from '../../src';
import { Layout } from './components/Layout/Layout';
import { routes } from './routes';

import '../../src/styles/variables.scss';
import '../../src/styles/effects.scss';
import '../../src/styles/highlight.scss';
import '../../src/styles/themes.scss';
import '../../src/styles/utility-classes.scss';

import './App.scss';

interface PlaygroundTheme {
    name: Theme;
    effect: string;
    appliesTo: string[];
}

const DEFAULT_THEME: PlaygroundTheme = {
    name: 'luna',
    effect: '',
    appliesTo: [],
};

function App() {
    const { theme, setTheme } = useAppPersistence<Record<string, never>, PlaygroundTheme>('memobit-playground', {
        theme: DEFAULT_THEME,
    });

    return (
        <SidebarProvider>
            <ThemeProvider
                theme={theme.name}
                effects={{ effect: theme.effect, components: theme.appliesTo }}
                onSave={({ theme: nextTheme, effects }) =>
                    setTheme({ name: nextTheme, effect: effects.effect, appliesTo: effects.components })
                }
            >
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
