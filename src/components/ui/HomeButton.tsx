'use client';

import { HomeIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeButton() {
	const router = useRouter();

	return (
		<button
			onClick={() => router.push('/')}
			className="fixed top-6 left-6 z-50 group"
			aria-label="Về trang chủ"
		>
			<div className="relative">
				{/* Gradient nền blur */}
				<div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

				{/* Button chính */}
				<div className="relative cursor-pointer bg-gray-900/90 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-3 md:px-4 md:py-2.5 transition-all duration-300 group-hover:scale-105 group-hover:border-teal-400/50 group-hover:shadow-lg group-hover:shadow-teal-500/50 flex items-center gap-2">
					<HomeIcon className="text-xl text-emerald-400 group-hover:text-teal-400 transition-colors duration-300" />
					<span className="hidden md:inline-block text-sm font-semibold text-gray-300 group-hover:text-white transition-colors duration-300">
						Trang chủ
					</span>
				</div>
			</div>
		</button>
	);
}
