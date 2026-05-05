/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(main)/(public)/products/[id]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	MdArrowBack,
	MdLocationOn,
	MdCalendarToday,
	MdCategory,
	MdVerified,
	MdPhone,
	MdEmail,
	MdShare,
	MdFavorite,
	MdFavoriteBorder,
} from 'react-icons/md';
import { IoSparkles, IoSchool } from 'react-icons/io5';
import api from '@/lib/api/axiosInstance';
import CompactButton from '@/components/ui/CompactButton';
import { Product } from '@/types/product';

const conditionLabels: Record<string, string> = {
	new: 'Mới 100%',
	used_like_new: 'Như mới',
	used_good: 'Còn tốt',
	used_fair: 'Khá',
};

const conditionColors: Record<string, string> = {
	new: 'bg-green-100 text-green-700',
	used_like_new: 'bg-blue-100 text-blue-700',
	used_good: 'bg-yellow-100 text-yellow-700',
	used_fair: 'bg-orange-100 text-orange-700',
};

export default function ProductDetailPage() {
	const router = useRouter();
	const params = useParams();
	const productId = params.id as string;

	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [isLiked, setIsLiked] = useState(false);

	useEffect(() => {
		fetchProductDetail();
	}, [productId]);

	const fetchProductDetail = async () => {
		try {
			setLoading(true);
			const response = await api.get(`/api/products/${productId}`);
			setProduct(response.data);
		} catch (err: any) {
			setError(err.response?.data?.message || 'Không thể tải sản phẩm');
		} finally {
			setLoading(false);
		}
	};

	const formatPrice = (price: string) => {
		const numValue = parseFloat(price);
		return `${numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	const parseImageUrls = (imageUrls: string): string[] => {
		try {
			return JSON.parse(imageUrls);
		} catch {
			return [];
		}
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: product?.title,
				text: product?.description,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			alert('Đã copy link sản phẩm!');
		}
	};

	const handleContactSeller = () => {
		if (product?.user.phone) {
			window.location.href = `tel:${product.user.phone}`;
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
					<p className="text-gray-600">Đang tải sản phẩm...</p>
				</div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
				<div className="text-center max-w-md">
					<div className="text-6xl mb-4">😞</div>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Không tìm thấy sản phẩm
					</h2>
					<p className="text-gray-600 mb-6">
						{error || 'Sản phẩm không tồn tại hoặc đã bị xóa'}
					</p>
					<CompactButton
						onClick={() => router.push('/products')}
						variant="primary"
					>
						Về trang sản phẩm
					</CompactButton>
				</div>
			</div>
		);
	}

	const images = parseImageUrls(product.image_urls);

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-6">
				{/* Back Button */}
				<motion.button
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					onClick={() => router.back()}
					className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 mb-6"
				>
					<MdArrowBack className="w-5 h-5" />
					<span>Quay lại</span>
				</motion.button>

				{/* Breadcrumb */}
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-sm text-gray-600 mb-6"
				>
					<span
						className="hover:text-emerald-600 cursor-pointer"
						onClick={() => router.push('/')}
					>
						Trang chủ
					</span>
					<span className="mx-2">&gt;</span>
					<span
						className="hover:text-emerald-600 cursor-pointer"
						onClick={() => router.push('/products')}
					>
						Sản phẩm
					</span>
					<span className="mx-2">&gt;</span>
					<span className="font-medium text-gray-900">
						{product.title}
					</span>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left Column - Images */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="lg:col-span-2"
					>
						<div className="bg-white rounded-2xl shadow-md overflow-hidden">
							{/* Main Image */}
							<div className="relative aspect-[4/3] max-h-[500px] bg-gray-100">
								{product.is_sold && (
									<div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
										<div className="bg-red-600 text-white px-6 py-3 rounded-lg text-xl font-bold">
											ĐÃ BÁN
										</div>
									</div>
								)}
								{product.priority_level > 1 && (
									<div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 z-10">
										<IoSparkles className="w-4 h-4" />
										Nổi bật
									</div>
								)}
								<img
									src={
										images[selectedImage] ||
										'/placeholder.jpg'
									}
									alt={product.title}
									className="object-contain p-4"
								/>
							</div>

							{/* Thumbnail Images */}
							{images.length > 1 && (
								<div className="p-4 flex gap-2 overflow-x-auto">
									{images.map((img, idx) => (
										<button
											key={idx}
											onClick={() =>
												setSelectedImage(idx)
											}
											className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
												selectedImage === idx
													? 'border-emerald-600'
													: 'border-gray-200 hover:border-gray-400'
											}`}
										>
											<img
												src={img}
												alt={`${product.title} ${
													idx + 1
												}`}
												className="object-cover"
											/>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Product Description */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
							className="bg-white rounded-2xl shadow-md p-6 mt-6"
						>
							<h2 className="text-xl font-bold text-gray-900 mb-4">
								Mô tả chi tiết
							</h2>
							<p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
								{product.description}
							</p>
						</motion.div>
					</motion.div>

					{/* Right Column - Product Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="lg:col-span-1"
					>
						<div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
							{/* Title */}
							<h1 className="text-2xl font-bold text-gray-900 mb-4">
								{product.title}
							</h1>

							{/* Price */}
							<div className="mb-6">
								<div className="text-3xl font-bold text-emerald-600">
									{formatPrice(product.price)}
								</div>
							</div>

							{/* Product Info */}
							<div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
								<div className="flex items-center gap-2 text-sm">
									<MdCategory className="w-5 h-5 text-gray-500" />
									<span className="text-gray-600">
										Danh mục:
									</span>
									<span className="font-medium text-gray-900">
										{product.category.name}
									</span>
								</div>

								<div className="flex items-center gap-2 text-sm">
									<div
										className={`px-3 py-1 rounded-full text-sm font-medium ${
											conditionColors[product.condition]
										}`}
									>
										{conditionLabels[product.condition] ||
											product.condition}
									</div>
								</div>

								<div className="flex items-center gap-2 text-sm">
									<MdLocationOn className="w-5 h-5 text-gray-500" />
									<span className="text-gray-700">
										{product.address.ward},{' '}
										{product.address.district},{' '}
										{product.address.province}
									</span>
								</div>

								<div className="flex items-center gap-2 text-sm">
									<MdCalendarToday className="w-5 h-5 text-gray-500" />
									<span className="text-gray-600">
										Đăng ngày:
									</span>
									<span className="text-gray-900">
										{formatDate(product.created_at)}
									</span>
								</div>
							</div>

							{/* Seller Info */}
							<div className="mb-6 pb-6 border-b border-gray-200">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Người bán
								</h3>
								<div className="flex items-start gap-3 mb-4">
									<div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
										<img
											src={
												product.user.avatar ||
												'/avatar-placeholder.jpg'
											}
											alt={product.user.fullName}
											className="object-cover"
										/>
									</div>
									<div className="flex-1">
										<div className="flex items-center gap-2">
											<h4 className="font-semibold text-gray-900">
												{product.user.fullName}
											</h4>
											{product.user.membershipType !==
												null && (
												<MdVerified className="w-4 h-4 text-blue-600" />
											)}
										</div>
										{product.user.university && (
											<div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
												<IoSchool className="w-4 h-4" />{' '}
												<span>
													{product.user.university}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
									<MdPhone className="w-4 h-4" />
									<span>{product.user.phone}</span>
								</div>

								<div className="flex items-center gap-2 text-sm text-gray-600">
									<MdEmail className="w-4 h-4" />
									<span>{product.user.email}</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="space-y-3">
								<CompactButton
									onClick={handleContactSeller}
									variant="primary"
									size="lg"
									fullWidth
									icon={<MdPhone className="w-5 h-5" />}
									disabled={product.is_sold}
								>
									{product.is_sold
										? 'Sản phẩm đã bán'
										: 'Liên hệ người bán'}
								</CompactButton>

								<div className="flex gap-2">
									<CompactButton
										onClick={() => setIsLiked(!isLiked)}
										variant="secondary"
										className="flex-1"
										icon={
											isLiked ? (
												<MdFavorite className="w-5 h-5 text-red-500" />
											) : (
												<MdFavoriteBorder className="w-5 h-5" />
											)
										}
									>
										{isLiked ? 'Đã lưu' : 'Lưu tin'}
									</CompactButton>

									<CompactButton
										onClick={handleShare}
										variant="secondary"
										className="flex-1"
										icon={<MdShare className="w-5 h-5" />}
									>
										Chia sẻ
									</CompactButton>
								</div>
							</div>

							{/* Safety Tips */}
							<div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
								<h4 className="font-semibold text-gray-900 mb-2 text-sm">
									⚠️ Lưu ý an toàn
								</h4>
								<ul className="text-xs text-gray-600 space-y-1">
									<li>• Gặp mặt tại nơi công cộng</li>
									<li>
										• Kiểm tra kỹ sản phẩm trước khi thanh
										toán
									</li>
									<li>
										• Không chuyển tiền trước khi nhận hàng
									</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
