import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const libraryRoot = resolve(__dirname, '..');
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
    plugins: [react()],
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
