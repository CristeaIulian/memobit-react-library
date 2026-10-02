import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, relative, resolve, sep } from 'path';

interface ChunkLike {
    type: string;
    fileName: string;
    code?: string;
    viteMetadata?: { importedCss?: Set<string> };
}
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
            // Vite's lib mode extracts each component's SCSS into its own file and replaces
            // the import with an `/* empty css */` comment, orphaning the stylesheet. That
            // breaks CSS tree-shaking: dropping a component leaves its CSS behind, because
            // nothing references it. Re-attaching the import puts the stylesheet back on the
            // JS dependency graph, so a component an app never uses takes its CSS with it.
            //
            // chunk.viteMetadata.importedCss is Vite's own record of which stylesheets a
            // chunk pulled in, so the mapping is exact rather than guessed from filenames.
            name: 'memobit-reattach-component-css',
            enforce: 'post' as const,
            generateBundle(_options: unknown, bundle: Record<string, ChunkLike>) {
                let reattached = 0;

                for (const chunk of Object.values(bundle)) {
                    const importedCss = chunk.viteMetadata?.importedCss;

                    if (chunk.type !== 'chunk' || chunk.code === undefined || !importedCss || importedCss.size === 0) {
                        continue;
                    }

                    const fromDir = dirname(chunk.fileName);
                    const statements = [...importedCss]
                        .map(cssFile => {
                            const relativePath = relative(fromDir, cssFile).split(sep).join('/');

                            return `import '${relativePath.startsWith('.') ? relativePath : './' + relativePath}';`;
                        })
                        .join('\n');

                    chunk.code = statements + '\n' + chunk.code;
                    reattached += importedCss.size;
                }

                console.log('[memobit] re-attached ' + reattached + ' component stylesheets to their modules');
            },
        },
        {
            // Consumers trim iconMap to what they use, and cannot see the names this
            // library's own components hardcode. Publishing them means a trimmed build
            // keeps the caret, the checkmark and the rest instead of dropping them.
            name: 'memobit-icon-usage-manifest',
            closeBundle() {
                const distDir = resolve(__dirname, 'dist');
                // Validated against the real icon list, so a broad sweep of quoted
                // strings cannot invent names that do not exist.
                const iconModulesSource = readFileSync(
                    resolve(__dirname, 'node_modules/@memobit/icons/dist/iconModules.js'),
                    'utf-8',
                );
                const validNames = new Set([...iconModulesSource.matchAll(/"([^"]+)":\s*"/g)].map(match => match[1]));
                const icons = collectIconUsage(resolve(__dirname, 'src/components'), validNames);
                mkdirSync(distDir, { recursive: true });
                writeFileSync(resolve(distDir, 'memobit-icons.json'), `${JSON.stringify({ icons }, null, 2)}
`);
            },
        },
        {
            // Back-compatibility shims, so splitting the stylesheet stays a minor release.
            //
            // Component CSS now rides the JS graph, which means dist/index.css no longer
            // exists and the entry is dist/index.js. Apps still carrying
            // `import '@memobit/libs/dist/index.css'` would 404 on it, and anything pinned
            // to dist/index.esm.js would break. An empty stylesheet resolves the first
            // harmlessly — the styles arrive through the components themselves — and a
            // re-export covers the second. Both can go in the next major.
            name: 'memobit-legacy-entry-shims',
            closeBundle() {
                const distDir = resolve(__dirname, 'dist');
                mkdirSync(distDir, { recursive: true });
                writeFileSync(
                    resolve(distDir, 'index.css'),
                    '/* Intentionally empty. Component styles are imported by the components themselves, so only what an app uses is bundled. Kept so existing imports of this path keep resolving. */\n',
                );
                writeFileSync(resolve(distDir, 'index.esm.js'), "export * from './index.js';\n");
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
                preserveModules: true,
                preserveModulesRoot: 'src',
                entryFileNames: '[name].js',
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
                assetFileNames: assetInfo => {
                    // Mirror each stylesheet next to the component it belongs to, so the
                    // re-attached imports point somewhere meaningful and the published
                    // package stays inspectable. Collapsing them all onto index.css is what
                    // left the earlier build emitting index52.css and friends.
                    const source = assetInfo.originalFileNames?.[0];

                    if (source !== undefined && /[.]s?css$/.test(source)) {
                        return source.replace(/^src[/]/, '').replace(/[.]s?css$/, '.css');
                    }

                    if (assetInfo.names?.[0]?.endsWith('.css')) {
                        return 'index.css';
                    }

                    return assetInfo.names?.[0] ?? '[name][extname]';
                },
            },
        },
        cssCodeSplit: true,
        sourcemap: false,
        minify: 'esbuild',
    },
});
