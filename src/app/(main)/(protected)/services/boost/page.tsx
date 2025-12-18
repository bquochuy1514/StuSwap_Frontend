// app/src/(main)/(protected)/services/boost/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	FiTrendingUp,
	FiArrowLeft,
	FiClock,
	FiZap,
	FiShoppingBag,
	FiMapPin,
	FiTag,
	FiCalendar,
	FiAlertCircle,
	FiImage,
} from 'react-icons/fi';
import api from '@/lib/api/axiosInstance';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/Toast';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import CompactButton from '@/components/ui/CompactButton';

// Package interface
interface Package {
	id: string;
	key: string;
	package_type: string;
	display_name: string;
	description: string;
	price: string;
	is_active: boolean;
	promotion_type: 'BOOST' | 'PRIORITY';
	priority_level: number;
	duration_hours: number;
	extend_days: null;
	membership_days: null;
	max_posts: null;
	premium_badge: boolean;
	created_at: string;
	updated_at: string;
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(price);
};

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	});
};

const parseImages = (imageUrls: string) => {
	try {
		return imageUrls ? JSON.parse(imageUrls) : [];
	} catch {
		return [];
	}
};

// Helper function to get package styling based on promotion type
const getPackageStyle = (promotionType: 'BOOST' | 'PRIORITY') => {
	if (promotionType === 'PRIORITY') {
		return {
			icon: '👑',
			gradient: 'from-purple-500 via-pink-500 to-rose-500',
			bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
			borderColor: 'border-purple-400',
			shadowColor: 'shadow-purple-200',
		};
	}
	return {
		icon: '🚀',
		gradient: 'from-blue-500 via-cyan-500 to-teal-500',
		bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
		borderColor: 'border-blue-400',
		shadowColor: 'shadow-blue-200',
	};
};

// Helper function to format duration
const formatDuration = (hours: number) => {
	if (hours < 24) {
		return `${hours} giờ`;
	}
	const days = hours / 24;
	return `${days} ngày`;
};

export default function BoostServicePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const productId = searchParams.get('productId');

	const [product, setProduct] = useState<Product | null>(null);
	const [packages, setPackages] = useState<Package[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (!productId) {
			toast.error('Không tìm thấy mã sản phẩm');
			router.push('/my-posts');
			return;
		}
		fetchData();
	}, [productId]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [productResponse, packagesResponse] = await Promise.all([
				api.get(`/api/products/${productId}`),
				api.get('/api/packages?package_type=PROMOTION'),
			]);

			setProduct(productResponse.data);
			// Sort packages by priority_level (descending) and duration_hours (ascending)
			const sortedPackages = packagesResponse.data.sort(
				(a: Package, b: Package) => {
					if (a.priority_level !== b.priority_level) {
						return b.priority_level - a.priority_level;
					}
					return a.duration_hours - b.duration_hours;
				}
			);
			setPackages(sortedPackages);
		} catch (error) {
			toast.error('Không thể tải thông tin');
			console.error(error);
			router.push('/my-posts');
		} finally {
			setIsLoading(false);
		}
	};

	const handleBoost = async (packageId: string) => {
		if (!product) return;

		// Navigate to payment confirmation page
		router.push(
			`/services/boost/payment?productId=${product.id}&packageId=${packageId}`
		);
	};

	if (isLoading) {
		return (
			<LoadingOverlay isVisible={true} message="Đang tải thông tin..." />
		);
	}

	if (!product) {
		return null;
	}

	const images = parseImages(product.image_urls);

	// Group packages by promotion type
	const boostPackages = packages.filter(
		(pkg) => pkg.promotion_type === 'BOOST'
	);
	const priorityPackages = packages.filter(
		(pkg) => pkg.promotion_type === 'PRIORITY'
	);

	return (
		<div className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
			<div className="max-w-6xl mx-auto">
				{/* Back Button */}
				<motion.button
					onClick={() => router.back()}
					className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 group"
					whileHover={{ x: -4 }}
					whileTap={{ scale: 0.95 }}
				>
					<FiArrowLeft className="w-5 h-5" />
					<span className="font-medium">Quay lại</span>
				</motion.button>

				{/* Page Header */}
				<div className="text-center mb-6 sm:mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl mb-4 shadow-lg"
					>
						<FiTrendingUp className="w-8 h-8 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
					>
						Dịch Vụ Đẩy Tin
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
					>
						Tăng tốc độ bán hàng với dịch vụ đẩy tin chuyên nghiệp.
						Tin đăng của bạn sẽ được ưu tiên hiển thị ở vị trí nổi
						bật nhất!
					</motion.p>
				</div>

				{/* Product Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8"
				>
					<div className="flex items-start gap-2 mb-3">
						<FiShoppingBag className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
						<h2 className="text-lg font-bold text-gray-900">
							Sản phẩm cần đẩy tin
						</h2>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						{/* Product Image */}
						<div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
							{images.length > 0 ? (
								<img
									src={images[0]}
									alt={product.title}
									className="w-full h-full object-contain"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<FiImage className="w-12 h-12 text-gray-300" />
								</div>
							)}
						</div>

						{/* Product Details */}
						<div className="flex-1 min-w-0">
							<h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
								{product.title}
							</h3>
							<div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-3">
								{formatPrice(parseFloat(product.price))}
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{product.address.ward},{' '}
										{product.address.district},{' '}
										{product.address.province}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{product.category.name}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										Đăng: {formatDate(product.created_at)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										Hết hạn: {formatDate(product.expire_at)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Introduction Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 sm:mb-8 border border-blue-100"
				>
					<div className="flex items-start gap-3 mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<FiZap className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Tại sao nên đẩy tin?
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Trong thời đại số, vị trí hiển thị chính là yếu
								tố quyết định thành công. Hàng nghìn tin đăng
								mới mỗi ngày - tin của bạn có thể bị chìm nghìm
								chỉ sau vài giờ đăng tải.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<span className="text-lg">🚀</span>
								</div>
								<h4 className="font-bold text-gray-900">
									Tin Đẩy Thường
								</h4>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								Giải pháp hiệu quả cho người bán thông thường.
								Tin của bạn sẽ{' '}
								<span className="font-semibold text-blue-600">
									luôn xuất hiện đầu trang
								</span>
								, vượt qua hàng trăm tin thường khác. Phù hợp
								cho các sản phẩm cần bán nhanh.
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-purple-200">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
									<span className="text-lg">👑</span>
								</div>
								<div className="flex items-center gap-2">
									<h4 className="font-bold text-gray-900">
										Tin Ưu Tiên
									</h4>
									<span className="px-2 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
										PHỔ BIẾN
									</span>
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								Giải pháp cao cấp dành cho người bán chuyên
								nghiệp. Tin của bạn không chỉ lên đầu - mà còn
								được{' '}
								<span className="font-semibold text-purple-600">
									ưu tiên TUYỆT ĐỐI
								</span>
								, hiển thị{' '}
								<span className="font-semibold">
									trên cả Tin Đẩy Thường
								</span>{' '}
								với hiệu ứng nổi bật. Lý tưởng cho sản phẩm giá
								trị cao.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Packages Grid */}
				<div className="space-y-6 mb-6">
					{/* PRIORITY Packages */}
					{boostPackages.length > 0 && (
						<div>
							<h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
								<span className="text-2xl">🚀</span>
								Tin Đẩy Thường
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{boostPackages.map((pkg, index) => {
									const style = getPackageStyle(
										pkg.promotion_type
									);
									return (
										<motion.div
											key={pkg.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.5 + index * 0.1,
											}}
											className="relative"
										>
											<div
												className={`bg-white rounded-xl border-2 ${
													style.borderColor
												} ${
													style.shadowColor
												} shadow-lg p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
													selectedPackage === pkg.id
														? 'ring-4 ring-offset-2 ring-opacity-50'
														: ''
												}`}
												onClick={() =>
													setSelectedPackage(pkg.id)
												}
											>
												{/* Package Header */}
												<div className="flex items-start justify-between mb-4">
													<div className="flex items-center gap-3">
														<div
															className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md`}
														>
															{style.icon}
														</div>
														<div>
															<h3 className="text-base font-bold text-gray-900">
																{
																	pkg.display_name
																}
															</h3>
															<p className="text-xs text-gray-600 flex items-center gap-1">
																<FiClock className="w-3 h-3" />
																{formatDuration(
																	pkg.duration_hours
																)}
															</p>
														</div>
													</div>
												</div>

												{/* Price */}
												<div className="pb-4 border-b border-gray-100">
													<div className="flex items-end gap-2">
														<span
															className={`text-2xl font-bold bg-gradient-to-r ${style.gradient} text-transparent bg-clip-text`}
														>
															{formatPrice(
																parseFloat(
																	pkg.price
																)
															)}
														</span>
													</div>
												</div>

												{/* Description */}
												<div className="mb-4">
													<p className="text-sm text-gray-700 leading-relaxed">
														{pkg.description}
													</p>
												</div>

												{/* Select Button */}
												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													onClick={() =>
														setSelectedPackage(
															pkg.id
														)
													}
													className={`w-full py-2.5 rounded-lg cursor-pointer font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
														selectedPackage ===
														pkg.id
															? `bg-gradient-to-r ${style.gradient}`
															: 'bg-gray-400 hover:bg-gray-500'
													}`}
												>
													{selectedPackage === pkg.id
														? 'Đã chọn'
														: 'Chọn gói'}
												</motion.button>
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>
					)}

					{/* BOOST Packages */}
					{priorityPackages.length > 0 && (
						<div>
							<h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
								<span className="text-2xl">👑</span>
								Tin Ưu Tiên
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
								{priorityPackages.map((pkg, index) => {
									const style = getPackageStyle(
										pkg.promotion_type
									);
									return (
										<motion.div
											key={pkg.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.5 + index * 0.1,
											}}
											className="relative"
										>
											<div
												className={`bg-white rounded-xl border-2 ${
													style.borderColor
												} ${
													style.shadowColor
												} shadow-lg p-5 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
													selectedPackage === pkg.id
														? 'ring-4 ring-offset-2 ring-opacity-50'
														: ''
												}`}
												onClick={() =>
													setSelectedPackage(pkg.id)
												}
											>
												{/* Package Header */}
												<div className="flex items-start justify-between mb-4">
													<div className="flex items-center gap-3">
														<div
															className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md`}
														>
															{style.icon}
														</div>
														<div>
															<h3 className="text-base font-bold text-gray-900">
																{
																	pkg.display_name
																}
															</h3>
															<p className="text-xs text-gray-600 flex items-center gap-1">
																<FiClock className="w-3 h-3" />
																{formatDuration(
																	pkg.duration_hours
																)}
															</p>
														</div>
													</div>
												</div>

												{/* Price */}
												<div className="pb-4 border-b border-gray-100">
													<div className="flex items-end gap-2">
														<span
															className={`text-2xl font-bold bg-gradient-to-r ${style.gradient} text-transparent bg-clip-text`}
														>
															{formatPrice(
																parseFloat(
																	pkg.price
																)
															)}
														</span>
													</div>
												</div>

												{/* Description */}
												<div className="mb-4">
													<p className="text-sm text-gray-700 leading-relaxed">
														{pkg.description}
													</p>
												</div>

												{/* Select Button */}
												<motion.button
													whileHover={{ scale: 1.02 }}
													whileTap={{ scale: 0.98 }}
													onClick={() =>
														setSelectedPackage(
															pkg.id
														)
													}
													className={`w-full py-2.5 rounded-lg cursor-pointer font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
														selectedPackage ===
														pkg.id
															? `bg-gradient-to-r ${style.gradient}`
															: 'bg-gray-400 hover:bg-gray-500'
													}`}
												>
													{selectedPackage === pkg.id
														? 'Đã chọn'
														: 'Chọn gói'}
												</motion.button>
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>
					)}
				</div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sm:p-6"
				>
					<div className="flex items-start gap-3 mb-4">
						<div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
							<FiAlertCircle className="w-5 h-5 text-amber-600" />
						</div>
						<div className="flex-1">
							<h3 className="font-bold text-gray-900 mb-1">
								Lưu ý quan trọng
							</h3>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• Tin đăng phải được duyệt và đang hoạt động
								</li>
								<li>
									• Không thể hoàn tiền sau khi đã kích hoạt
									dịch vụ
								</li>
								<li>
									• Mỗi tin chỉ được áp dụng 1 gói đẩy tin tại
									một thời điểm
								</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						<CompactButton
							onClick={() => router.back()}
							variant="secondary"
							fullWidth
							size="lg"
						>
							Hủy bỏ
						</CompactButton>
						<CompactButton
							onClick={() =>
								selectedPackage && handleBoost(selectedPackage)
							}
							disabled={!selectedPackage || isProcessing}
							className={`${
								selectedPackage && !isProcessing
									? 'bg-gradient-to-r from-emerald-500 to-teal-600'
									: ''
							}`}
							size="lg"
							fullWidth
						>
							{isProcessing
								? 'Đang xử lý...'
								: 'Xác nhận đẩy tin'}
						</CompactButton>
					</div>
				</motion.div>
			</div>

			{/* Processing Overlay */}
			{isProcessing && (
				<LoadingOverlay
					isVisible={true}
					message="Đang xử lý yêu cầu..."
				/>
			)}
		</div>
	);
}
