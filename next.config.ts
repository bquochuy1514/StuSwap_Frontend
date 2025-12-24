import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		domains: [
			'localhost',
			'lh3.googleusercontent.com',
			'click-techno-intended-preston.trycloudflare.com',
		], // Add 'localhost' to the allowed domains
	},
};

export default nextConfig;
