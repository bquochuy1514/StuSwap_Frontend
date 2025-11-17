import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiHeart, FiTag } from 'react-icons/fi';
import { AddressData } from '@/types/auth';

interface ProductCardProps {
	id?: string;
	title: string;
	price: string | number;
	condition: string;
	image_urls: string | string[]; // API trả về string hoặc array
	category?: string;
	address?: AddressData;
	created_at?: string;
	isLiked?: boolean;
	onLike?: (id: string) => void;
	onClick?: (id: string) => void;
	className?: string;
}

const CONDITION_CONFIG: Record<
	string,
	{ label: string; color: string; bgColor: string }
> = {
	new: {
		label: 'Mới',
		color: 'text-emerald-700',
		bgColor: 'bg-emerald-100',
	},
	used_like_new: {
		label: 'Như mới',
		color: 'text-blue-700',
		bgColor: 'bg-blue-100',
	},
	used_good: {
		label: 'Còn tốt',
		color: 'text-amber-700',
		bgColor: 'bg-amber-100',
	},
	used_fair: {
		label: 'Ổn',
		color: 'text-orange-700',
		bgColor: 'bg-orange-100',
	},
};

const ProductCard: React.FC<ProductCardProps> = ({
	id = '',
	title,
	price,
	condition,
	image_urls,
	category,
	address,
	created_at,
	isLiked = false,
	onLike,
	onClick,
	className = '',
}) => {
	const [imageError, setImageError] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	// Parse image_urls nếu là string JSON
	const images = useMemo(() => {
		if (typeof image_urls === 'string') {
			try {
				return JSON.parse(image_urls);
			} catch {
				return [image_urls];
			}
		}
		return image_urls || [];
	}, [image_urls, image_urls?.length]);

	// Tính thời gian đăng tin
	const timeAgo = useMemo(() => {
		if (!created_at) return 'Vừa xong';

		const now = new Date();
		const createdDate = new Date(created_at);
		const diffMs = now.getTime() - createdDate.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Vừa xong';
		if (diffMins < 60) return `${diffMins} phút trước`;
		if (diffHours < 24) return `${diffHours} giờ trước`;
		if (diffDays < 7) return `${diffDays} ngày trước`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
		return `${Math.floor(diffDays / 30)} tháng trước`;
	}, [created_at]);

	const formatPrice = (value: string | number) => {
		if (!value || value === '0' || value === 0) return 'Liên hệ';
		const numValue = typeof value === 'string' ? parseFloat(value) : value;
		return `${numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
	};

	const handleCardClick = () => {
		if (onClick && id) {
			onClick(id);
		}
	};

	const handleLikeClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onLike && id) {
			onLike(id);
		}
	};

	const displayImage = images.length > 0 && !imageError ? images[0] : null;
	const conditionConfig =
		CONDITION_CONFIG[condition] || CONDITION_CONFIG['used_good'];
	const locationText = address?.province || 'Chưa có địa chỉ';
	const categoryText = category || 'Chưa có danh mục';

	return (
		<motion.div
			whileHover={{ y: -4 }}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			onClick={handleCardClick}
			className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group relative ${className}`}
		>
			{/* Image Container */}
			<div className="relative aspect-square overflow-hidden bg-gray-100">
				{displayImage ? (
					<img
						src={displayImage}
						alt={title}
						onError={() => setImageError(true)}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
						<svg
							className="w-16 h-16 text-gray-300"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}

				{/* Condition Badge */}
				<div className="absolute top-2 left-2">
					<span
						className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold shadow-sm ${conditionConfig.bgColor} ${conditionConfig.color}`}
					>
						{conditionConfig.label}
					</span>
				</div>

				{/* Like Button */}
				{onLike && (
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={handleLikeClick}
						className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all ${
							isLiked
								? 'bg-red-500 text-white'
								: 'bg-white/80 text-gray-600 hover:bg-white'
						}`}
					>
						<FiHeart
							className={`w-4 h-4 ${
								isLiked ? 'fill-current' : ''
							}`}
						/>
					</motion.button>
				)}

				{/* Image Count Badge */}
				{images.length > 1 && (
					<div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium backdrop-blur-sm">
						1/{images.length}
					</div>
				)}
			</div>

			{/* Content */}
			<div className="p-4 space-y-2">
				{/* Title */}
				<h3 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
					{title || 'Tiêu đề sản phẩm'}
				</h3>

				{/* Price */}
				<p className="text-lg font-bold text-emerald-600">
					{formatPrice(price)}
				</p>

				{/* Category & Location & Time */}
				<div className="pt-2 space-y-1.5 border-t border-gray-100">
					{/* Category */}
					{
						<div className="flex items-center gap-1.5 text-xs text-gray-500">
							<FiTag className="w-3.5 h-3.5 flex-shrink-0" />
							<span className="truncate">{categoryText}</span>
						</div>
					}

					{/* Location */}
					<div className="flex items-center gap-1.5 text-xs text-gray-500">
						<FiMapPin className="w-3.5 h-3.5 flex-shrink-0" />
						<span className="truncate">{locationText}</span>
					</div>

					{/* Time */}
					<div className="flex items-center gap-1.5 text-xs text-gray-400">
						<FiClock className="w-3.5 h-3.5 flex-shrink-0" />
						<span>{timeAgo}</span>
					</div>
				</div>
			</div>

			{/* Hover Effect Overlay */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: isHovered ? 1 : 0 }}
				className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none"
			/>
		</motion.div>
	);
};

export default ProductCard;
