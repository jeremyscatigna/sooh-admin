import { defineConfig } from 'vite';
import postcss from './postcss.config.js';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        'process.env': process.env,
    },
    css: {
        postcss,
    },
    plugins: [
        react(),
        eslintPlugin({
            cache: false,
            include: ['./src/**/*.js', './src/**/*.jsx'],
            exclude: [],
        }),
    ],
    resolve: {
        alias: [
            {
                find: /^~.+/,
                replacement: (val) => {
                    return val.replace(/^~/, '');
                },
            },
        ],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
});
