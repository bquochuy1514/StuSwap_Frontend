'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
	icon: React.ReactElement;
	title: string;
	description?: string;
	gradient?: string;
}

export default function PageHeader({
	icon,
	title,
	description,
	gradient = 'from-emerald-500 to-teal-600',
}: PageHeaderProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="relative mb-6 overflow-hidden rounded-2xl"
		>
			{/* Animated Background */}
			<div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50">
				<div className="absolute inset-0 bg-grid-pattern opacity-5" />
				{/* Floating orbs - smaller */}
				<motion.div
					animate={{
						scale: [1, 1.2, 1],
						x: [0, 30, 0],
						y: [0, 20, 0],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className="absolute top-5 left-5 w-20 h-20 bg-emerald-200 rounded-full blur-2xl opacity-30"
				/>
				<motion.div
					animate={{
						scale: [1, 1.3, 1],
						x: [0, -30, 0],
						y: [0, -30, 0],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className="absolute bottom-5 right-5 w-24 h-24 bg-teal-200 rounded-full blur-2xl opacity-30"
				/>
			</div>

			{/* Content */}
			<div className="relative px-5 py-5 md:px-6 md:py-6">
				<div className="flex flex-col md:flex-row items-center gap-4">
					{/* Icon with enhanced effects */}
					<motion.div
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							delay: 0.1,
							type: 'spring',
							stiffness: 200,
						}}
						className="relative group"
					>
						{/* Outer glow */}
						<div
							className={`absolute -inset-3 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500`}
						/>
						{/* Icon container */}
						<div
							className={`relative flex items-center justify-center w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl shadow-xl flex-shrink-0`}
						>
							{/* Inner shine */}
							<div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl" />
							{/* Icon - không dùng cloneElement */}
							<div className="relative z-10 flex items-center justify-center text-white w-7 h-7 scale-200">
								{icon}
							</div>
						</div>
						{/* Pulse ring */}
						<motion.div
							animate={{
								scale: [1, 1.3, 1],
								opacity: [0.5, 0, 0.5],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								ease: 'easeInOut',
							}}
							className={`absolute inset-0 border-2 rounded-xl`}
							style={{
								borderColor: '#10b981',
							}}
						/>
					</motion.div>

					{/* Text Content */}
					<div className="flex-1 text-center md:text-left">
						<motion.h1
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
							className="text-xl md:text-2xl font-bold"
							style={{
								background:
									'linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%)',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								paddingBottom: '0.1em',
							}}
						>
							{title}
						</motion.h1>
						{description && (
							<motion.p
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								className="text-md text-gray-600 max-w-xl mx-auto md:mx-0"
							>
								{description}
							</motion.p>
						)}
					</div>
				</div>
			</div>

			{/* Bottom accent bar with shimmer effect */}
			<div className="relative h-0.5 overflow-hidden">
				<motion.div
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					className={`h-full bg-gradient-to-r ${gradient} origin-left`}
				/>
				<motion.div
					animate={{
						x: ['-100%', '200%'],
					}}
					transition={{
						duration: 2,
						repeat: Infinity,
						ease: 'linear',
					}}
					className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent opacity-40"
				/>
			</div>

			<style jsx>{`
				.bg-grid-pattern {
					background-image: linear-gradient(
							to right,
							rgba(0, 0, 0, 0.03) 1px,
							transparent 1px
						),
						linear-gradient(
							to bottom,
							rgba(0, 0, 0, 0.03) 1px,
							transparent 1px
						);
					background-size: 20px 20px;
				}
			`}</style>
		</motion.div>
	);
}
