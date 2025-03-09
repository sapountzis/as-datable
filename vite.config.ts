import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					// Separate vendor code from application code
					if (id.includes('node_modules')) {
					  return 'vendor';
					}
				}
			}
		},
		target: 'es2017', // Modern browsers
		minify: 'terser',
		terserOptions: {
		  compress: {
			drop_console: true
		  },
		  format: {
			comments: false
		  }
		}
	},
	server: {
		headers: {
			'Cache-Control': 'public, max-age=31536000, immutable', // Dev server headers (for testing)
		}
	}
});
