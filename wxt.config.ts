import {defineConfig} from 'wxt';
import react from '@vitejs/plugin-react';

// See https://wxt.dev/api/config.html
export default defineConfig({
    manifest: {
        permissions: ["activeTab", "scripting", "sidePanel", "storage", "tabs"],
        action: {},
        name: 'AdviserGPT - Browser Extension',
        description: 'A browser plugin to help asset managers accelerate customer acquisition and growth.',
        default_locale: "en"
    },
    vite: () => ({
        plugins: [react()],
    }),
});
