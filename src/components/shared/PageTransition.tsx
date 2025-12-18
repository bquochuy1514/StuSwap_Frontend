// src/components/shared/Loading/RedirectLoading.jsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Logo from '../ui/Logo';

export default function RedirectLoading({ message = 'Đang chuyển hướng...' }) {
	const [tipIndex, setTipIndex] = useState(0);
	const [mounted, setMounted] = useState(false);

	const tips = [
		'💡 Mỗi món đồ cũ là một câu chuyện mới',
		'🌱 Mua đồ cũ - Bảo vệ môi trường',
		'💰 Tiết kiệm chi phí - Sinh viên thông minh',
		'🤝 Kết nối cộng đồng sinh viên',
		'♻️ Tái sử dụng - Giảm lãng phí',
	];

	useEffect(() => {
		setMounted(true);
		// Disable scroll khi loading
		document.body.style.overflow = 'hidden';

		const interval = setInterval(() => {
			setTipIndex((prev) => (prev + 1) % tips.length);
		}, 2500);

		return () => {
			clearInterval(interval);
			document.body.style.overflow = 'unset';
		};
	}, []);

	// Không render gì cho đến khi component đã mount
	if (!mounted) return null;

	const loadingContent = (
		<div className="fixed inset-0 bg-gradient-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] z-[9999] flex items-center justify-center overflow-hidden">
			{/* Overlay tối */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

			{/* Animated background circles - tone xanh lá */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob"></div>
				<div className="absolute top-1/3 right-1/4 w-96 h-96 bg-green-500/20 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
				<div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-lime-500/20 rounded-full mix-blend-overlay filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

				{/* Particles bay nhẹ */}
				<div className="absolute top-20 left-20 w-2 h-2 bg-white/50 rounded-full animate-float"></div>
				<div className="absolute top-40 right-32 w-3 h-3 bg-white/40 rounded-full animate-float-delayed"></div>
				<div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/50 rounded-full animate-float-slow"></div>
			</div>

			{/* Main content */}
			<div className="relative text-center px-4 z-10">
				{/* Logo */}
				<div className="relative inline-block mb-6">
					<div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-30 scale-110"></div>
					<div className="relative animate-pulse-slow">
						<Logo width={200} height={200} canClick={false} />
					</div>
				</div>

				{/* Brand name */}
				<h2 className="text-2xl font-bold mb-4">
					<span className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent">
						StudentSwap
					</span>
				</h2>

				{/* Spinner */}
				<div className="relative inline-block mb-6">
					<div className="relative w-16 h-16 mx-auto">
						<div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
						<div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white border-r-white animate-spin"></div>
						<div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-300 border-l-emerald-300 animate-spin-reverse"></div>
					</div>
				</div>

				{/* Message */}
				<div className="space-y-3">
					<p className="text-white text-xl font-semibold">
						{message}
					</p>
					<div className="flex items-center justify-center gap-1">
						<span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce"></span>
						<span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce animation-delay-200"></span>
						<span className="w-2 h-2 bg-emerald-300 rounded-full animate-bounce animation-delay-400"></span>
					</div>
				</div>

				{/* Rotating tips */}
				<div className="mt-8 h-6">
					<p className="text-emerald-200/90 text-sm font-medium animate-fade-in">
						{tips[tipIndex]}
					</p>
				</div>

				{/* Bottom tagline */}
				<div className="mt-6 flex items-center justify-center gap-2 text-white/70 text-xs">
					<span>🎓 Chợ đồ cũ sinh viên</span>
					<span>•</span>
					<span>0 đồng vốn</span>
					<span>•</span>
					<span>100% uy tín</span>
				</div>

				{/* Quote */}
				<p className="mt-4 text-emerald-300/60 italic text-xs">
					Tiết kiệm hôm nay, Tương lai xanh ngày mai
				</p>
			</div>
		</div>
	);

	// Render vào document.body thay vì trong component tree
	return createPortal(loadingContent, document.body);
}
