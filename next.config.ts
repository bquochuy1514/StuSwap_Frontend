import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8080',
				pathname: '/**',
			},
			{
				protocol: 'http',
				hostname: 'studentswap-backend', // tên service trong docker-compose
				port: '8080',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'studentswap-api.onrender.com',
				pathname: '/**',
			},
		],
	},
};

export default nextConfig;
