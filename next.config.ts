import type { NextConfig } from "next";

const securityHeaders = [
	{ key: "X-DNS-Prefetch-Control",    value: "on" },
	{ key: "X-Frame-Options",           value: "SAMEORIGIN" },
	{ key: "X-Content-Type-Options",    value: "nosniff" },
	{ key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
	{ key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
	{
		key:   "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains; preload",
	},
];

const nextConfig: NextConfig = {
	// Remove X-Powered-By header (hides tech stack from attackers)
	poweredByHeader: false,

	// Security headers on all routes
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: securityHeaders,
			},
		];
	},

	// Image optimization
	images: {
		formats: ["image/avif", "image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
	},

	// Compress responses
	compress: true,
};

export default nextConfig;
