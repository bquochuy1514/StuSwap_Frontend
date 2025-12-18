'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	CheckCircle,
	Clock,
	Package,
	ArrowRight,
	MapPin,
	AlertCircle,
	Calendar,
	RefreshCw,
} from 'lucide-react';
import api from '@/lib/api/axiosInstance';
import { Product, ProductCondition } from '@/types/product';
import { handleApiError } from '@/lib/utils';
import { FiCheckCircle, FiHome, FiList } from 'react-icons/fi';
import CompactButton from '@/components/ui/CompactButton';
import { useRouter } from 'next/navigation';

// Types
type PackageData = {
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

export default function RenewPaymentSuccess() {
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
	const paymentId = searchParams.get('id');
	const code = searchParams.get('code');

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// Verify payment status
				if (status !== 'PAID' || code !== '00') {
					throw new Error('Thanh toán chưa hoàn tất');
				}

				if (!productId || !packageId || !orderCode) {
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
	}, [productId, packageId, orderCode, status, code]);

	// Format currency
	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(parseFloat(value));
	};

	// Format date
	const formatDate = (dateString: string) => {
		return new Intl.DateTimeFormat('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		}).format(new Date(dateString));
	};

	// Calculate old expiry time (before renewal)
	const getOldExpiryTime = () => {
		if (!productData?.expire_at || !packageData?.extend_days) return null;
		const newExpiry = new Date(productData.expire_at);
		const oldExpiry = new Date(newExpiry);
		oldExpiry.setDate(oldExpiry.getDate() - packageData.extend_days);
		return formatDate(oldExpiry.toISOString());
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

	// Get full address
	const getFullAddress = () => {
		if (!productData?.address) return 'Chưa cập nhật';
		const { specificAddress, ward, district, province } =
			productData.address;
		const parts = [specificAddress, ward, district, province].filter(
			Boolean
		);
		return parts.length > 0 ? parts.join(', ') : 'Chưa cập nhật';
	};

	// Get package styling
	const getPackageStyle = () => {
		if (!packageData)
			return { icon: '🔄', color: 'from-green-400 to-emerald-500' };

		const days = packageData.extend_days;
		if (days >= 30) {
			return { icon: '💎', color: 'from-purple-400 to-indigo-500' };
		}
		if (days >= 15) {
			return { icon: '⭐', color: 'from-amber-400 to-orange-500' };
		}
		return { icon: '🔄', color: 'from-green-400 to-emerald-500' };
	};

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 font-medium">
						Đang xử lý thanh toán...
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
						<AlertCircle className="w-10 h-10 text-red-500" />
					</div>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">
						Có lỗi xảy ra
					</h1>
					<p className="text-gray-600 mb-6">
						{error || 'Không thể tải thông tin thanh toán'}
					</p>
					<div className="space-y-3">
						<button
							onClick={() => window.location.reload()}
							className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
						>
							Thử lại
						</button>
						<button
							onClick={() => (window.location.href = '/')}
							className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
						>
							Về trang chủ
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

	const packageStyle = getPackageStyle();
	const productImage = getProductImage();
	const oldExpiryTime = getOldExpiryTime();
	const newExpiryTime = productData.expire_at
		? formatDate(productData.expire_at)
		: null;

	return (
		<div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-12 px-4">
			<div className="max-w-4xl mx-auto">
				{/* Success Header */}
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
						Gia hạn thành công! 🎉
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto"
					>
						Tin đăng của bạn đã được gia hạn thêm{' '}
						{packageData.extend_days} ngày
					</motion.p>
				</div>

				{/* Main Content */}
				<div className="grid md:grid-cols-2 gap-6 mb-6">
					{/* Package Info Card */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-2xl shadow-xl p-6"
					>
						<div className="flex items-center gap-3 mb-4">
							<div
								className={`w-12 h-12 bg-gradient-to-br ${packageStyle.color} rounded-xl flex items-center justify-center shadow-md text-2xl`}
							>
								{packageStyle.icon}
							</div>
							<div>
								<h2 className="text-sm text-gray-500">
									Gói đã mua
								</h2>
								<p className="text-xl font-bold text-gray-800">
									{packageData.display_name}
								</p>
							</div>
						</div>

						<div className="space-y-3">
							<div className="flex justify-between items-center py-2 border-b border-gray-100">
								<span className="text-gray-600 flex items-center gap-1">
									<RefreshCw className="w-4 h-4" />
									Thời gian gia hạn:
								</span>
								<span className="font-semibold text-gray-800">
									+{packageData.extend_days} ngày
								</span>
							</div>

							{oldExpiryTime && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-gray-600 flex items-center gap-1">
										<Clock className="w-4 h-4" />
										Hạn cũ:
									</span>
									<span className="font-medium text-gray-600 text-sm">
										{oldExpiryTime}
									</span>
								</div>
							)}

							{newExpiryTime && (
								<div className="flex justify-between items-center py-2 border-b border-gray-100">
									<span className="text-gray-600 flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										Hạn mới:
									</span>
									<span className="font-semibold text-green-600 text-sm">
										{newExpiryTime}
									</span>
								</div>
							)}

							<div className="flex justify-between items-center py-3 pt-4">
								<span className="text-gray-600 font-medium">
									Số tiền:
								</span>
								<span className="text-2xl font-bold text-green-600">
									{formatCurrency(packageData.price)}
								</span>
							</div>
						</div>

						<div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
							<p className="text-sm text-gray-700 leading-relaxed">
								{packageData.description}
							</p>
						</div>
					</motion.div>

					{/* Product Info Card */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-2xl shadow-xl p-6"
					>
						<h2 className="text-sm text-gray-500 mb-4 font-medium">
							Tin đăng đã gia hạn
						</h2>

						{productImage && (
							<div className="mb-4 rounded-xl overflow-hidden shadow-md">
								<img
									src={productImage}
									alt={productData.title}
									className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
								/>
							</div>
						)}

						<h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
							{productData.title}
						</h3>

						<div className="space-y-2 mb-4">
							<div className="flex justify-between items-center">
								<span className="text-gray-600">Giá bán:</span>
								<span className="text-lg font-bold text-emerald-600">
									{formatCurrency(productData.price)}
								</span>
							</div>

							<div className="flex justify-between items-center">
								<span className="text-gray-600">
									Tình trạng:
								</span>
								<span className="font-semibold text-gray-800">
									{getConditionLabel(productData.condition)}
								</span>
							</div>

							<div className="flex justify-between items-center">
								<span className="text-gray-600">
									Trạng thái:
								</span>
								<span
									className={`px-3 py-1 rounded-full text-xs font-semibold ${
										productData.status === 'approved'
											? 'bg-green-100 text-green-700'
											: productData.status === 'pending'
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

							<div className="pt-2">
								<div className="flex items-start gap-2">
									<MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
									<span className="text-sm text-gray-600 line-clamp-2">
										{getFullAddress()}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Benefits Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100"
				>
					<div className="flex items-start gap-3 mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<CheckCircle className="w-5 h-5 text-white" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-1">
								Lợi ích khi gia hạn
							</h3>
							<p className="text-sm text-gray-600 leading-relaxed">
								Tin đăng của bạn sẽ tiếp tục hiển thị và tiếp
								cận được nhiều khách hàng hơn
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
									<span className="text-lg">👁️</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Tiếp tục hiển thị
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Tin đăng vẫn xuất hiện trong kết quả tìm kiếm
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<span className="text-lg">👥</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Tăng lượt xem
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Tiếp cận thêm nhiều người mua tiềm năng
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
									<span className="text-lg">💰</span>
								</div>
								<h4 className="font-bold text-gray-900 text-sm">
									Bán nhanh hơn
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Tăng cơ hội bán được sản phẩm
							</p>
						</div>
					</div>
				</motion.div>

				{/* Order Info */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className="bg-white rounded-2xl shadow-xl p-6 mb-6"
				>
					<h2 className="text-lg font-bold text-gray-800 mb-4">
						Thông tin đơn hàng
					</h2>
					<div className="grid md:grid-cols-3 gap-4">
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
								Mã giao dịch
							</span>
							<p className="font-mono font-semibold text-gray-800 text-sm break-all">
								{paymentId}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<span className="text-xs text-gray-500 block mb-1">
								Trạng thái
							</span>
							<p className="font-semibold text-green-600 text-sm flex items-center gap-1">
								<CheckCircle className="w-4 h-4" />
								Đã thanh toán
							</p>
						</div>
					</div>
				</motion.div>

				{/* Action Buttons */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
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
						onClick={() => router.push(`/products/${productId}`)}
						variant="ghost"
						size="lg"
						icon={<ArrowRight className="w-5 h-5" />}
						className="bg-gradient-to-r from-green-500 to-emerald-500 text-white"
					>
						Xem tin đăng
					</CompactButton>
				</motion.div>
			</div>
		</div>
	);
}
