import { defineConfig } from 'vite';

export default defineConfig({
    base: '/Ocean-current-simulator/',
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'three': ['three']
                }
            }
        }
    }
});
