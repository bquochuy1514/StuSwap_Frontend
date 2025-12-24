'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	CheckCircle,
	Clock,
	Package as PackageIcon,
	ArrowRight,
	MapPin,
	AlertCircle,
	Calendar,
	RefreshCw,
	ShoppingBag,
	DollarSign,
	Tag,
	Image as ImageIcon,
} from 'lucide-react';
import api from '@/lib/api/axiosInstance';
import { Product, ProductCondition } from '@/types/product';
import { handleApiError } from '@/lib/utils';
import { FiHome, FiList, FiEye } from 'react-icons/fi';
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

	// Loading state
	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 flex items-center justify-center">
				<div className="text-center">
					<div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
					<p className="text-sm text-gray-600 font-medium">
						Đang xử lý thanh toán...
					</p>
					<p className="text-xs text-gray-500 mt-1.5">
						Vui lòng đợi trong giây lát
					</p>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !packageData || !productData) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50/30 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center"
				>
					<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
						<AlertCircle className="w-8 h-8 text-red-500" />
					</div>
					<h1 className="text-xl font-bold text-gray-800 mb-1.5">
						Có lỗi xảy ra
					</h1>
					<p className="text-sm text-gray-600 mb-4">
						{error || 'Không thể tải thông tin thanh toán'}
					</p>
					<div className="space-y-2.5">
						<button
							onClick={() => window.location.reload()}
							className="w-full bg-blue-500 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
						>
							Thử lại
						</button>
						<button
							onClick={() => router.push('/')}
							className="w-full bg-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors"
						>
							Về trang chủ
						</button>
					</div>
				</motion.div>
			</div>
		);
	}

	const packageStyle = getPackageStyle(packageData.extend_days);
	const productImage = getProductImage();
	const oldExpiryTime = getOldExpiryTime();
	const newExpiryTime = productData.expire_at
		? formatDate(productData.expire_at)
		: null;
	const price = parseFloat(packageData.price);

	return (
		<div className="min-h-screen py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-green-50/30">
			<div className="max-w-6xl mx-auto">
				{/* Page Header */}
				<div className="text-center mb-4 sm:mb-5">
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ type: 'spring', stiffness: 200 }}
						className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-2.5 shadow-lg"
					>
						<CheckCircle
							className="w-6 h-6 text-white"
							strokeWidth={2.5}
						/>
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
					>
						Gia hạn thành công! 🎉
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto"
					>
						Tin đăng của bạn đã được gia hạn thêm{' '}
						{packageData.extend_days} ngày
					</motion.p>
				</div>

				{/* Main Content */}
				<div className="space-y-3 sm:space-y-4">
					{/* Success Alert */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-green-50 rounded-lg border border-green-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-2.5">
							<div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<CheckCircle className="w-4 h-4 text-green-600" />
							</div>
							<div className="flex-1">
								<h3 className="text-sm font-bold text-green-900 mb-1">
									Thanh toán thành công
								</h3>
								<p className="text-xs text-green-800 leading-relaxed">
									Tin đăng của bạn đã được gia hạn và sẽ tiếp
									tục hiển thị. Bạn có thể tiếp cận thêm nhiều
									khách hàng tiềm năng trong{' '}
									{packageData.extend_days} ngày tới.
								</p>
							</div>
						</div>
					</motion.div>

					{/* Product Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<ShoppingBag className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Tin đăng đã gia hạn
							</h2>
						</div>

						<div className="flex flex-col sm:flex-row gap-3">
							{/* Product Image */}
							<div className="w-full sm:w-24 h-32 sm:h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
								{productImage ? (
									<img
										src={productImage}
										alt={productData.title}
										className="w-full h-full object-contain"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center">
										<ImageIcon className="w-10 h-10 text-gray-300" />
									</div>
								)}
							</div>

							{/* Product Details */}
							<div className="flex-1 min-w-0">
								<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 line-clamp-2">
									{productData.title}
								</h3>
								<div className="text-lg sm:text-xl font-bold text-emerald-600 mb-2">
									{formatCurrency(productData.price)}
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
									<div className="flex items-center gap-1.5">
										<MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
										<span className="truncate">
											{productData.address.district},{' '}
											{productData.address.province}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Tag className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
										<span className="truncate">
											{productData.category.name}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
										<span className="truncate font-semibold text-green-600">
											Hết hạn:{' '}
											{formatDate(productData.expire_at)}
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<span
											className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
												productData.status ===
												'approved'
													? 'bg-green-100 text-green-700'
													: productData.status ===
													  'pending'
													? 'bg-yellow-100 text-yellow-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{productData.status === 'approved'
												? '✓ Đã duyệt'
												: productData.status ===
												  'pending'
												? '⏳ Chờ duyệt'
												: '✗ Từ chối'}
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
						transition={{ delay: 0.5 }}
						className={`bg-gradient-to-r ${packageStyle.bgGradient} rounded-lg border-2 border-opacity-50 p-3.5 sm:p-4`}
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<PackageIcon className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Thông tin gói đã mua
							</h2>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-start gap-2.5 mb-2.5">
								<div
									className={`w-10 h-10 bg-gradient-to-br ${packageStyle.gradient} rounded-lg flex items-center justify-center text-xl shadow-md flex-shrink-0`}
								>
									{packageStyle.icon}
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-gray-900 text-sm mb-0.5">
										{packageData.display_name}
									</h3>
									<p className="text-xs text-gray-600">
										{packageData.description}
									</p>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-gray-200">
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Thời gian gia hạn
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<Clock className="w-3.5 h-3.5" />+
										{packageData.extend_days} ngày
									</div>
								</div>
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Giá mỗi ngày
									</div>
									<div className="text-xs font-semibold text-gray-900">
										≈{' '}
										{formatCurrency(
											(
												price / packageData.extend_days
											).toString()
										)}
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Renewal Details */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<RefreshCw className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Chi tiết gia hạn
							</h2>
						</div>

						<div className="space-y-2">
							{oldExpiryTime && (
								<div className="flex items-center justify-between py-1.5">
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-gray-400" />
										<span className="text-xs text-gray-600">
											Ngày hết hạn cũ
										</span>
									</div>
									<span className="text-xs font-medium text-gray-700">
										{oldExpiryTime}
									</span>
								</div>
							)}

							<div className="flex items-center justify-between py-1.5">
								<span className="text-xs text-gray-600">
									Thời gian gia hạn
								</span>
								<span className="text-sm font-semibold text-gray-900">
									+{packageData.extend_days} ngày
								</span>
							</div>

							{newExpiryTime && (
								<div className="flex items-center justify-between py-1.5 bg-green-50 rounded-lg px-2.5">
									<div className="flex items-center gap-1.5">
										<Calendar className="w-3.5 h-3.5 text-green-600" />
										<span className="text-xs text-green-700 font-medium">
											Ngày hết hạn mới
										</span>
									</div>
									<span className="text-xs font-bold text-green-700">
										{newExpiryTime}
									</span>
								</div>
							)}

							<div className="flex items-center justify-between py-2 border-t-2 border-gray-300 mt-1.5">
								<span className="text-base font-bold text-gray-900">
									Số tiền đã thanh toán
								</span>
								<span className="text-xl font-bold text-green-600">
									{formatCurrency(packageData.price)}
								</span>
							</div>
						</div>
					</motion.div>

					{/* Transaction Info */}
					{orderCode && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7 }}
							className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
						>
							<div className="flex items-start gap-1.5 mb-2.5">
								<DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
								<h2 className="text-base font-bold text-gray-900">
									Thông tin giao dịch
								</h2>
							</div>
							<div className="grid sm:grid-cols-2 gap-3">
								<div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
									<span className="text-xs text-gray-500 block mb-1">
										Mã đơn hàng
									</span>
									<p className="font-mono font-semibold text-gray-900 text-sm">
										{orderCode}
									</p>
								</div>
								{paymentId && (
									<div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
										<span className="text-xs text-gray-500 block mb-1">
											Mã giao dịch
										</span>
										<p className="font-mono font-semibold text-gray-900 text-sm break-all">
											{paymentId}
										</p>
									</div>
								)}
							</div>
						</motion.div>
					)}

					{/* Benefits Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="bg-blue-50 rounded-lg border border-blue-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-2.5">
							<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
								<CheckCircle className="w-4 h-4 text-blue-600" />
							</div>
							<div className="flex-1">
								<h3 className="text-sm font-bold text-blue-900 mb-1">
									Lợi ích khi gia hạn
								</h3>
								<ul className="text-xs text-blue-800 space-y-0.5">
									<li>
										• Tin đăng tiếp tục hiển thị trong kết
										quả tìm kiếm
									</li>
									<li>
										• Tiếp cận thêm nhiều người mua tiềm
										năng
									</li>
									<li>
										• Tăng cơ hội bán được sản phẩm nhanh
										hơn
									</li>
									<li>
										• Duy trì vị trí cạnh tranh trên thị
										trường
									</li>
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9 }}
						className="flex flex-col sm:flex-row gap-2.5"
					>
						<CompactButton
							onClick={() => router.push('/')}
							variant="secondary"
							size="md"
							fullWidth
							icon={<FiHome className="w-4 h-4" />}
						>
							Về trang chủ
						</CompactButton>

						<CompactButton
							onClick={() => router.push('/my-posts')}
							variant="primary"
							size="md"
							fullWidth
							icon={<FiList className="w-4 h-4" />}
						>
							Quản lý tin đăng
						</CompactButton>

						<CompactButton
							onClick={() =>
								router.push(`/products/${productId}`)
							}
							size="md"
							fullWidth
							icon={<FiEye className="w-4 h-4" />}
							className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
						>
							Xem tin đăng
						</CompactButton>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
