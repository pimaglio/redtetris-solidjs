import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import WindiCSS from 'vite-plugin-windicss';
import devtoolsPlugin from "@solid-devtools/transform"

export default defineConfig({
    plugins: [
        solidPlugin(),
        WindiCSS(),
        devtoolsPlugin({
            // Will automatically add names when creating signals, memos, stores, or mutables
            name: true,
        }),
    ],
    server: {
        port: 3000,
        host: '0.0.0.0',
        fs: {
            strict: true,
        }
    },
    test: {
        environment: 'jsdom',
        globals: true,
        transformMode: {
            web: [/\.[jt]sx?$/],
        },
        setupFiles: './setupVitest.js',
        // if you have few tests, try commenting one
        // or both out to improve performance:
        threads: false,
        isolate: false,
    },
    resolve: {
        conditions: ['development', 'browser'],
    },
    build: {
        target: 'esnext',
    }
});
