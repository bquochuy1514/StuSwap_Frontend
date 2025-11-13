import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['localhost'], // Add 'localhost' to the allowed domains
	},
};

export default nextConfig;
