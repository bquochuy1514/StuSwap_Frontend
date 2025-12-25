// app/src/(main)/(protected)/services/membership/payment/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
	FiArrowLeft,
	FiPackage,
	FiDollarSign,
	FiCalendar,
	FiClock,
	FiCreditCard,
	FiAlertCircle,
	FiUser,
	FiAward,
	FiFileText,
	FiCheck,
	FiUnlock,
} from 'react-icons/fi';
import api from '@/lib/api/axiosInstance';
import { toast } from '@/components/ui/Toast';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { handleApiError } from '@/lib/utils';
import CompactButton from '@/components/ui/CompactButton';
import { User } from '@/types/auth';

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
	extend_days: null;
	membership_days: number;
	max_posts: number;
	membership_type: 'BASIC' | 'PREMIUM' | 'VIP';
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
		hour12: false,
	});
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

const calculateExpireDate = (
	membershipDays: number,
	currentExpire?: string | null
) => {
	const now = new Date();

	// If user has active membership, add to current expiry
	if (currentExpire && new Date(currentExpire) > now) {
		const currentExpireDate = new Date(currentExpire);
		return new Date(
			currentExpireDate.getTime() + membershipDays * 24 * 60 * 60 * 1000
		);
	}

	// Otherwise, start from now
	return new Date(now.getTime() + membershipDays * 24 * 60 * 60 * 1000);
};

const getPackageFeatures = (pkg: Package) => {
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
				...(pkg.membership_days === 90
					? ['Tiết kiệm 33% so với gói tháng']
					: []),
			];
		default:
			return baseFeatures;
	}
};

export default function MembershipPaymentPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const packageId = searchParams.get('packageId');

	const [selectedPackage, setSelectedPackage] = useState<Package | null>(
		null
	);
	const [userProfile, setUserProfile] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		if (!packageId) {
			toast.error('Thông tin không hợp lệ');
			router.push('/services/membership');
			return;
		}
		fetchData();
	}, [packageId]);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const [packagesResponse, profileResponse] = await Promise.all([
				api.get('/api/packages?package_type=MEMBERSHIP'),
				api.get('/api/users/profile'),
			]);

			// Find selected package
			const pkg = packagesResponse.data.find(
				(p: Package) => p.id === packageId
			);
			if (!pkg) {
				toast.error('Không tìm thấy gói dịch vụ');
				router.push('/services/membership');
				return;
			}
			setSelectedPackage(pkg);
			setUserProfile(profileResponse.data);
		} catch (error) {
			toast.error('Không thể tải thông tin');
			console.error(error);
			router.push('/services/membership');
		} finally {
			setIsLoading(false);
		}
	};

	const handlePayment = async () => {
		if (!selectedPackage) return;

		try {
			setIsProcessing(true);

			// Call API to create payment
			const response = await api.post('/api/payments/payos/create-link', {
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
			setIsProcessing(false);
		}
	};

	if (isLoading) {
		return (
			<LoadingOverlay isVisible={true} message="Đang tải thông tin..." />
		);
	}

	if (!selectedPackage || !userProfile) {
		return null;
	}

	const style = getMembershipStyle(selectedPackage.membership_type);
	const expireDate = calculateExpireDate(
		selectedPackage.membership_days,
		userProfile.membershipExpiresAt
	);
	const price = parseFloat(selectedPackage.price);
	const features = getPackageFeatures(selectedPackage);
	const pricePerPost = Math.round(price / selectedPackage.max_posts);

	return (
		<div className="min-h-screen py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
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
						className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-2.5 shadow-lg"
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
					{/* User Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-lg shadow-sm border border-gray-200 p-3.5 sm:p-4"
					>
						<div className="flex items-start gap-1.5 mb-2.5">
							<FiUser className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
							<h2 className="text-base font-bold text-gray-900">
								Thông tin tài khoản
							</h2>
						</div>

						<div className="flex items-start gap-3">
							{/* Avatar */}
							<div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex items-center justify-center">
								{userProfile.avatar ? (
									<img
										src={userProfile.avatar}
										alt={userProfile.fullName}
										className="w-full h-full object-cover"
									/>
								) : (
									<FiUser className="w-8 h-8 text-purple-600" />
								)}
							</div>

							{/* User Details */}
							<div className="flex-1 min-w-0">
								<h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
									{userProfile.fullName}
								</h3>
								<div className="space-y-0.5 text-xs text-gray-600">
									<p className="truncate">
										{userProfile.email}
									</p>
									{userProfile.phone && (
										<p>{userProfile.phone}</p>
									)}
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
								Gói dịch vụ đã chọn
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

							<div className="grid grid-cols-2 gap-2.5 pt-2.5 border-t border-gray-200 mb-2.5">
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Thời gian
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<FiClock className="w-3.5 h-3.5" />
										{selectedPackage.membership_days} ngày
									</div>
								</div>
								<div>
									<div className="text-[10px] text-gray-500 mb-0.5">
										Số tin đăng
									</div>
									<div className="flex items-center gap-1 text-xs font-semibold text-gray-900">
										<FiFileText className="w-3.5 h-3.5" />
										{selectedPackage.max_posts} tin
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
											<FiCheck className="w-3 h-3 text-green-500 flex-shrink-0 mt-0.5" />
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

							<div className="flex items-center justify-between py-1.5 bg-blue-50 rounded-lg px-2.5">
								<span className="text-xs text-gray-600">
									Giá mỗi tin
								</span>
								<span className="text-xs font-semibold text-blue-700">
									≈ {pricePerPost.toLocaleString('vi-VN')}
									đ/tin
								</span>
							</div>

							<div className="flex items-center justify-between py-1.5 border-t border-gray-200">
								<div className="flex items-center gap-1.5">
									<FiCalendar className="w-3.5 h-3.5 text-gray-400" />
									<span className="text-xs text-gray-600">
										Hiệu lực đến
									</span>
								</div>
								<span className="text-xs font-semibold text-gray-900">
									{formatDateTime(expireDate.toISOString())}
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
										• Gói membership sẽ được kích hoạt ngay
										sau khi thanh toán thành công
									</li>
									<li>
										• Thời hạn sẽ được cộng dồn nếu bạn đã
										có gói đang hoạt động
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
