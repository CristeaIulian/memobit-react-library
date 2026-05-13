import { readFileSync } from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));

export default defineConfig({
    define: {
        __LIB_VERSION__: JSON.stringify(pkg.version),
    },
    plugins: [
        react(),
        dts({
            tsconfigPath: './tsconfig.json',
            rollupTypes: true,
        }),
        viteStaticCopy({
            targets: [
                { src: 'src/styles/variables.scss', dest: 'styles' },
                { src: 'src/styles/effects.scss', dest: 'styles' },
                { src: 'src/styles/highlight.scss', dest: 'styles' },
                { src: 'src/styles/utilities.scss', dest: 'styles' },
                { src: 'src/styles/themes.scss', dest: 'styles' },
                { src: 'src/styles/theming/amber-meridian.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/archive-indigo.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/arctic-blue.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/asphalt-code.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/azure-night.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/blueprint-clay.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/blush-market.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/brass-chronicle.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/carbon-velocity.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/chalk-circuit.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/clinical-aqua.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/cobalt-pulse.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/crawler-dusk.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/crimson-dusk.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/cyber-forest.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/dashdarkx.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ember-night.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/emerald-ledger.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/frost-petal.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/garden-harvest.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/gilded-bear.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/graphite-shell.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/horizon-amber.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/horizon-drift.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ivory-serif.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/lavender-mist.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/light-blue.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/luna.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/mesh-circuit.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/midnight-amber.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/mint-meadow.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/mintone.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/neon-tokyo.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ocean-breeze.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ocean-depths.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/sandstone.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/sandy-parchment.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/signal-burst.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/slate-focus.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/spectrum-vault.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/tailwind-vue-dark.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/terminal-phosphor.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/terracotta-kitchen.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/twilight-pulse.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/vault-guard.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/velvet-reel.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/velvet-tome.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/vital-signal.scss', dest: 'styles/theming' },
            ],
        }),
    ],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'cjs'],
            fileName: format => (format === 'es' ? 'index.esm.js' : 'index.js'),
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'react/jsx-runtime'],
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
        sourcemap: true,
        minify: 'terser',
    },
});
