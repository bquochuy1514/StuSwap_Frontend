import RegisterBanner from '@/components/auth/register/RegisterBanner';
import RegisterPage from '@/components/auth/register/RegisterPage';

export const metadata = {
	title: 'Đăng ký - StudentSwap',
	description: 'Tạo tài khoản mới tại StuSwap',
};

export default function Register() {
	return (
		<main className="flex flex-col lg:flex-row h-screen overflow-hidden">
			{/* Section RegisterBanner - Tone tối, đậm (bên trái) */}
			<section className="hidden lg:block lg:w-1/2 bg-gradient-to-bl from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] h-screen overflow-hidden relative">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
				<RegisterBanner />
			</section>

			{/* Section RegisterForm - Tone sáng, tươi mới (bên phải) */}
			<section className="relative w-full lg:w-1/2 h-screen overflow-y-auto bg-gradient-to-bl from-slate-50 via-emerald-50/30 to-teal-50/40">
				{/* Gradient orbs tone xanh lá nhẹ nhàng */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/8 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
				<div className="absolute top-1/2 left-0 w-72 h-72 bg-cyan-400/6 rounded-full blur-3xl"></div>

				<div className="relative min-h-screen p-8 flex items-center justify-center">
					<RegisterPage />
				</div>
			</section>
		</main>
	);
}
