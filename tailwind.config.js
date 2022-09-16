import { defineConfig } from 'vite-plugin-windicss';

export default defineConfig({
    darkMode: false,
    theme: {
        extend: {
            colors: {
                'regal-blue': '#243c5a',
            }
        },
    },
});
