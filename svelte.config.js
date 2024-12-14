import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		// Static headers won't work directly in vite.server for production;
		// Configure caching at the deployment level (e.g., Cloudflare headers).
		vite: {
			build: {
				rollupOptions: {
					output: {
						manualChunks: undefined, // Adjust chunking if needed
					}
				}
			}
		},
		files: {
			assets: 'static' // Ensure assets are included for custom headers.
		},
		headers: () => [
			{
				key: 'Cache-Control',
				value: 'public, max-age=31536000, immutable',
				for: '/static/*' // Cloudflare respects specific paths for headers.
			},
			{
				key: 'Cache-Control',
				value: 'no-cache',
				for: '/*.html'
			}
		]
	}
};

export default config;
