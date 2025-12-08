import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: [],
            },
        }),
    ],
    optimizeDeps: {
        include: ['chart.js', 'chartjs-adapter-date-fns'],
        exclude: [],
    },
});
