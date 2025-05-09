import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	runes: true,
	kit: {
		adapter: adapter(),
		files: {
			assets: 'static', // Ensure assets are included for custom headers
		}
	}
};

export default config;
