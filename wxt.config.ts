import {defineConfig} from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["activeTab", "sidePanel", "storage"],
        action: {},
        name: 'AdviserGPT - Browser Extension',
        description: 'A browser plugin to help asset managers accelerate customer acquisition and growth.',
    },
    vite: () => ({
        plugins: [react()],
    }),
});
