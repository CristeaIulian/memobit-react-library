import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
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
                { src: 'src/styles/theming/arctic-blue.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/azure-night.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/crimson-dusk.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/cyber-forest.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/dashdarkx.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ember-night.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/frost-petal.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/lavender-mist.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/light-blue.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/luna.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/mint-meadow.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/mintone.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/neon-tokyo.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ocean-breeze.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/ocean-depths.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/sandstone.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/sandy-parchment.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/tailwind-vue-dark.scss', dest: 'styles/theming' },
                { src: 'src/styles/theming/twilight-pulse.scss', dest: 'styles/theming' },
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
