import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const libraryRoot = resolve(__dirname, '..');
const iconsDir = resolve(libraryRoot, 'src/icons');

// The IconsPage auto-discovers icons via import.meta.glob('../src/icons/**/*.tsx').
// That directory sits outside the playground root, so Vite's watcher doesn't see
// brand-new files there and the glob won't re-scan until a restart. Adding the dir
// to the watcher makes added/removed icons show up live, no restart needed.
const watchLibraryIcons = (): Plugin => ({
    name: 'watch-library-icons',
    configureServer(server) {
        server.watcher.add(iconsDir);
    },
});
const pkg = JSON.parse(readFileSync(resolve(libraryRoot, 'package.json'), 'utf-8'));
const buildNumberPath = resolve(libraryRoot, '.build-number');

const getCommitHash = (): string => {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: libraryRoot }).toString().trim();
    } catch {
        return 'unknown';
    }
};

const readBuildNumber = (): number => {
    try {
        const value = Number(readFileSync(buildNumberPath, 'utf-8').trim());
        return Number.isFinite(value) ? value : 0;
    } catch {
        return 0;
    }
};

export default defineConfig({
    define: {
        __LIB_VERSION__: JSON.stringify(pkg.version),
        __LIB_BUILD_NUMBER__: JSON.stringify(readBuildNumber()),
        __LIB_COMMIT__: JSON.stringify(getCommitHash()),
        __LIB_BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
    plugins: [react(), watchLibraryIcons()],
    server: {
        port: 3016,
        strictPort: true,
    },
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },
});
