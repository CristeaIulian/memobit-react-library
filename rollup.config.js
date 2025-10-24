import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import terser from '@rollup/plugin-terser'; // Changed this line - no curly braces
import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'cjs',
            sourcemap: true
        },
        {
            file: 'dist/index.esm.js',
            format: 'esm',
            sourcemap: true
        }
    ],
    plugins: [
        peerDepsExternal(),
        resolve({
            browser: true
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json'
        }),
        postcss({
            extract: true,
            minimize: true
        }),
        copy({
            targets: [
                { src: 'src/styles/theming.scss', dest: 'dist/styles' }
            ]
        }),
        terser()
    ],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
};
