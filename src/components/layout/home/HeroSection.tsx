import RedirectLoading from '@/components/shared/PageTransition';
import CompactButton from '@/components/ui/CompactButton';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IoSparkles } from 'react-icons/io5';
import { MdSell, MdShoppingBag } from 'react-icons/md';

export default function HeroSection() {
	const router = useRouter();

	// Animation variants
	const fadeInUp = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	};

	const staggerContainer = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	// Stats data
	const stats = [
		{ number: 'Tiết kiệm đến 70%', label: 'So với mua đồ mới' },
		{
			number: 'Giao dịch an toàn',
			label: 'Xác thực sinh viên qua email trường',
		},
		{ number: 'Miễn phí đăng tin', label: 'Không tốn phí cho người bán' },
		{ number: 'Duyệt tin nhanh', label: 'Phê duyệt trong 24h' },
	];

	return (
		<>
			<section className="relative px-4 overflow-hidden pb-6 md:pb-10">
				<div className="max-w-7xl mx-auto">
					<motion.div
						initial="hidden"
						animate="visible"
						variants={fadeInUp}
						className="text-center max-w-4xl mx-auto"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{
								type: 'spring',
								stiffness: 200,
								damping: 15,
							}}
							className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs md:text-sm font-semibold mb-4 md:mb-6"
						>
							<IoSparkles className="w-3 h-3 md:w-4 md:h-4" />
							Chợ đồ cũ sinh viên #1 Việt Nam
						</motion.div>

						<h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight">
							Mua bán đồ cũ{' '}
							<span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
								thông minh
							</span>
							<br />
							Tiết kiệm cho sinh viên
						</h1>

						<p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
							Nền tảng kết nối sinh viên mua bán, trao đổi đồ cũ.
							Tiết kiệm chi phí, bảo vệ môi trường, xây dựng cộng
							đồng uy tín.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
							<CompactButton
								onClick={() => {
									router.push('/products');
								}}
								variant="primary"
								icon={
									<MdShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
								}
								className="px-6 py-3 md:py-4 "
							>
								Khám phá ngay
							</CompactButton>
							<CompactButton
								onClick={() => {
									router.push('/post');
								}}
								variant="secondary"
								icon={
									<MdSell className="w-4 h-4 md:w-5 md:h-5" />
								}
								className="px-6 py-3 md:py-4 border-2 border-emerald-600"
							>
								Đăng tin bán
							</CompactButton>
						</div>
					</motion.div>
				</div>

				{/* Stats */}
				<motion.div
					initial="hidden"
					animate="visible"
					variants={staggerContainer}
					className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8 md:mt-12"
				>
					{stats.map((stat, index) => (
						<motion.div
							key={index}
							variants={fadeInUp}
							className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 text-center shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
						>
							<div className="text-lg md:text-2xl font-bold text-emerald-600 mb-1 md:mb-2">
								{stat.number}
							</div>
							<div className="text-xs md:text-sm text-gray-600 font-medium">
								{stat.label}
							</div>
						</motion.div>
					))}
				</motion.div>
			</section>
		</>
	);
}
