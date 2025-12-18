'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	XCircle,
	Sparkles,
	TrendingUp,
	Package,
	AlertTriangle,
	Clock,
	RefreshCw,
} from 'lucide-react';
import api from '@/lib/api/axiosInstance';
import { Product, ProductCondition } from '@/types/product';
import { handleApiError } from '@/lib/utils';
import { FiHome, FiList, FiRotateCcw } from 'react-icons/fi';
import CompactButton from '@/components/ui/CompactButton';

// Types
type PackageData = {
	id: string;
	key: string;
	package_type: string;
	display_name: string;
	description: string;
	price: string;
	is_active: boolean;
	promotion_type: string;
	priority_level: number;
	duration_hours: number;
	extend_days: null;
	membership_days: null;
	max_posts: null;
	premium_badge: boolean;
	created_at: string;
	updated_at: string;
};

// Helper function để format condition
const getConditionLabel = (condition: string) => {
	const conditionMap = {
		[ProductCondition.NEW]: 'Mới 100%',
		[ProductCondition.LIKE_NEW]: 'Như mới',
		[ProductCondition.GOOD]: 'Còn tốt',
		[ProductCondition.FAIR]: 'Khá ổn',
	};
	return conditionMap[condition as ProductCondition] || condition;
};

export default function PromotionPaymentCancel() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [packageData, setPackageData] = useState<PackageData | null>(null);
	const [productData, setProductData] = useState<Product | null>(null);

	// Get URL params from PayOS redirect
	const productId = searchParams.get('product_id');
	const packageId = searchParams.get('package_id');
	const orderCode = searchParams.get('orderCode');
	const status = searchParams.get('status');
	const cancel = searchParams.get('cancel');

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				if (!productId || !packageId) {
					throw new Error('Thiếu thông tin thanh toán');
				}

				// Fetch package and product data in parallel
				const [packageRes, productRes] = await Promise.all([
					api.get(`/api/packages/${packageId}`),
					api.get(`/api/products/${productId}`),
				]);

				setPackageData(packageRes.data);
				setProductData(productRes.data);
			} catch (err) {
				handleApiError(err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [productId, packageId]);

	// Format currency
	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(parseFloat(value));
	};

	// Get first image
	const getProductImage = () => {
		if (!productData?.image_urls) return null;
		try {
			const urls = JSON.parse(productData.image_urls);
			return urls[0] || null;
		} catch {
			return null;
		}
	};

	// Get promotion type icon and color
	const getPromotionDetails = () => {
		if (packageData?.promotion_type === 'BOOST') {
			return {
				icon: TrendingUp,
				color: 'from-orange-400 to-red-500',
				label: '🚀 Đẩy tin',
			};
		}
		if (packageData?.promotion_type === 'PRIORITY') {
			return {
				icon: Sparkles,
				color: 'from-purple-400 to-pink-500',
				label: '⭐ Ưu tiên',
			};
		}
		return {
			icon: Package,
			color: 'from-blue-400 to-indigo-500',
			label: '📦 Gói khuyến mãi',
		};
	};

	// Retry payment function
	const handleRetryPayment = () => {
		// Navigate back to package selection or payment page
		router.push(
			`/services/boost/payment?productId=${productId}&packageId=${packageId}`
		);
	};

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">
						Đang tải thông tin...
					</p>
					<p className="text-sm text-gray-500 mt-2">
						Vui lòng đợi trong giây lát
					</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !packageData || !productData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
				>
					<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<AlertTriangle className="w-10 h-10 text-red-500" />
					</div>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">
						Có lỗi xảy ra
					</h1>
					<p className="text-gray-600 mb-6">
						{error || 'Không thể tải thông tin'}
					</p>
					<div className="space-y-3">
						<button
							onClick={() => window.location.reload()}
							className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
						>
							Thử lại
						</button>
						<button
							onClick={() => router.push('/')}
							className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
						>
							Về trang chủ
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

	const promotionDetails = getPromotionDetails();
	const PromotionIcon = promotionDetails.icon;
	const productImage = getProductImage();

	return (
		<div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Cancel Header */}
				<div className="text-center mb-6 sm:mb-8">
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 200 }}
						className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mb-4 shadow-lg"
					>
						<XCircle
							className="w-8 h-8 text-white"
							strokeWidth={2.5}
						/>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
					>
						Thanh toán đã bị hủy
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
					>
						Giao dịch của bạn đã bị hủy. Tin đăng chưa được áp dụng
						gói khuyến mãi.
					</motion.p>
				</div>

				{/* Info Box */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-2xl shadow-xl p-6 mb-6"
				>
					<div className="flex items-start gap-3 mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
						<AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
						<div>
							<p className="font-semibold text-gray-800 mb-1">
								Tại sao thanh toán bị hủy?
							</p>
							<ul className="text-sm text-gray-600 space-y-1">
								<li>
									• Bạn đã nhấn nút {'Huỷ'} trên trang thanh
									toán
								</li>
								<li>
									• Đóng cửa sổ thanh toán trước khi hoàn tất
								</li>
								<li>• Hết thời gian chờ thanh toán</li>
								<li>• Có lỗi xảy ra trong quá trình xử lý</li>
							</ul>
						</div>
					</div>

					<div className="grid md:grid-cols-2 gap-6">
						{/* Package Info */}
						<div>
							<h3 className="text-sm text-gray-500 mb-3 font-medium">
								Gói bị hủy
							</h3>
							<div className="flex items-center gap-3 mb-4">
								<div
									className={`w-12 h-12 bg-gradient-to-br ${promotionDetails.color} rounded-xl flex items-center justify-center shadow-md`}
								>
									<PromotionIcon className="w-6 h-6 text-white" />
								</div>
								<div>
									<p className="font-bold text-gray-800">
										{packageData.display_name}
									</p>
									<p className="text-sm text-gray-500">
										{promotionDetails.label}
									</p>
								</div>
							</div>

							<div className="space-y-2 mb-4">
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">
										Thời gian:
									</span>
									<span className="font-semibold text-gray-800">
										{packageData.duration_hours} giờ
									</span>
								</div>
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-sm text-gray-600">
										Mức ưu tiên:
									</span>
									<span className="font-semibold text-gray-800">
										Level {packageData.priority_level}
									</span>
								</div>
								<div className="flex justify-between items-center py-2">
									<span className="text-sm text-gray-600">
										Số tiền:
									</span>
									<span className="text-xl font-bold text-orange-600">
										{formatCurrency(packageData.price)}
									</span>
								</div>
							</div>

							<div className="p-3 bg-gray-50 rounded-lg">
								<p className="text-xs text-gray-600">
									{packageData.description}
								</p>
							</div>
						</div>

						{/* Product Info */}
						<div>
							<h3 className="text-sm text-gray-500 mb-3 font-medium">
								Tin đăng
							</h3>

							{productImage && (
								<div className="mb-3 rounded-xl overflow-hidden shadow-md">
									<img
										src={productImage}
										alt={productData.title}
										className="w-full h-40 object-cover"
									/>
								</div>
							)}

							<h4 className="font-bold text-gray-800 mb-2 line-clamp-2">
								{productData.title}
							</h4>

							<div className="space-y-2">
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">
										Giá bán:
									</span>
									<span className="font-bold text-emerald-600">
										{formatCurrency(productData.price)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">
										Tình trạng:
									</span>
									<span className="font-semibold text-gray-800">
										{getConditionLabel(
											productData.condition
										)}
									</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-sm text-gray-600">
										Trạng thái:
									</span>
									<span
										className={`px-2 py-1 rounded-full text-xs font-semibold ${
											productData.status === 'approved'
												? 'bg-green-100 text-green-700'
												: productData.status ===
												  'pending'
												? 'bg-yellow-100 text-yellow-700'
												: 'bg-red-100 text-red-700'
										}`}
									>
										{productData.status === 'approved'
											? '✓ Đã duyệt'
											: productData.status === 'pending'
											? '⏳ Chờ duyệt'
											: '✗ Từ chối'}
									</span>
								</div>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Transaction Info (if available) */}
				{orderCode && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-2xl shadow-xl p-6 mb-6"
					>
						<h2 className="text-lg font-bold text-gray-800 mb-4">
							Thông tin giao dịch
						</h2>
						<div className="grid md:grid-cols-2 gap-4">
							<div className="bg-gray-50 p-4 rounded-lg">
								<span className="text-xs text-gray-500 block mb-1">
									Mã đơn hàng
								</span>
								<p className="font-mono font-semibold text-gray-800 text-sm">
									{orderCode}
								</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-lg">
								<span className="text-xs text-gray-500 block mb-1">
									Trạng thái
								</span>
								<p className="font-semibold text-orange-600 text-sm flex items-center gap-1">
									<XCircle className="w-4 h-4" />
									Đã hủy
								</p>
							</div>
						</div>
					</motion.div>
				)}

				{/* Next Steps */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-white rounded-2xl shadow-xl p-6 mb-6"
				>
					<h2 className="text-lg font-bold text-gray-800 mb-3">
						Bạn muốn làm gì tiếp theo?
					</h2>
					<div className="grid sm:grid-cols-2 gap-4">
						<div className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 transition-colors">
							<div className="flex items-center gap-2 mb-2">
								<RefreshCw className="w-5 h-5 text-orange-500" />
								<h3 className="font-semibold text-gray-800">
									Thử lại thanh toán
								</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">
								Quay lại trang chọn gói và thực hiện thanh toán
								lại
							</p>
						</div>
						<div className="p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors">
							<div className="flex items-center gap-2 mb-2">
								<Clock className="w-5 h-5 text-blue-500" />
								<h3 className="font-semibold text-gray-800">
									Thử lại sau
								</h3>
							</div>
							<p className="text-sm text-gray-600 mb-3">
								Bạn có thể quay lại bất cứ lúc nào để đẩy tin
							</p>
						</div>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
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

					<CompactButton
						onClick={handleRetryPayment}
						variant="ghost"
						size="lg"
						icon={<FiRotateCcw className="w-5 h-5" />}
						className="bg-gradient-to-r from-orange-500 to-pink-500 text-white"
					>
						Thử lại thanh toán
					</CompactButton>
				</motion.div>
			</div>
		</div>
	);
}
