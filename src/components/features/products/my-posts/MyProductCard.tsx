// components/ui/MyProductCard.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
	FiEdit2,
	FiEye,
	FiClock,
	FiAlertCircle,
	FiMapPin,
	FiImage,
	FiEyeOff,
	FiRefreshCw,
	FiTrendingUp,
	FiCalendar,
	FiTag,
} from 'react-icons/fi';
import { Product } from '@/types/product';
import CompactButton from '@/components/ui/CompactButton';

interface MyProductCardProps {
	product: Product;
	onView?: (product: Product) => void;
	onEdit?: (product: Product) => void;
	onHide?: (product: Product) => void;
	onUnhide?: (product: Product) => void;
	onRenew?: (product: Product) => void;
	onBoost?: (product: Product) => void;
}

export default function MyProductCard({
	product,
	onView,
	onEdit,
	onHide,
	onUnhide,
	onRenew,
	onBoost,
}: MyProductCardProps) {
	const formatPrice = (price: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(parseFloat(price));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const formatDateTime = (value?: string | Date | null): string => {
		if (!value) return '—';

		const date = value instanceof Date ? value : new Date(value);

		if (isNaN(date.getTime())) return '—';

		return date.toLocaleString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	const getImageUrls = (imageUrlsString: string): string[] => {
		try {
			return JSON.parse(imageUrlsString);
		} catch {
			return [];
		}
	};

	const images = getImageUrls(product.image_urls);
	const isHidden = product.deleted_at !== null;
	const isRejected = product.status === 'rejected';
	const isExpired = product.is_expired;
	const isPending = product.status === 'pending';
	const isBoosted = product.promotion_type !== 'none'; // Đã được đẩy tin

	// POST_TYPES config giống page.jsx
	const POST_TYPES = {
		priority: {
			label: 'TIN ƯU TIÊN',
			badge: '👑',
			bgGradient:
				'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500',
			borderColor: 'border-purple-400',
			shadowColor: 'shadow-purple-200',
			glowColor: 'shadow-purple-400/50',
			ribbonBg: 'bg-gradient-to-br from-purple-600 to-pink-600',
			textGradient:
				'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500',
			ringColor: 'ring-purple-400',
			glowColors: [
				'rgba(168, 85, 247, 0.2)',
				'rgba(236, 72, 153, 0.2)',
				'rgba(244, 63, 94, 0.2)',
			],
		},
		boost: {
			label: 'TIN ĐẨY',
			badge: '🚀',
			bgGradient:
				'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
			borderColor: 'border-blue-400',
			shadowColor: 'shadow-blue-200',
			glowColor: 'shadow-blue-400/50',
			ribbonBg: 'bg-gradient-to-br from-blue-600 to-cyan-600',
			textGradient:
				'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500',
			ringColor: 'ring-blue-400',
			glowColors: [
				'rgba(59, 130, 246, 0.15)',
				'rgba(6, 182, 212, 0.15)',
				'rgba(20, 184, 166, 0.15)',
			],
		},
		normal: {
			label: 'TIN THƯỜNG',
			badge: null,
			bgGradient: null,
			borderColor: 'border-gray-200',
			shadowColor: '',
			glowColor: '',
			ribbonBg: null,
			textGradient: '',
			ringColor: '',
			glowColors: [],
		},
	};

	// Xác định post type
	const getPostType = () => {
		if (
			product.promotion_type === 'priority' &&
			product.priority_level === 2
		) {
			return POST_TYPES.priority;
		}
		if (
			product.promotion_type === 'boost' &&
			product.priority_level === 1
		) {
			return POST_TYPES.boost;
		}
		return POST_TYPES.normal;
	};

	const postType = getPostType();
	const isPromoted = postType.label !== 'TIN THƯỜNG';

	// Xác định style cho card
	const getCardClasses = () => {
		// Tin bị từ chối - màu đỏ nhạt
		if (isRejected) {
			return 'bg-gradient-to-br from-red-50 via-red-50 to-red-100 border-2 border-red-300 shadow-sm opacity-90';
		}
		// Tin hết hạn - màu xám
		if (isExpired) {
			return 'bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 border-2 border-gray-300 shadow-sm opacity-80';
		}
		// Tin đang chờ duyệt - màu vàng nhạt
		if (isPending) {
			return 'bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 border-2 border-yellow-300 shadow-sm';
		}
		// Tin được đẩy
		if (isPromoted) {
			return `bg-white border-2 ${postType.borderColor} hover:${postType.glowColor} hover:shadow-xl ${postType.shadowColor} shadow-lg`;
		}
		// Tin thường
		return 'bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 hover:border-emerald-300 hover:shadow-md';
	};

	// Logic kiểm tra các nút có thể bấm
	const canClickView = !isRejected && !isExpired && !isPending && !isHidden;
	const canClickEdit = true; // Luôn cho phép sửa (trừ khi bị từ chối hoặc hết hạn sẽ xử lý riêng)
	const canClickHide = !isRejected && !isExpired && !isPending;
	const canClickRenew = !isRejected && !isPending;
	const canClickBoost = !isRejected && !isExpired && !isPending && !isBoosted;

	// Tin chờ duyệt: chỉ cho sửa
	// Tin bị từ chối: không cho làm gì
	// Tin hết hạn: chỉ cho gia hạn
	// Tin đã đẩy: không cho đẩy nữa

	return (
		<motion.div
			layout
			className={`rounded-xl transition-all duration-300 overflow-hidden relative ${getCardClasses()}`}
			whileHover={{ y: -2 }}
			transition={{ duration: 0.2 }}
		>
			{/* Ribbon Badge - Góc trái - Ẩn khi bị từ chối hoặc hết hạn */}
			{isPromoted && !isRejected && !isExpired && (
				<div className="absolute top-0 left-0 z-10">
					<div
						className={`${postType.ribbonBg} text-white pl-3 pr-4 sm:pl-4 sm:pr-5 py-1 sm:py-1.5 text-[9px] sm:text-xs font-bold tracking-wider shadow-lg flex items-center gap-1 sm:gap-1.5`}
						style={{
							clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
							minWidth: '110px',
						}}
					>
						<span className="text-xs sm:text-base flex-shrink-0">
							{postType.badge}
						</span>
						<span className="whitespace-nowrap">
							{postType.label}
						</span>
					</div>
				</div>
			)}

			{/* Animated gradient border - Ẩn khi bị từ chối hoặc hết hạn */}
			{isPromoted && !isRejected && !isExpired && (
				<motion.div
					className="absolute inset-0 pointer-events-none rounded-xl"
					animate={{
						background: postType.glowColors.map(
							(color, i) =>
								`radial-gradient(circle at ${
									i * 50
								}% 50%, ${color} 0%, transparent 50%)`
						),
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						repeatType: 'reverse',
						ease: 'easeInOut',
					}}
				/>
			)}

			<div className="flex flex-col sm:flex-row relative">
				{/* Image */}
				<div className="w-full sm:w-24 md:w-32 lg:w-36 h-40 sm:h-24 md:h-32 lg:h-auto relative flex-shrink-0">
					<div
						className={`absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden ${
							isPromoted && !isRejected && !isExpired
								? `ring-2 ring-offset-2 ${postType.ringColor}`
								: ''
						}`}
					>
						{images.length > 0 ? (
							<img
								src={images[0]}
								alt={product.title}
								className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<FiImage className="text-3xl sm:text-2xl md:text-3xl text-gray-300" />
							</div>
						)}
					</div>
					{images.length > 1 && (
						<div className="absolute bottom-2 right-2 z-10 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium backdrop-blur-sm flex items-center gap-1">
							<FiImage className="w-3 h-3" />
							<span>{images.length}</span>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 p-3 sm:p-3 md:p-4">
					{/* Title */}
					<h3
						className={`text-base sm:text-base md:text-lg font-bold line-clamp-2 mb-1 transition-colors ${
							isPromoted
								? 'text-gray-900'
								: 'text-gray-900 hover:text-emerald-600'
						}`}
					>
						{product.title}
					</h3>

					{/* Status badges */}
					<div className="flex flex-wrap gap-1.5 mb-2 sm:mb-0">
						{product.is_sold && (
							<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 text-gray-700">
								Đã bán
							</span>
						)}
						{product.is_expired && (
							<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
								Hết hạn
							</span>
						)}
						{isPending && (
							<span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700">
								Chờ duyệt
							</span>
						)}
					</div>

					{/* Price */}
					<div className="mb-2">
						<span
							className={`text-lg sm:text-lg md:text-xl font-bold ${
								isPromoted
									? postType.textGradient
									: 'text-emerald-600'
							}`}
						>
							{formatPrice(product.price)}
						</span>
					</div>

					{/* Info Grid - 2 columns on desktop */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{/* Address */}
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<FiMapPin className="flex-shrink-0 w-4 h-4" />
							<span className="truncate">
								{product.address.district},{' '}
								{product.address.province}
							</span>
						</div>

						{/* Category */}
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<FiTag className="flex-shrink-0 w-4 h-4" />
							<span className="truncate">
								{product.category.name}
							</span>
						</div>

						{/* Created Date */}
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<FiCalendar className="flex-shrink-0 w-4 h-4" />
							<span className="truncate">
								Đăng: {formatDate(product.created_at)}
							</span>
						</div>

						{/* Expire Date */}
						<div className="flex items-center gap-2 text-sm text-gray-600">
							<FiClock className="flex-shrink-0 w-4 h-4" />
							<span className="truncate">
								Hết hạn: {formatDate(product.expire_at)}
							</span>
						</div>

						{/* Promotion Expire Date - Hiển thị nếu có tin đẩy */}
						{product.promotion_type !== 'none' &&
							product.promotion_expire_at && (
								<div className="flex items-center gap-2 text-sm text-cyan-700 font-medium col-span-1 sm:col-span-2">
									<FiTrendingUp className="flex-shrink-0 w-4 h-4 text-cyan-500" />
									<span className="truncate">
										Hết hạn tin đẩy:{' '}
										{formatDateTime(
											product.promotion_expire_at
										)}
									</span>
								</div>
							)}
					</div>

					{/* Reject Reason - Full width */}
					{product.status === 'rejected' && product.reject_reason && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg"
						>
							<div className="flex items-start gap-2">
								<FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5 w-4 h-4" />
								<div>
									<p className="text-xs font-semibold text-red-800 mb-0.5">
										Lý do từ chối:
									</p>
									<p className="text-xs text-red-700">
										{product.reject_reason}
									</p>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* Action Buttons */}
			<div className="border-t border-emerald-200/50 p-3 bg-white/50 backdrop-blur-sm">
				{/* Mobile Layout */}
				<div className="flex sm:hidden flex-col gap-2">
					{/* Quản lý */}
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 flex-shrink-0">
							Quản lý
						</span>
						<div className="flex-1 grid grid-cols-3 gap-2">
							{onView && (
								<CompactButton
									icon={<FiEye className="w-3.5 h-3.5" />}
									onClick={() =>
										canClickView && onView(product)
									}
									className={`w-full justify-center ${
										!canClickView
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-blue-500 text-white hover:bg-blue-600'
									}`}
									size="sm"
									disabled={!canClickView}
									title={
										isPending
											? 'Tin chờ duyệt chưa thể xem'
											: isRejected
											? 'Tin bị từ chối'
											: isExpired
											? 'Tin đã hết hạn'
											: 'Xem tin'
									}
								>
									Xem
								</CompactButton>
							)}
							{onEdit && (
								<CompactButton
									icon={<FiEdit2 className="w-3.5 h-3.5" />}
									onClick={() =>
										isRejected || isExpired
											? null
											: onEdit(product)
									}
									className={`w-full justify-center ${
										isRejected || isExpired
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: ''
									}`}
									size="sm"
									disabled={isRejected || isExpired}
									title={
										isRejected
											? 'Tin bị từ chối không thể sửa'
											: isExpired
											? 'Tin hết hạn không thể sửa'
											: 'Sửa tin'
									}
								>
									Sửa
								</CompactButton>
							)}
							{isHidden
								? onUnhide && (
										<CompactButton
											icon={
												<FiEye className="w-3.5 h-3.5" />
											}
											onClick={() =>
												canClickHide &&
												onUnhide(product)
											}
											className={`w-full justify-center ${
												!canClickHide
													? 'bg-gray-300 text-gray-500 cursor-not-allowed'
													: 'bg-green-500 text-white hover:bg-green-600'
											}`}
											size="sm"
											disabled={!canClickHide}
										>
											Hiện
										</CompactButton>
								  )
								: onHide && (
										<CompactButton
											icon={
												<FiEyeOff className="w-3.5 h-3.5" />
											}
											onClick={() =>
												canClickHide && onHide(product)
											}
											className={`w-full justify-center ${
												!canClickHide
													? 'bg-gray-300 text-gray-500 cursor-not-allowed'
													: 'bg-gray-500 text-white hover:bg-gray-600'
											}`}
											size="sm"
											disabled={!canClickHide}
										>
											Ẩn
										</CompactButton>
								  )}
						</div>
					</div>

					{/* Dịch vụ */}
					<div className="flex items-center gap-2">
						<span className="text-xs font-semibold text-gray-500 uppercase tracking-wider w-20 flex-shrink-0">
							Dịch vụ
						</span>
						<div className="flex-1 grid grid-cols-2 gap-2">
							{onRenew && (
								<CompactButton
									icon={
										<FiRefreshCw className="w-3.5 h-3.5" />
									}
									onClick={() =>
										canClickRenew && onRenew(product)
									}
									className={`w-full justify-center ${
										!canClickRenew
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-purple-500 text-white hover:bg-purple-600'
									}`}
									size="sm"
									disabled={!canClickRenew}
									title={
										isRejected
											? 'Tin bị từ chối không thể gia hạn'
											: 'Gia hạn tin'
									}
								>
									Gia hạn
								</CompactButton>
							)}
							{onBoost && (
								<CompactButton
									icon={
										<FiTrendingUp className="w-3.5 h-3.5" />
									}
									onClick={() =>
										canClickBoost && onBoost(product)
									}
									className={`w-full justify-center ${
										!canClickBoost
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
									}`}
									size="sm"
									disabled={!canClickBoost}
									title={
										isRejected
											? 'Tin bị từ chối không thể đẩy'
											: isExpired
											? 'Tin đã hết hạn, vui lòng gia hạn trước'
											: isPending
											? 'Tin chờ duyệt chưa thể đẩy'
											: isBoosted
											? 'Tin đã được đẩy rồi'
											: 'Đẩy tin'
									}
								>
									Đẩy tin
								</CompactButton>
							)}
						</div>
					</div>
				</div>

				{/* Desktop Layout */}
				<div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
					{/* Quản lý */}
					<div className="flex items-center gap-2">
						<span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
							Quản lý
						</span>
						<div className="flex items-center gap-1.5">
							{onView && (
								<CompactButton
									icon={<FiEye className="w-3.5 h-3.5" />}
									onClick={() =>
										canClickView && onView(product)
									}
									className={
										!canClickView
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-blue-500 text-white hover:bg-blue-600'
									}
									disabled={!canClickView}
									title={
										isPending
											? 'Tin chờ duyệt chưa thể xem'
											: isRejected
											? 'Tin bị từ chối'
											: isExpired
											? 'Tin đã hết hạn'
											: 'Xem tin'
									}
								>
									Xem
								</CompactButton>
							)}
							{onEdit && (
								<CompactButton
									icon={<FiEdit2 className="w-3.5 h-3.5" />}
									onClick={() =>
										isRejected || isExpired
											? null
											: onEdit(product)
									}
									className={
										isRejected || isExpired
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: ''
									}
									disabled={isRejected || isExpired}
									title={
										isRejected
											? 'Tin bị từ chối không thể sửa'
											: isExpired
											? 'Tin hết hạn không thể sửa'
											: 'Sửa tin'
									}
								>
									Sửa
								</CompactButton>
							)}
							{isHidden
								? onUnhide && (
										<CompactButton
											icon={
												<FiEye className="w-3.5 h-3.5" />
											}
											onClick={() =>
												canClickHide &&
												onUnhide(product)
											}
											className={
												!canClickHide
													? 'bg-gray-300 text-gray-500 cursor-not-allowed'
													: 'bg-green-500 text-white hover:bg-green-600'
											}
											disabled={!canClickHide}
										>
											Hiện
										</CompactButton>
								  )
								: onHide && (
										<CompactButton
											icon={
												<FiEyeOff className="w-3.5 h-3.5" />
											}
											onClick={() =>
												canClickHide && onHide(product)
											}
											className={
												!canClickHide
													? 'bg-gray-300 text-gray-500 cursor-not-allowed'
													: 'bg-gray-500 text-white hover:bg-gray-600'
											}
											disabled={!canClickHide}
										>
											Ẩn
										</CompactButton>
								  )}
						</div>
					</div>

					{/* Dịch vụ */}
					<div className="flex items-center gap-2">
						<span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
							Dịch vụ
						</span>
						<div className="flex items-center gap-1.5">
							{onRenew && (
								<CompactButton
									icon={
										<FiRefreshCw className="w-3.5 h-3.5" />
									}
									onClick={() =>
										canClickRenew && onRenew(product)
									}
									className={
										!canClickRenew
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-purple-500 text-white hover:bg-purple-600'
									}
									disabled={!canClickRenew}
									title={
										isRejected
											? 'Tin bị từ chối không thể gia hạn'
											: 'Gia hạn tin'
									}
								>
									Gia hạn
								</CompactButton>
							)}
							{onBoost && (
								<CompactButton
									icon={
										<FiTrendingUp className="w-3.5 h-3.5" />
									}
									onClick={() =>
										canClickBoost && onBoost(product)
									}
									className={
										!canClickBoost
											? 'bg-gray-300 text-gray-500 cursor-not-allowed'
											: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:from-orange-600 hover:to-pink-600'
									}
									disabled={!canClickBoost}
									title={
										isRejected
											? 'Tin bị từ chối không thể đẩy'
											: isExpired
											? 'Tin đã hết hạn, vui lòng gia hạn trước'
											: isPending
											? 'Tin chờ duyệt chưa thể đẩy'
											: isBoosted
											? 'Tin đã được đẩy rồi'
											: 'Đẩy tin'
									}
								>
									Đẩy tin
								</CompactButton>
							)}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
