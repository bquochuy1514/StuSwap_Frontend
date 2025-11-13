'use client';

import { motion, Variants } from 'framer-motion';
import Logo from '@/components/ui/Logo';
import { MdSell, MdShoppingBag, MdGroups } from 'react-icons/md';

const icons = [
	{
		icon: <MdSell className="text-white text-lg" />,
		color: 'from-emerald-400 to-emerald-600',
		title: 'Đăng bán miễn phí',
		desc: 'Đăng tin rao bán đồ cũ dễ dàng, không mất phí',
	},
	{
		icon: <MdShoppingBag className="text-white text-lg" />,
		color: 'from-blue-400 to-blue-600',
		title: 'Mua sắm tiết kiệm',
		desc: 'Tìm kiếm đồ cũ chất lượng với giá sinh viên, từ sách vở đến đồ dùng ký túc xá',
	},
	{
		icon: <MdGroups className="text-white text-lg" />,
		color: 'from-amber-400 to-amber-600',
		title: 'Cộng đồng uy tín',
		desc: 'Kết nối với cộng đồng sinh viên tin cậy, giao dịch an toàn và minh bạch',
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const itemVariants: Variants = {
	hidden: { opacity: 0, x: -30 },
	visible: {
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.6,
			ease: 'easeOut',
		},
	},
};

const cardVariants: Variants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: 'easeOut',
		},
	},
};

export default function RegisterBanner() {
	return (
		<div className="relative h-full w-full flex items-center justify-center p-6 lg:p-12 overflow-hidden bg-gradient-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f]">
			{/* Overlay tối để nổi bật nội dung */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

			{/* Nội dung chính */}
			<motion.div
				className="max-w-lg z-10 text-center lg:text-left"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* Logo */}
				<motion.div
					className="mb-8 lg:justify-start"
					initial={{ scale: 0, rotate: -180 }}
					animate={{ scale: 1, rotate: 0 }}
					transition={{
						type: 'spring',
						stiffness: 200,
						damping: 15,
						duration: 0.8,
					}}
				>
					<Logo width={250} height={180} canClick={false} />
				</motion.div>

				{/* Heading */}
				<motion.div variants={itemVariants}>
					<h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5">
						<motion.span
							className="block mb-2 text-white/80 text-xl font-light"
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.6 }}
						>
							Tham gia ngay
						</motion.span>
						<motion.span
							className="bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent"
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.7, duration: 0.6 }}
						>
							StudentSwap
						</motion.span>
					</h2>
				</motion.div>

				<motion.p
					className="text-base text-white/80 mb-8 leading-relaxed"
					variants={itemVariants}
				>
					Tạo tài khoản để bắt đầu mua bán đồ cũ thông minh, tiết kiệm
					chi phí sinh hoạt và kết nối với hàng nghìn sinh viên khắp
					cả nước.
				</motion.p>

				{/* Feature cards */}
				<motion.ul className="space-y-4" variants={containerVariants}>
					{icons.map((item, i) => (
						<motion.li
							key={i}
							variants={cardVariants}
							whileHover={{
								scale: 1.03,
								x: 10,
								transition: { duration: 0.2 },
							}}
							className="group flex items-start gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
						>
							<motion.div
								className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center shadow-lg shadow-black/20`}
								whileHover={{
									scale: 1.1,
									rotate: 5,
									transition: { duration: 0.2 },
								}}
							>
								{item.icon}
							</motion.div>
							<div>
								<h3 className="text-white font-semibold text-base mb-1">
									{item.title}
								</h3>
								<p className="text-white/70 text-sm leading-relaxed">
									{item.desc}
								</p>
							</div>
						</motion.li>
					))}
				</motion.ul>

				{/* Bottom quote */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1.2, duration: 1 }}
					className="pt-6"
				>
					<p className="text-emerald-300/60 italic text-sm">
						Tiết kiệm hôm nay, Tương lai xanh ngày mai
					</p>
				</motion.div>
			</motion.div>

			{/* Hiệu ứng nền */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				{/* Orbs sáng nhẹ - tone xanh lá */}
				<motion.div
					className="absolute -top-32 -right-32 w-[26rem] h-[26rem] rounded-full bg-gradient-to-br from-emerald-500/30 to-green-500/30 blur-[100px]"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className="absolute top-1/2 -left-20 w-[18rem] h-[18rem] rounded-full bg-gradient-to-br from-blue-500/20 to-teal-500/20 blur-[100px]"
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 1,
					}}
				/>
				<motion.div
					className="absolute -bottom-20 right-1/4 w-[23rem] h-[23rem] rounded-full bg-gradient-to-br from-lime-500/20 to-emerald-500/20 blur-[100px]"
					animate={{
						scale: [1, 1.25, 1],
						opacity: [0.2, 0.45, 0.2],
					}}
					transition={{
						duration: 9,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 2,
					}}
				/>

				{/* Particles bay nhẹ */}
				<motion.div
					className="absolute top-20 left-20 w-2 h-2 bg-white/50 rounded-full"
					animate={{
						y: [-10, 10, -10],
						x: [-5, 5, -5],
						opacity: [0.3, 0.8, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
				/>
				<motion.div
					className="absolute top-40 right-32 w-3 h-3 bg-white/40 rounded-full"
					animate={{
						y: [-15, 15, -15],
						x: [5, -5, 5],
						opacity: [0.2, 0.7, 0.2],
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 0.5,
					}}
				/>
				<motion.div
					className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/50 rounded-full"
					animate={{
						y: [10, -10, 10],
						x: [-8, 8, -8],
						opacity: [0.3, 0.8, 0.3],
					}}
					transition={{
						duration: 4.5,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 1,
					}}
				/>
			</div>
		</div>
	);
}
