import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],

    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/test/setup.ts',

        /*
         * Playwright E2E tests ko Vitest se exclude karo.
         */
        exclude: [
            'node_modules/**',
            'dist/**',
            'e2e/**',
        ],
    },
})