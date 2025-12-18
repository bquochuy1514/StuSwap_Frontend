import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			'localhost',
			'lh3.googleusercontent.com',
			'hero-sticky-charming-coordination.trycloudflare.com',
		], // Add 'localhost' to the allowed domains
	},
};

export default nextConfig;
