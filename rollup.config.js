import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser'; // Changed this line - no curly braces
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import * as sass from 'sass';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true,
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true,
        },
    ],
    plugins: [
        peerDepsExternal(),
        resolve({
            browser: true,
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
        }),
        postcss({
            extract: true,
            minimize: true,
            use: {
                sass: {
                    silenceDeprecations: ['legacy-js-api'],
                    implementation: sass,
                },
                stylus: false,
                less: false,
            },
        }),
        copy({
            targets: [
                { src: 'src/styles/variables.scss', dest: 'dist/styles' },
                { src: 'src/styles/effects.scss', dest: 'dist/styles' },
                { src: 'src/styles/theming/light-blue.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/luna.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/mintone.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/argon-dark.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/argon-light.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/crmi.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/dashdarkx.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/tailwind-vue-dark.scss', dest: 'dist/styles/theming' },
                { src: 'src/styles/theming/tailwind-vue-light.scss', dest: 'dist/styles/theming' },
            ],
        }),
        terser(),
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
};
