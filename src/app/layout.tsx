import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastContainer } from 'react-toastify';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'StudentSwap - Chợ đồ cũ sinh viên',
	icons: {
		icon: '/favicon_icon.png',
	},
	description:
		'Nền tảng mua bán, trao đổi đồ cũ dành riêng cho sinh viên. Tiết kiệm chi phí, bảo vệ môi trường, kết nối cộng đồng sinh viên uy tín trên toàn quốc.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<AuthProvider>{children}</AuthProvider>

				<ToastContainer
					position="top-right"
					autoClose={4000}
					newestOnTop={true}
					closeOnClick={true}
					theme="light"
				/>
			</body>
		</html>
	);
}
