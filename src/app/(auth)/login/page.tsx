// src/app/(auth)/login/page.tsx

import LoginBanner from '@/components/auth/login/LoginBanner';
import LoginPage from '@/components/auth/login/LoginPage';

export const metadata = {
	title: 'Đăng nhập - StudentSwap',
	description: 'Đăng nhập vào tài khoản StuSwap của bạn',
};

export default function Login() {
	return (
		<main className="flex flex-col lg:flex-row h-screen overflow-hidden">
			{/* Section LoginForm - Tone sáng, tươi mới */}
			<section className="relative w-full lg:w-1/2 h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/40">
				{/* Gradient orbs tone xanh lá nhẹ nhàng */}
				<div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400/8 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-400/6 rounded-full blur-3xl"></div>

				<div className="relative min-h-screen p-8 flex items-center justify-center">
					<LoginPage />
				</div>
			</section>

			{/* Section LoginBanner - Tone tối, đậm */}
			<section className="hidden lg:block lg:w-1/2 bg-gradient-to-bl from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] h-screen overflow-hidden relative">
				<div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20">
					<LoginBanner />
				</div>
			</section>
		</main>
	);
}
