import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: undefined, // Adjust chunking if needed
			}
		},
		target: 'es2017', // Modern browsers
	},
	server: {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable', // Dev server headers (for testing)
		}
	}
});
