import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 text-center px-4">
			{/* Icon đồ cũ - có thể thay bằng icon khác */}
			<div className="mb-6 relative">
				<div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
					<svg
						className="w-16 h-16 text-emerald-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
				<div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
					?
				</div>
			</div>

			{/* Số 404 */}
			<h1 className="text-7xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 mb-4 tracking-tight">
				404
			</h1>

			{/* Tiêu đề phụ */}
			<h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
				Ối, có vẻ bạn đang lạc chợ rồi 😅
			</h2>

			{/* Mô tả */}
			<p className="text-base md:text-lg text-gray-600 mb-8 max-w-md leading-relaxed">
				Trang bạn tìm hình như đã bị chuyển đi, hoặc món đồ sinh viên
				bạn muốn xem đã được “chốt đơn” mất tiêu rồi. Đừng lo, còn nhiều
				món hay ho khác đang chờ bạn đó!
			</p>

			{/* Buttons */}
			<div className="flex flex-col sm:flex-row gap-4">
				<Link
					href="/"
					className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
				>
					🏠 Về trang chủ
				</Link>
				<Link
					href="/products"
					className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
				>
					🛍️ Khám phá đồ cũ khác
				</Link>
			</div>

			{/* Decoration elements */}
			<div className="mt-12 flex gap-3 opacity-40">
				<span className="text-3xl animate-pulse">📚</span>
				<span className="text-3xl animate-pulse delay-100">👕</span>
				<span className="text-3xl animate-pulse delay-200">💻</span>
				<span className="text-3xl animate-pulse delay-300">🎒</span>
			</div>
		</div>
	);
}
