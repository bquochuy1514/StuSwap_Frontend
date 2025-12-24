// app/src/(main)/(protected)/services/renew/payment/page.tsx
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

const formatDateTime = (dateString: string) => {
	return new Date(dateString).toLocaleString('vi-VN', {
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

const getPackageStyle = (extendDays: number) => {
	if (extendDays >= 30) {
		return {
			icon: '💎',
			gradient: 'from-purple-500 via-violet-500 to-indigo-500',
			bgGradient: 'from-purple-50 via-violet-50 to-indigo-50',
		};
	}
	if (extendDays >= 15) {
		return {
			icon: '⭐',
			gradient: 'from-amber-500 via-orange-500 to-yellow-500',
			bgGradient: 'from-amber-50 via-orange-50 to-yellow-50',
		};
	}
	return {
		icon: '🔄',
		gradient: 'from-green-500 via-emerald-500 to-teal-500',
		bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
	};
};

const calculateNewExpireDate = (
	currentExpireDate: string,
	extendDays: number
) => {
	const current = new Date(currentExpireDate);
	const newDate = new Date(
		current.getTime() + extendDays * 24 * 60 * 60 * 1000
	);
	return newDate;
};

export default function RenewPaymentPage() {
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
				api.get('/api/packages?package_type=RENEW'),
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

		try {
			setIsProcessing(true);

			// Call API to create payment
			const response = await api.post('/api/payments/payos/create-link', {
				productId: product.id,
				packageId: selectedPackage.id,
			});

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
	const style = getPackageStyle(selectedPackage.extend_days);
	const newExpireDate = calculateNewExpireDate(
		product.expire_at,
		selectedPackage.extend_days
	);
	const price = parseFloat(selectedPackage.price);

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
						<FiCreditCard className="w-6 h-6 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
					>
						Xác Nhận Thanh Toán
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto"
					>
						Vui lòng kiểm tra kỹ thông tin trước khi thanh toán
					</motion.p>
				</div>

				{/* Main Content */}
				<div className="space-y-3 sm:space-y-4">
					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<FiShoppingBag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Thông tin sản phẩm
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
											Đăng:{' '}
											{formatDateTime(product.created_at)}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<FiClock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
										<span className="truncate font-semibold text-red-600">
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
						className={`bg-gradient-to-r ${style.bgGradient} rounded-lg border-2 border-opacity-50 p-3.5 sm:p-4`}
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<FiPackage className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Gói gia hạn đã chọn
							</h2>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-start gap-2.5 mb-2.5">
								<div
									className={`w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-lg flex items-center justify-center text-xl shadow-md flex-shrink-0`}
								>
									{style.icon}
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 text-sm mb-0.5">
										{selectedPackage.display_name}
									</h3>
									<p className="text-xs text-gray-600">
										{selectedPackage.description}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-gray-200">
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Thời gian gia hạn
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<FiClock className="w-3.5 h-3.5" />+
										{selectedPackage.extend_days} ngày
									</div>
								</div>
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Giá mỗi ngày
									</div>
									<div className="text-xs font-semibold text-gray-900">
										≈{' '}
										{formatPrice(
											price / selectedPackage.extend_days
										)}
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
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<FiDollarSign className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Chi tiết thanh toán
							</h2>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between py-1.5">
								<span className="text-xs text-gray-600">
									Giá gói
								</span>
								<span className="text-sm font-semibold text-gray-900">
									{formatPrice(price)}
								</span>
							</div>

							<div className="flex items-center justify-between py-1.5 border-t border-gray-200">
								<div className="flex items-center gap-1.5">
									<FiCalendar className="w-3.5 h-3.5 text-gray-400" />
									<span className="text-xs text-gray-600">
										Ngày hết hạn hiện tại
									</span>
								</div>
								<span className="text-xs font-medium text-gray-700">
									{formatDateTime(product.expire_at)}
								</span>
							</div>

							<div className="flex items-center justify-between py-1.5 bg-green-50 rounded-lg px-2.5">
								<div className="flex items-center gap-1.5">
									<FiCalendar className="w-3.5 h-3.5 text-green-600" />
									<span className="text-xs text-green-700 font-medium">
										Ngày hết hạn mới
									</span>
								</div>
								<span className="text-xs font-bold text-green-700">
									{formatDateTime(
										newExpireDate.toISOString()
									)}
								</span>
							</div>

							<div className="flex items-center justify-between py-2 border-t-2 border-gray-300 mt-1.5">
								<span className="text-base font-bold text-gray-900">
									Tổng thanh toán
								</span>
								<span className="text-xl font-bold text-emerald-600">
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
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<FiCreditCard className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Phương thức thanh toán
							</h2>
						</div>

						<div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-2 border-blue-200">
							<div className="flex items-start gap-2.5">
								<div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
									<img
										src="/payos-logo.png"
										alt="PayOS"
										className="w-7 h-7 object-contain"
									/>
								</div>
								<div className="flex-1">
									<h3 className="text-sm font-bold text-gray-900 mb-0.5">
										PayOS - Cổng thanh toán
									</h3>
									<p className="text-xs text-gray-600 mb-1.5">
										Thanh toán qua QR Code hoặc chuyển khoản
										ngân hàng
									</p>
									<div className="flex flex-wrap gap-1.5">
										<span className="px-2 py-0.5 bg-white rounded text-[10px] font-medium text-gray-700">
											QR Code
										</span>
										<span className="px-2 py-0.5 bg-white rounded text-[10px] font-medium text-gray-700">
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
						className="bg-amber-50 rounded-lg border border-amber-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-2.5">
							<div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<FiAlertCircle className="w-4 h-4 text-amber-600" />
							</div>
							<div className="flex-1">
								<h3 className="text-sm font-bold text-amber-900 mb-1">
									Lưu ý quan trọng
								</h3>
								<ul className="text-xs text-amber-800 space-y-0.5">
									<li>
										• Tin đăng sẽ được gia hạn ngay sau khi
										thanh toán thành công
									</li>
									<li>
										• Thời gian gia hạn được cộng thêm vào
										ngày hết hạn hiện tại
									</li>
									<li>
										• Không thể hoàn tiền sau khi đã kích
										hoạt dịch vụ
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
						className="flex flex-col sm:flex-row gap-2.5"
					>
						<CompactButton
							onClick={() => router.back()}
							variant="secondary"
							fullWidth
							size="md"
							disabled={isProcessing}
						>
							Hủy bỏ
						</CompactButton>

						<CompactButton
							onClick={handlePayment}
							disabled={isProcessing}
							className={`${
								!isProcessing
									? 'bg-gradient-to-r from-emerald-500 to-teal-600'
									: ''
							}`}
							size="md"
							fullWidth
						>
							{isProcessing
								? 'Đang xử lý...'
								: 'Xác nhận thanh toán'}
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
