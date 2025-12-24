'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
	FiCheckCircle,
	FiHome,
	FiList,
	FiClock,
	FiMapPin,
	FiTag,
	FiAlertCircle,
	FiImage,
	FiShoppingBag,
	FiCalendar,
} from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/types/product';
import { fetchProductById } from '@/lib/api/productApi';
import { handleApiError } from '@/lib/utils';
import CompactButton from '@/components/ui/CompactButton';

// Helper function để format status
const getStatusConfig = (status: Product['status']) => {
	const statusMap = {
		pending: {
			label: 'Đang chờ duyệt',
			description: 'Admin sẽ xem xét trong vòng 24 giờ',
			color: 'yellow',
			bgColor: 'bg-yellow-100',
			textColor: 'text-yellow-600',
			borderColor: 'border-yellow-200',
			icon: FiClock,
		},
		approved: {
			label: 'Đã duyệt',
			description: 'Tin đăng đã được phê duyệt',
			color: 'green',
			bgColor: 'bg-green-100',
			textColor: 'text-green-600',
			borderColor: 'border-green-200',
			icon: FiCheckCircle,
		},
		rejected: {
			label: 'Bị từ chối',
			description: 'Tin đăng không đáp ứng yêu cầu',
			color: 'red',
			bgColor: 'bg-red-100',
			textColor: 'text-red-600',
			borderColor: 'border-red-200',
			icon: FiAlertCircle,
		},
	};
	return statusMap[status];
};

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(price);
};

export default function PostSuccessPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [productData, setProductData] = useState<Product | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchProductData = async () => {
			try {
				const productId = searchParams.get('product_id');

				if (!productId) {
					router.push('/');
					return;
				}

				// Call API to get product data
				const data = await fetchProductById(productId);
				console.log(data);
				setProductData(data);
			} catch (err) {
				console.error('Error fetching product:', err);
				const errorMessage = handleApiError(err);
				setError(
					errorMessage
						? Object.values(errorMessage).flat()[0]
						: 'Không thể tải thông tin sản phẩm'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProductData();
	}, [searchParams, router]);

	const getImageUrls = (imageUrlsString: string): string[] => {
		if (!imageUrlsString) return [];
		try {
			return JSON.parse(imageUrlsString);
		} catch {
			return [];
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50">
				<div className="text-center">
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 1,
							repeat: Infinity,
							ease: 'linear',
						}}
						className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto"
					/>
					<p className="mt-4 text-gray-600">Đang tải thông tin...</p>
				</div>
			</div>
		);
	}

	if (error || !productData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 px-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<FiAlertCircle className="w-8 h-8 text-red-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-2">
						Có lỗi xảy ra
					</h2>
					<p className="text-gray-600 mb-6">
						{error || 'Không thể tải thông tin sản phẩm'}
					</p>
					<button
						onClick={() => router.push('/')}
						className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
					>
						Về trang chủ
					</button>
				</div>
			</div>
		);
	}

	const statusConfig = getStatusConfig(productData.status);
	const images = getImageUrls(productData.image_urls);
	const StatusIcon = statusConfig.icon;

	return (
		<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-8 sm:py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Page Header */}
				<div className="text-center mb-6 sm:mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mb-4 shadow-lg"
					>
						<FiCheckCircle className="w-8 h-8 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
					>
						Đăng tin thành công! 🎉
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
					>
						Tin đăng của bạn đang được xem xét. Admin sẽ duyệt tin
						trong vòng 24 giờ.
					</motion.p>
				</div>

				{/* Status Badge */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6"
				>
					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center gap-3">
							<div
								className={`w-12 h-12 ${statusConfig.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
							>
								<StatusIcon
									className={`w-6 h-6 ${statusConfig.textColor}`}
								/>
							</div>
							<div>
								<h3 className="font-semibold text-gray-800">
									{statusConfig.label}
								</h3>
								<p className="text-sm text-gray-500">
									{statusConfig.description}
								</p>
							</div>
						</div>
						<span
							className={`px-4 py-2 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-full text-sm font-medium capitalize`}
						>
							{productData.status}
						</span>
					</div>

					{/* Rejection Reason */}
					{productData.status === 'rejected' &&
						productData.reject_reason && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
							>
								<p className="text-sm text-red-700">
									<strong>Lý do từ chối:</strong>{' '}
									{productData.reject_reason}
								</p>
							</motion.div>
						)}
				</motion.div>

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
							Thông tin sản phẩm
						</h2>
					</div>

					<div className="flex flex-col sm:flex-row gap-4">
						{/* Product Image */}
						<div className="w-full sm:w-32 h-40 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
							{images.length > 0 ? (
								<img
									src={images[0]}
									alt={productData.title}
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
								{productData.title}
							</h3>
							<div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-3">
								{formatPrice(parseFloat(productData.price))}
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<FiMapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{productData.address.ward},{' '}
										{productData.address.district},{' '}
										{productData.address.province}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiTag className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										{productData.category.name}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiCalendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										Đăng:{' '}
										{formatDate(productData.created_at)}
									</span>
								</div>
								<div className="flex items-center gap-2">
									<FiClock className="w-4 h-4 text-gray-400 flex-shrink-0" />
									<span className="truncate">
										Hết hạn:{' '}
										{formatDate(productData.expire_at)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6"
				>
					<CompactButton
						onClick={() => router.push('/')}
						variant="secondary"
						size="lg"
						icon={<FiHome className="w-5 h-5" />}
					>
						Về trang chủ
					</CompactButton>

					<CompactButton
						onClick={() => router.push('/my-posts')}
						variant="primary"
						size="lg"
						icon={<FiList className="w-5 h-5" />}
					>
						Quản lý tin đăng
					</CompactButton>
				</motion.div>

				{/* Tips Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-emerald-100"
				>
					<h3 className="font-semibold text-gray-800 mb-3 text-base sm:text-lg">
						💡 Mẹo bán hàng
					</h3>
					<ul className="space-y-2 text-sm text-gray-600">
						<li className="flex items-start gap-2">
							<span className="text-emerald-500 mt-0.5 flex-shrink-0">
								✓
							</span>
							<span>
								Trả lời nhanh chóng khi được liên lạc để tăng uy
								tín với người mua
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-emerald-500 mt-0.5 flex-shrink-0">
								✓
							</span>
							<span>
								Cập nhật trạng thái ẩn sản phẩm khi đã bán để
								tránh spam
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-emerald-500 mt-0.5 flex-shrink-0">
								✓
							</span>
							<span>
								Nâng cấp Premium để đăng không giới hạn và ghim
								tin
							</span>
						</li>
					</ul>
				</motion.div>
			</div>
		</div>
	);
}
