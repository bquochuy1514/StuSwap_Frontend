import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: ['localhost', 'lh3.googleusercontent.com'], // Add 'localhost' to the allowed domains
	},
};

export default nextConfig;
