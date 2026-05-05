import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'standalone',
	eslint: {
		ignoreDuringBuilds: true,
	},
	images: {
		domains: [
			'localhost',
			'lh3.googleusercontent.com',
			'studentswap-api.onrender.com',
		],
	},
};

export default nextConfig;
