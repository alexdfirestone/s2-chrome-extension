import './style.css'
import ReactDOM from 'react-dom/client'
import { defineContentScript } from 'wxt/sandbox'
import { createShadowRootUi } from 'wxt/client'
import { browser } from 'wxt/browser'
import App from './App'

// Add debounce utility function at the top
const debounce = (fn: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

export default defineContentScript({
    matches: ['*://*/*'],
    cssInjectionMode: 'ui',
    async main(ctx) {
        let currentSelection = '';

        // Real-time selection tracking
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            currentSelection = selection?.toString().trim() || '';
        };

        // Debounced processing of selection
        const processSelection = debounce(async () => {
            if (currentSelection) {
                await browser.runtime.sendMessage({
                    type: 'TEXT_SELECTED',
                    data: {
                        text: currentSelection,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        title: document.title
                    }
                });
            }
        }, 300);

        // Listen for selection changes in real-time
        document.addEventListener('selectionchange', () => {
            handleSelectionChange();
            processSelection();
        });

        // Create UI as before
        const ui = await createShadowRootUi(ctx, {
            name: 'language-learning-content-box',
            position: 'inline',
            onMount: (container: any) => {
                console.log(container)
                const root = ReactDOM.createRoot(container)
                root.render(
                    <App />
                )
                return root
            },
            onRemove: (root: any) => {
                root?.unmount()
            },
        })

        ui.mount()
    },
})