// app/src/(main)/(protected)/services/boost/payment/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	FiArrowLeft,
	FiShoppingBag,
	FiPackage,
	FiDollarSign,
	FiCalendar,
	FiClock,
	FiCreditCard,
	FiCheckCircle,
	FiAlertCircle,
	FiImage,
	FiMapPin,
	FiTag,
} from 'react-icons/fi';
import api from '@/lib/api/axiosInstance';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/Toast';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import GradientButton from '@/components/ui/GradientButton';
import { handleApiError } from '@/lib/utils';
import CompactButton from '@/components/ui/CompactButton';

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

const formatDateTime = (dateString: string) => {
	return new Date(dateString).toLocaleString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false, // dùng 24h format
	});
};

const parseImages = (imageUrls: string) => {
	try {
		return imageUrls ? JSON.parse(imageUrls) : [];
	} catch {
		return [];
	}
};

const getPackageStyle = (promotionType: 'BOOST' | 'PRIORITY') => {
	if (promotionType === 'PRIORITY') {
		return {
			icon: '👑',
			gradient: 'from-purple-500 via-pink-500 to-rose-500',
			bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
		};
	}
	return {
		icon: '🚀',
		gradient: 'from-blue-500 via-cyan-500 to-teal-500',
		bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
	};
};

const calculateExpireDate = (durationHours: number) => {
	const now = new Date();
	const expireDate = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
	return expireDate;
};

export default function BoostPaymentPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const productId = searchParams.get('productId');
	const packageId = searchParams.get('packageId');

	const [product, setProduct] = useState<Product | null>(null);
	const [selectedPackage, setSelectedPackage] = useState<Package | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (!productId || !packageId) {
			toast.error('Thông tin không hợp lệ');
			router.push('/my-posts');
			return;
		}
		fetchData();
	}, [productId, packageId]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [productResponse, packagesResponse] = await Promise.all([
				api.get(`/api/products/${productId}`),
				api.get('/api/packages?package_type=PROMOTION'),
			]);

			setProduct(productResponse.data);

			// Find selected package
			const pkg = packagesResponse.data.find(
				(p: Package) => p.id === packageId
			);
			if (!pkg) {
				toast.error('Không tìm thấy gói dịch vụ');
				router.push('/my-posts');
				return;
			}
			setSelectedPackage(pkg);
		} catch (error) {
			toast.error('Không thể tải thông tin');
			console.error(error);
			router.push('/my-posts');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePayment = async () => {
		if (!product || !selectedPackage) return;

		console.log('hello');

		try {
			setIsProcessing(true);

			console.log('productId', productId);
			console.log('packageId', packageId);

			// Call API to create payment
			const response = await api.post('/api/payments/payos/create-link', {
				productId: product.id,
				packageId: selectedPackage.id,
			});

			console.log('response', response);

			// Redirect to PayOS payment page
			if (response.data.checkoutUrl) {
				window.location.href = response.data.checkoutUrl;
			} else {
				toast.error('Không thể tạo liên kết thanh toán');
			}
		} catch (error) {
			handleApiError(error);
			setIsLoading(false);
		} finally {
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<LoadingOverlay isVisible={true} message="Đang tải thông tin..." />
		);
	}

	if (!product || !selectedPackage) {
		return null;
	}

	const images = parseImages(product.image_urls);
	const style = getPackageStyle(selectedPackage.promotion_type);
	const expireDate = calculateExpireDate(selectedPackage.duration_hours);
	const price = parseFloat(selectedPackage.price);

	return (
		<div className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
			<div className="max-w-4xl mx-auto">
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
						className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg"
					>
						<FiCreditCard className="w-8 h-8 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
					>
						Xác Nhận Thanh Toán
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
					>
						Vui lòng kiểm tra kỹ thông tin trước khi thanh toán
					</motion.p>
				</div>

				{/* Main Content */}
				<div className="space-y-4 sm:space-y-6">
					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
					>
						<div className="flex items-center gap-2 mb-4">
							<FiShoppingBag className="w-5 h-5 text-emerald-600" />
							<h2 className="text-lg font-bold text-gray-900">
								Thông tin sản phẩm
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
											Đăng:{' '}
											{formatDateTime(product.created_at)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
										<span className="truncate">
											Hết hạn:{' '}
											{formatDateTime(product.expire_at)}
										</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Package Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className={`bg-gradient-to-r ${style.bgGradient} rounded-xl border-2 border-opacity-50 p-4 sm:p-6`}
					>
						<div className="flex items-center gap-2 mb-4">
							<FiPackage className="w-5 h-5 text-gray-900" />
							<h2 className="text-lg font-bold text-gray-900">
								Gói dịch vụ đã chọn
							</h2>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
							<div className="flex items-start gap-3 mb-3">
								<div
									className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md flex-shrink-0`}
								>
									{style.icon}
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 text-lg mb-1">
										{selectedPackage.display_name}
									</h3>
									<p className="text-sm text-gray-600">
										{selectedPackage.description}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
								<div>
									<div className="text-xs text-gray-500 mb-1">
										Thời gian
									</div>
									<div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
										<FiClock className="w-4 h-4" />
										{selectedPackage.duration_hours < 24
											? `${selectedPackage.duration_hours} giờ`
											: `${
													selectedPackage.duration_hours /
													24
											  } ngày`}
									</div>
								</div>
								<div>
									<div className="text-xs text-gray-500 mb-1">
										Loại tin
									</div>
									<div className="text-sm font-semibold text-gray-900">
										{selectedPackage.promotion_type ===
										'PRIORITY'
											? 'Tin Ưu Tiên'
											: 'Tin Đẩy'}
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Payment Details */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
					>
						<div className="flex items-center gap-2 mb-4">
							<FiDollarSign className="w-5 h-5 text-emerald-600" />
							<h2 className="text-lg font-bold text-gray-900">
								Chi tiết thanh toán
							</h2>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between py-2">
								<span className="text-gray-600">Giá gói</span>
								<span className="font-semibold text-gray-900">
									{formatPrice(price)}
								</span>
							</div>

							<div className="flex items-center justify-between py-2 border-t border-gray-200">
								<div className="flex items-center gap-2">
									<FiCalendar className="w-4 h-4 text-gray-500" />
									<span className="text-gray-600">
										Hiệu lực đến
									</span>
								</div>
								<span className="font-semibold text-gray-900">
									{formatDateTime(expireDate.toISOString())}
								</span>
							</div>

							<div className="flex items-center justify-between py-3 border-t-2 border-gray-300 mt-2">
								<span className="text-lg font-bold text-gray-900">
									Tổng thanh toán
								</span>
								<span className="text-2xl font-bold text-emerald-600">
									{formatPrice(price)}
								</span>
							</div>
						</div>
					</motion.div>

					{/* Payment Method */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
					>
						<div className="flex items-center gap-2 mb-4">
							<FiCreditCard className="w-5 h-5 text-blue-600" />
							<h2 className="text-lg font-bold text-gray-900">
								Phương thức thanh toán
							</h2>
						</div>

						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
							<div className="flex items-start gap-3">
								<div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
									<img
										src="/payos-logo.png"
										alt="PayOS"
										className="w-8 h-8 object-contain"
									/>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 mb-1">
										PayOS - Cổng thanh toán
									</h3>
									<p className="text-sm text-gray-600 mb-2">
										Thanh toán qua QR Code hoặc chuyển khoản
										ngân hàng
									</p>
									<div className="flex flex-wrap gap-2">
										<span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
											QR Code
										</span>
										<span className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-700">
											Bank Transfer
										</span>
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Important Notes */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
						className="bg-amber-50 rounded-xl border border-amber-200 p-4 sm:p-6"
					>
						<div className="flex items-start gap-3">
							<FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
							<div>
								<h3 className="font-bold text-amber-900 mb-2">
									Lưu ý quan trọng
								</h3>
								<ul className="text-sm text-amber-800 space-y-1">
									<li>
										• Gói dịch vụ sẽ được kích hoạt ngay sau
										khi thanh toán thành công
									</li>
									<li>
										• Không thể hoàn tiền sau khi đã kích
										hoạt dịch vụ
									</li>
									<li>
										• Liên hệ hỗ trợ nếu có vấn đề về thanh
										toán
									</li>
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="flex flex-col sm:flex-row gap-3"
					>
						<CompactButton
							onClick={() => router.back()}
							variant="secondary"
							fullWidth
							size="lg"
							icon={<FiArrowLeft />}
							className="flex-1"
							disabled={isProcessing}
						>
							Quay lại
						</CompactButton>

						<CompactButton
							onClick={handlePayment}
							variant="primary"
							fullWidth
							size="lg"
							icon={<FiCheckCircle />}
							className="flex-1"
							disabled={isProcessing}
						>
							Xác nhận thanh toán
						</CompactButton>
					</motion.div>
				</div>
			</div>

			{/* Processing Overlay */}
			{isProcessing && (
				<LoadingOverlay
					isVisible={true}
					message="Đang tạo liên kết thanh toán..."
				/>
			)}
		</div>
	);
}
