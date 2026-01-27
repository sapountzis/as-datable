import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Enable React Compiler (React 19) for automatic memoization
	reactCompiler: true,

	// Disable the "X-Powered-By: Next.js" header for security and cleanliness
	poweredByHeader: false,

	// Enable Gzip/Brotli compression (default is true, making explicit)
	compress: true,

	// Optimize logs for development
	logging: {
		fetches: {
			fullUrl: true,
		},
	},

	// Cloudflare Workers Image Handling:
	// Since we are not using the paid Cloudflare Images service via bindings yet,
	// we use 'unoptimized: true' to serve headers/images as-is (WebP).
	// This prevents 500 errors on image optimization requests.
	images: {
		unoptimized: true,
	},

	// Best practice security headers
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
