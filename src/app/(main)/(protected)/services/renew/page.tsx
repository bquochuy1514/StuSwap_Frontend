// app/src/(main)/(protected)/services/renew/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	FiRefreshCw,
	FiArrowLeft,
	FiClock,
	FiShoppingBag,
	FiMapPin,
	FiTag,
	FiCalendar,
	FiAlertCircle,
	FiImage,
	FiCheckCircle,
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
	promotion_type: null;
	priority_level: null;
	duration_hours: null;
	extend_days: number;
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

// Helper function to get package styling based on duration
const getPackageStyle = (extendDays: number) => {
	if (extendDays >= 30) {
		return {
			icon: '💎',
			gradient: 'from-purple-500 via-violet-500 to-indigo-500',
			borderColor: 'border-purple-400',
			shadowColor: 'shadow-purple-200',
		};
	}
	if (extendDays >= 15) {
		return {
			icon: '⭐',
			gradient: 'from-amber-500 via-orange-500 to-yellow-500',
			borderColor: 'border-amber-400',
			shadowColor: 'shadow-amber-200',
		};
	}
	return {
		icon: '🔄',
		gradient: 'from-green-500 via-emerald-500 to-teal-500',
		borderColor: 'border-green-400',
		shadowColor: 'shadow-green-200',
	};
};

export default function RenewServicePage() {
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
				api.get('/api/packages?package_type=RENEW'),
			]);

			setProduct(productResponse.data);
			// Sort packages by extend_days (ascending)
			const sortedPackages = packagesResponse.data.sort(
				(a: Package, b: Package) => a.extend_days - b.extend_days
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

	const handleRenew = async (packageId: string) => {
		if (!product) return;

		// Navigate to payment confirmation page
		router.push(
			`/services/renew/payment?productId=${product.id}&packageId=${packageId}`
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

	return (
		<div className="min-h-screen py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
			<div className="max-w-6xl mx-auto">
				{/* Back Button */}
				<motion.button
					onClick={() => router.back()}
					className="flex items-center gap-1.5 cursor-pointer text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 group"
					whileHover={{ x: -4 }}
					whileTap={{ scale: 0.95 }}
				>
					<FiArrowLeft className="w-4 h-4" />
					<span className="text-sm font-medium">Quay lại</span>
				</motion.button>

				{/* Page Header */}
				<div className="text-center mb-4 sm:mb-5">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-2.5 shadow-lg"
					>
						<FiRefreshCw className="w-6 h-6 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
					>
						Dịch Vụ Gia Hạn Tin
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto"
					>
						Kéo dài thời gian hiển thị tin đăng của bạn. Giữ sản
						phẩm luôn hoạt động và tiếp cận nhiều khách hàng hơn!
					</motion.p>
				</div>

				{/* Product Info Card */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4 mb-4 sm:mb-5"
				>
					<div className="flex items-start gap-1.5 mb-2.5">
						<FiShoppingBag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
						<h2 className="text-base font-bold text-gray-900">
							Sản phẩm cần gia hạn
						</h2>
					</div>

					<div className="flex flex-col sm:flex-row gap-3">
						{/* Product Image */}
						<div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
							{images.length > 0 ? (
								<img
									src={images[0]}
									alt={product.title}
									className="w-full h-full object-contain"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<FiImage className="w-10 h-10 text-gray-300" />
								</div>
							)}
						</div>

						{/* Product Details */}
						<div className="flex-1 min-w-0">
							<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 line-clamp-2">
								{product.title}
							</h3>
							<div className="text-lg sm:text-xl font-bold text-emerald-600 mb-2">
								{formatPrice(parseFloat(product.price))}
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
								<div className="flex items-center gap-1.5">
									<FiMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{product.address.ward},{' '}
										{product.address.district},{' '}
										{product.address.province}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<FiTag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{product.category.name}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<FiCalendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										Đăng: {formatDate(product.created_at)}
									</span>
								</div>
								<div className="flex items-center gap-1.5">
									<FiClock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
									<span className="truncate font-semibold text-red-600">
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
					className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 sm:mb-5 border border-green-100"
				>
					<div className="flex items-start gap-2.5 mb-3">
						<div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<FiCheckCircle className="w-4 h-4 text-white" />
						</div>
						<div>
							<h3 className="text-base font-bold text-gray-900 mb-0.5">
								Tại sao nên gia hạn tin?
							</h3>
							<p className="text-xs text-gray-600 leading-relaxed">
								Tin đăng hết hạn sẽ không còn hiển thị với người
								mua. Gia hạn ngay để duy trì khả năng tiếp cận
								khách hàng và tăng cơ hội bán hàng thành công!
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
									<span className="text-base">🔄</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Linh hoạt
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Chọn thời gian gia hạn phù hợp với nhu cầu của
								bạn
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
									<span className="text-base">⭐</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Tiết kiệm
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Gói dài hạn có giá ưu đãi hơn nhiều lần gia hạn
								ngắn
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
									<span className="text-base">💎</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Tiện lợi
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Gia hạn ngay lập tức, không cần đăng tin lại
							</p>
						</div>
					</div>
				</motion.div>

				{/* Packages Grid */}
				<div className="mb-4">
					<h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
						<FiRefreshCw className="w-4 h-4 text-green-600" />
						Chọn gói gia hạn
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
						{packages.map((pkg, index) => {
							const style = getPackageStyle(pkg.extend_days);
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
										className={`bg-white rounded-lg border-2 ${
											style.borderColor
										} ${
											style.shadowColor
										} shadow-lg p-3.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
											selectedPackage === pkg.id
												? 'ring-4 ring-offset-2 ring-opacity-50'
												: ''
										}`}
										onClick={() =>
											setSelectedPackage(pkg.id)
										}
									>
										{/* Package Header */}
										<div className="flex items-start justify-between mb-3">
											<div className="flex items-center gap-2.5">
												<div
													className={`w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-lg flex items-center justify-center text-xl shadow-md`}
												>
													{style.icon}
												</div>
												<div>
													<h3 className="text-sm font-bold text-gray-900">
														{pkg.display_name}
													</h3>
													<p className="text-[10px] text-gray-600 flex items-center gap-1">
														<FiClock className="w-3 h-3" />
														+{pkg.extend_days} ngày
													</p>
												</div>
											</div>
										</div>

										{/* Price */}
										<div className="pb-3 border-b border-gray-100">
											<div className="flex items-end gap-1.5">
												<span
													className={`text-xl font-bold bg-gradient-to-r ${style.gradient} text-transparent bg-clip-text`}
												>
													{formatPrice(
														parseFloat(pkg.price)
													)}
												</span>
											</div>
											<p className="text-[10px] text-gray-500 mt-0.5">
												≈{' '}
												{formatPrice(
													parseFloat(pkg.price) /
														pkg.extend_days
												)}{' '}
												/ ngày
											</p>
										</div>

										{/* Description */}
										<div className="my-3">
											<p className="text-xs text-gray-700 leading-relaxed">
												{pkg.description}
											</p>
										</div>

										{/* Select Button */}
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={(e) => {
												e.stopPropagation();
												setSelectedPackage(pkg.id);
											}}
											className={`w-full py-2 rounded-lg cursor-pointer text-sm font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg ${
												selectedPackage === pkg.id
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

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
				>
					<div className="flex items-start gap-2.5 mb-3">
						<div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
							<FiAlertCircle className="w-4 h-4 text-amber-600" />
						</div>
						<div className="flex-1">
							<h3 className="text-sm font-bold text-gray-900 mb-1">
								Lưu ý quan trọng
							</h3>
							<ul className="text-xs text-gray-600 space-y-0.5">
								<li>
									• Tin đăng sẽ được gia hạn ngay sau khi
									thanh toán thành công
								</li>
								<li>
									• Thời gian gia hạn được cộng thêm vào thời
									gian hiện tại
								</li>
								<li>
									• Không thể hoàn tiền sau khi đã kích hoạt
									dịch vụ
								</li>
								<li>• Tin đã bị từ chối không thể gia hạn</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2.5">
						<CompactButton
							onClick={() => router.back()}
							variant="secondary"
							fullWidth
							size="md"
						>
							Hủy bỏ
						</CompactButton>
						<CompactButton
							onClick={() =>
								selectedPackage && handleRenew(selectedPackage)
							}
							disabled={!selectedPackage || isProcessing}
							className={`${
								selectedPackage && !isProcessing
									? 'bg-gradient-to-r from-emerald-500 to-teal-600'
									: ''
							}`}
							size="md"
							fullWidth
						>
							{isProcessing
								? 'Đang xử lý...'
								: 'Xác nhận gia hạn'}
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
