import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// @ts-expect-error -- plain .mjs helper, no declarations needed for a build-time script
import { collectIconUsage } from './scripts/collect-icon-usage.mjs';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const buildNumberPath = resolve(__dirname, '.build-number');

const getCommitHash = (): string => {
    try {
        return execSync('git rev-parse --short HEAD', { cwd: __dirname }).toString().trim();
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

const libBuildNumber = readBuildNumber() + 1;
writeFileSync(buildNumberPath, `${libBuildNumber}\n`);

const libVersionInfo = {
    version: pkg.version,
    buildNumber: libBuildNumber,
    commit: getCommitHash(),
    buildDate: new Date().toISOString(),
};

export default defineConfig({
    define: {
        __LIB_VERSION__: JSON.stringify(libVersionInfo.version),
        __LIB_BUILD_NUMBER__: JSON.stringify(libVersionInfo.buildNumber),
        __LIB_COMMIT__: JSON.stringify(libVersionInfo.commit),
        __LIB_BUILD_DATE__: JSON.stringify(libVersionInfo.buildDate),
    },
    plugins: [
        react(),
        dts({
            tsconfigPath: './tsconfig.json',
            bundleTypes: true,
        }),
        viteStaticCopy({
            targets: [
                { src: 'src/styles/variables.scss', dest: 'styles' },
                { src: 'src/styles/base.scss', dest: 'styles' },
                { src: 'src/styles/effects.scss', dest: 'styles' },
                { src: 'src/styles/highlight.scss', dest: 'styles' },
                { src: 'src/styles/scrollbars.scss', dest: 'styles' },
                { src: 'src/styles/utilities.scss', dest: 'styles' },
                { src: 'src/styles/utility-classes.scss', dest: 'styles' },
            ],
        }),
        {
            // Consumers trim iconMap to what they use, and cannot see the names this
            // library's own components hardcode. Publishing them means a trimmed build
            // keeps the caret, the checkmark and the rest instead of dropping them.
            name: 'memobit-icon-usage-manifest',
            closeBundle() {
                const distDir = resolve(__dirname, 'dist');
                const icons = collectIconUsage(resolve(__dirname, 'src/components'));
                mkdirSync(distDir, { recursive: true });
                writeFileSync(resolve(distDir, 'memobit-icons.json'), `${JSON.stringify({ icons }, null, 2)}
`);
            },
        },
        {
            name: 'memobit-lib-version-metadata',
            closeBundle() {
                const distDir = resolve(__dirname, 'dist');
                mkdirSync(distDir, { recursive: true });
                writeFileSync(resolve(distDir, 'version.json'), `${JSON.stringify(libVersionInfo, null, 2)}\n`);
            },
        },
    ],
    css: {
        preprocessorOptions: {
            scss: {
                silenceDeprecations: ['legacy-js-api'],
            },
        },
    },
    build: {
        lib: {
            // `mfa` is a second entry so the main bundle never references qrcode.react,
            // which MfaSetupModal needs for the enrolment QR and nothing else uses.
            entry: {
                index: resolve(__dirname, 'src/index.ts'),
                mfa: resolve(__dirname, 'src/mfa.ts'),
            },
            formats: ['es'],
            fileName: (_format, entryName) => `${entryName}.esm.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime', '@memobit/icons', '@memobit/icons/map', '@memobit/themes'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
                assetFileNames: assetInfo => {
                    if (assetInfo.names?.[0]?.endsWith('.css')) {
                        return 'index.css';
                    }
                    return assetInfo.names?.[0] ?? '[name][extname]';
                },
            },
        },
        sourcemap: false,
        minify: 'esbuild',
    },
});
