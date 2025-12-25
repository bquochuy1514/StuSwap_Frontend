import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			'localhost',
			'lh3.googleusercontent.com',
			'studentswap-api.onrender.com',
		], // Add 'localhost' to the allowed domains
	},
};

export default nextConfig;
