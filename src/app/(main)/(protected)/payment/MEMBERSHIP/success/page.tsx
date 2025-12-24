'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
	CheckCircle,
	Clock,
	Package,
	DollarSign,
	User as UserIcon,
	Award,
	FileText,
	Check,
	Calendar,
	AlertCircle,
	Star,
	TrendingUp,
} from 'lucide-react';
import { FiCheckCircle, FiHome, FiList, FiUser } from 'react-icons/fi';
import api from '@/lib/api/axiosInstance';
import { User } from '@/types/auth';
import { handleApiError } from '@/lib/utils';
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
	membership_days: number;
	max_posts: number;
	membership_type: 'BASIC' | 'PREMIUM' | 'VIP';
	premium_badge: boolean;
	created_at: string;
	updated_at: string;
};

const getMembershipStyle = (membershipType: 'BASIC' | 'PREMIUM' | 'VIP') => {
	switch (membershipType) {
		case 'VIP':
			return {
				icon: '👑',
				gradient: 'from-yellow-500 via-amber-500 to-orange-500',
				bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
			};
		case 'PREMIUM':
			return {
				icon: '⭐',
				gradient: 'from-purple-500 via-pink-500 to-rose-500',
				bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
			};
		default:
			return {
				icon: '🎯',
				gradient: 'from-blue-500 via-cyan-500 to-teal-500',
				bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
			};
	}
};

const getPackageFeatures = (pkg: PackageData) => {
	const baseFeatures = [
		`Đăng tối đa ${pkg.max_posts} tin/${pkg.membership_days} ngày`,
		'Giao diện quản lý tin đơn giản, dễ sử dụng',
		'Quản lý tin tập trung trong một giao diện',
	];

	switch (pkg.membership_type) {
		case 'VIP':
			return [
				...baseFeatures,
				'Phù hợp cho người bán chuyên nghiệp',
				'Tiết kiệm chi phí đăng tin đáng kể',
				'Hỗ trợ ưu tiên 24/7',
			];
		case 'PREMIUM':
			return [
				...baseFeatures,
				'Đăng nhiều tin hơn với giá tốt hơn',
				'Phù hợp cho người bán thường xuyên',
			];
		default:
			return baseFeatures;
	}
};

export default function MembershipPaymentSuccess() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [packageData, setPackageData] = useState<PackageData | null>(null);
	const [userData, setUserData] = useState<User | null>(null);

	// Get URL params from PayOS redirect
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

				if (!packageId || !orderCode) {
					throw new Error('Thiếu thông tin thanh toán');
				}

				// Fetch package and user data in parallel
				const [packageRes, userRes] = await Promise.all([
					api.get(`/api/packages/${packageId}`),
					api.get('/api/users/profile'),
				]);

				setPackageData(packageRes.data);
				setUserData(userRes.data);
			} catch (err) {
				handleApiError(err);
				setError('Không thể tải thông tin');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [packageId, orderCode, status, code]);

	// Format currency
	const formatCurrency = (value: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(parseFloat(value));
	};

	// Format date
	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	// Calculate new expiry date
	const getNewExpiryDate = () => {
		if (!userData?.membership_expire_at || !packageData) return null;
		const currentExpiry = new Date(userData.membership_expire_at);
		const now = new Date();

		// If membership already expired, start from now
		const startDate = currentExpiry > now ? currentExpiry : now;

		const newExpiry = new Date(startDate);
		newExpiry.setDate(newExpiry.getDate() + packageData.membership_days);

		return formatDateTime(newExpiry.toISOString());
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
	if (error || !packageData || !userData) {
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

	const packageStyle = getMembershipStyle(packageData.membership_type);
	const price = parseFloat(packageData.price);
	const features = getPackageFeatures(packageData);
	const pricePerPost = Math.round(price / packageData.max_posts);
	const newExpiryDate = getNewExpiryDate();

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
						Nâng cấp thành công! 🎉
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto"
					>
						Chúc mừng! Tài khoản của bạn đã được nâng cấp thành công
					</motion.p>
				</div>

				{/* Main Content */}
				<div className="space-y-3 sm:space-y-4">
					{/* Success Alert Box */}
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
									Giao dịch hoàn tất
								</h3>
								<ul className="text-xs text-green-800 space-y-0.5">
									<li>
										• Membership đã được kích hoạt thành
										công
									</li>
									<li>
										• Bạn có thể đăng tối đa{' '}
										{packageData.max_posts} tin trong{' '}
										{packageData.membership_days} ngày
									</li>
									<li>
										• Tận hưởng tất cả quyền lợi của gói{' '}
										{packageData.membership_type}
									</li>
									{newExpiryDate && (
										<li>
											• Hiệu lực đến:{' '}
											<span className="font-semibold">
												{newExpiryDate}
											</span>
										</li>
									)}
								</ul>
							</div>
						</div>
					</motion.div>

					{/* User Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<UserIcon className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Thông tin tài khoản
							</h2>
						</div>

						<div className="flex items-start gap-3">
							{/* Avatar */}
							<div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex items-center justify-center">
								{userData.avatar ? (
									<img
										src={userData.avatar}
										alt={userData.fullName}
										className="w-full h-full object-cover"
									/>
								) : (
									<UserIcon className="w-8 h-8 text-purple-600" />
								)}
							</div>

							{/* User Details */}
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-sm sm:text-base font-bold text-gray-900">
										{userData.fullName}
									</h3>
									<span
										className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${packageStyle.gradient}`}
									>
										{packageData.membership_type}
									</span>
								</div>
								<div className="space-y-0.5 text-xs text-gray-600 mb-2">
									<p className="truncate">{userData.email}</p>
									{userData.phone && <p>{userData.phone}</p>}
								</div>
								{newExpiryDate && (
									<div className="flex items-center gap-1.5 bg-green-50 rounded-lg px-2 py-1.5">
										<Calendar className="w-3.5 h-3.5 text-green-600" />
										<span className="text-xs text-green-700 font-semibold">
											Membership đến: {newExpiryDate}
										</span>
									</div>
								)}
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
							<Package className="w-4 h-4 text-gray-900 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Gói đã mua
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

							<div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-gray-200 mb-2.5">
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Thời gian
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<Clock className="w-3.5 h-3.5" />
										{packageData.membership_days} ngày
									</div>
								</div>
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Số tin đăng
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<FileText className="w-3.5 h-3.5" />
										{packageData.max_posts} tin
									</div>
								</div>
							</div>

							{/* Features List */}
							<div className="pt-2.5 border-t border-gray-200">
								<p className="text-[10px] text-gray-500 mb-1.5 font-semibold">
									Quyền lợi của gói:
								</p>
								<ul className="space-y-1">
									{features.map((feature, idx) => (
										<li
											key={idx}
											className="flex items-start gap-1.5 text-xs text-gray-700"
										>
											<Check className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
											<span className="leading-relaxed">
												{feature}
											</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</motion.div>

					{/* Payment Details */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<DollarSign className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Chi tiết thanh toán
							</h2>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between py-1.5 bg-gray-50 rounded-lg px-2.5">
								<span className="text-xs text-gray-600">
									Mã đơn hàng
								</span>
								<span className="text-xs font-mono font-semibold text-gray-900">
									{orderCode}
								</span>
							</div>

							{paymentId && (
								<div className="flex items-center justify-between py-1.5 bg-gray-50 rounded-lg px-2.5">
									<span className="text-xs text-gray-600">
										Mã giao dịch
									</span>
									<span className="text-xs font-mono font-semibold text-gray-900 truncate ml-2">
										{paymentId}
									</span>
								</div>
							)}

							<div className="flex items-center justify-between py-1.5">
								<span className="text-xs text-gray-600">
									Số tiền
								</span>
								<span className="text-sm font-semibold text-gray-900">
									{formatCurrency(packageData.price)}
								</span>
							</div>

							<div className="flex items-center justify-between py-1.5 bg-blue-50 rounded-lg px-2.5">
								<span className="text-xs text-gray-600">
									Giá mỗi tin
								</span>
								<span className="text-xs font-semibold text-blue-700">
									≈ {pricePerPost.toLocaleString('vi-VN')}
									đ/tin
								</span>
							</div>

							<div className="flex items-center justify-between py-1.5 bg-green-50 rounded-lg px-2.5">
								<div className="flex items-center gap-1.5">
									<CheckCircle className="w-3.5 h-3.5 text-green-600" />
									<span className="text-xs text-green-700 font-medium">
										Trạng thái
									</span>
								</div>
								<span className="text-xs font-bold text-green-700">
									Đã thanh toán
								</span>
							</div>
						</div>
					</motion.div>

					{/* Benefits Highlight */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
						className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-2.5 mb-3">
							<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
								<Star className="w-4 h-4 text-white" />
							</div>
							<div className="flex-1">
								<h3 className="text-sm font-bold text-purple-900 mb-1">
									🎊 Chúc mừng bạn đã trở thành thành viên!
								</h3>
								<p className="text-xs text-purple-800 leading-relaxed">
									Bây giờ bạn có thể tận hưởng tất cả các
									quyền lợi của gói{' '}
									<span className="font-semibold">
										{packageData.membership_type}
									</span>
									. Hãy bắt đầu đăng tin và tăng cơ hội bán
									hàng của bạn ngay!
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
							<div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5">
								<div className="flex items-center gap-1.5 mb-1">
									<FileText className="w-3.5 h-3.5 text-purple-600" />
									<h4 className="text-xs font-bold text-gray-900">
										Đăng nhiều tin
									</h4>
								</div>
								<p className="text-[10px] text-gray-600 leading-relaxed">
									Tối đa {packageData.max_posts} tin trong{' '}
									{packageData.membership_days} ngày
								</p>
							</div>

							<div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5">
								<div className="flex items-center gap-1.5 mb-1">
									<TrendingUp className="w-3.5 h-3.5 text-blue-600" />
									<h4 className="text-xs font-bold text-gray-900">
										Tiếp cận tốt hơn
									</h4>
								</div>
								<p className="text-[10px] text-gray-600 leading-relaxed">
									Tăng khả năng hiển thị và tiếp cận khách
									hàng
								</p>
							</div>

							<div className="bg-white/70 backdrop-blur-sm rounded-lg p-2.5">
								<div className="flex items-center gap-1.5 mb-1">
									<Award className="w-3.5 h-3.5 text-amber-600" />
									<h4 className="text-xs font-bold text-gray-900">
										Quản lý dễ dàng
									</h4>
								</div>
								<p className="text-[10px] text-gray-600 leading-relaxed">
									Giao diện tập trung, chỉnh sửa linh hoạt
								</p>
							</div>
						</div>
					</motion.div>

					{/* Next Steps */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<h2 className="text-base font-bold text-gray-800 mb-2.5">
							Bắt đầu ngay
						</h2>
						<div className="grid sm:grid-cols-2 gap-3">
							<div className="p-3 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-colors cursor-pointer">
								<div className="flex items-center gap-1.5 mb-1.5">
									<FileText className="w-4 h-4 text-blue-500" />
									<h3 className="text-sm font-semibold text-gray-800">
										Đăng tin mới
									</h3>
								</div>
								<p className="text-xs text-gray-600">
									Tạo tin đăng mới và tận dụng quyền lợi
									membership
								</p>
							</div>
							<div className="p-3 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors cursor-pointer">
								<div className="flex items-center gap-1.5 mb-1.5">
									<FiList className="w-4 h-4 text-green-500" />
									<h3 className="text-sm font-semibold text-gray-800">
										Quản lý tin đăng
									</h3>
								</div>
								<p className="text-xs text-gray-600">
									Xem và quản lý tất cả các tin đăng của bạn
								</p>
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
							onClick={() => router.push('/post-product')}
							size="md"
							fullWidth
							icon={<FileText className="w-4 h-4" />}
							className="bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600"
						>
							Đăng tin ngay
						</CompactButton>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
