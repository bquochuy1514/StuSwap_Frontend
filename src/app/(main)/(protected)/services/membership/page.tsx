'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
	FiArrowLeft,
	FiCheck,
	FiZap,
	FiAlertCircle,
	FiCalendar,
	FiFileText,
	FiAward,
	FiActivity,
	FiEdit3,
	FiUnlock,
} from 'react-icons/fi';
import api from '@/lib/api/axiosInstance';
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
	extend_days: null;
	membership_days: number;
	max_posts: number;
	membership_type: 'BASIC' | 'PREMIUM' | 'VIP';
	created_at: string;
	updated_at: string;
}

const formatPrice = (price: number) => {
	return new Intl.NumberFormat('vi-VN', {
		style: 'currency',
		currency: 'VND',
	}).format(price);
};

// Helper function to get package styling based on membership type
const getMembershipStyle = (membershipType: 'BASIC' | 'PREMIUM' | 'VIP') => {
	switch (membershipType) {
		case 'VIP':
			return {
				icon: '👑',
				gradient: 'from-yellow-500 via-amber-500 to-orange-500',
				bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
				borderColor: 'border-yellow-400',
				shadowColor: 'shadow-yellow-200',
				badgeColor: 'from-yellow-500 to-orange-500',
			};
		case 'PREMIUM':
			return {
				icon: '⭐',
				gradient: 'from-purple-500 via-pink-500 to-rose-500',
				bgGradient: 'from-purple-50 via-pink-50 to-rose-50',
				borderColor: 'border-purple-400',
				shadowColor: 'shadow-purple-200',
				badgeColor: 'from-purple-500 to-pink-500',
			};
		default:
			return {
				icon: '🎯',
				gradient: 'from-blue-500 via-cyan-500 to-teal-500',
				bgGradient: 'from-blue-50 via-cyan-50 to-teal-50',
				borderColor: 'border-blue-400',
				shadowColor: 'shadow-blue-200',
				badgeColor: 'from-blue-500 to-teal-500',
			};
	}
};

// Helper function to get package features based on membership type
const getPackageFeatures = (pkg: Package) => {
	const baseFeatures = [
		`Đăng tối đa ${pkg.max_posts} tin/${pkg.membership_days} ngày`,
	];

	switch (pkg.membership_type) {
		case 'BASIC':
			return [...baseFeatures];
		case 'PREMIUM':
			return [
				...baseFeatures,
				'Đăng được nhiều tin hơn, giá rẻ hơn so với gói cơ bản',
				...(pkg.membership_days === 90
					? ['Tiết kiệm hơn so với gói tháng']
					: []),
			];
		case 'VIP':
			return [
				...baseFeatures,
				'Đăng được nhiều tin hơn, giá rẻ hơn so với gói premium',
				'Phù hợp cho người bán có nhu cầu đăng tin thường xuyên',
			];
		default:
			return baseFeatures;
	}
};

// Helper to determine if package is popular
const isPopularPackage = (pkg: Package) => {
	return pkg.membership_type === 'PREMIUM' && pkg.membership_days === 30;
};

// Helper to calculate savings
const getSavingsPercentage = (pkg: Package) => {
	if (pkg.membership_type === 'PREMIUM' && pkg.membership_days === 90) {
		return '33%';
	}
	return null;
};

export default function MembershipPage() {
	const router = useRouter();

	const [packages, setPackages] = useState<Package[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const packagesResponse = await api.get(
				'/api/packages?package_type=MEMBERSHIP'
			);

			// Sort packages by membership_type priority and membership_days
			const sortedPackages = packagesResponse.data.sort(
				(a: Package, b: Package) => {
					const typeOrder = { BASIC: 1, PREMIUM: 2, VIP: 3 };
					if (
						typeOrder[a.membership_type] !==
						typeOrder[b.membership_type]
					) {
						return (
							typeOrder[a.membership_type] -
							typeOrder[b.membership_type]
						);
					}
					return a.membership_days - b.membership_days;
				}
			);
			setPackages(sortedPackages);
		} catch (error) {
			toast.error('Không thể tải thông tin gói membership');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePurchase = async (packageId: string) => {
		// Navigate to payment confirmation page
		router.push(`/services/membership/payment?packageId=${packageId}`);
	};

	if (isLoading) {
		return (
			<LoadingOverlay isVisible={true} message="Đang tải thông tin..." />
		);
	}

	return (
		<div className="min-h-screen py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-purple-50/30">
			<div className="max-w-7xl mx-auto">
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
						<FiUnlock className="w-6 h-6 text-white" />
					</motion.div>
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5"
					>
						Nâng Cấp Tài Khoản
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto"
					>
						Trở thành thành viên để mở khóa nhiều tính năng độc
						quyền và tăng hiệu quả bán hàng của bạn!
					</motion.p>
				</div>

				{/* Benefits Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4 sm:mb-5 border border-purple-100"
				>
					<div className="flex items-start gap-2.5 mb-3">
						<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
							<FiZap className="w-4 h-4 text-white" />
						</div>
						<div>
							<h3 className="text-base font-bold text-gray-900 mb-0.5">
								Tại sao nên nâng cấp tài khoản?
							</h3>
							<p className="text-xs text-gray-600 leading-relaxed">
								Thành viên của chúng tôi có khả năng bán hàng
								nhanh hơn gấp 3 lần so với tài khoản thường.
								Đăng nhiều tin hơn, tiếp cận nhiều khách hàng
								hơn, bán hàng hiệu quả hơn!
							</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
									<FiFileText className="w-3.5 h-3.5 text-blue-600" />
								</div>
								<h4 className="text-sm font-bold text-gray-900">
									Đăng Nhiều Tin
								</h4>
							</div>
							<p className="text-xs text-gray-600 leading-relaxed">
								Tăng giới hạn đăng tin từ{' '}
								<span className="font-semibold">
									15 lên 200 tin/tháng
								</span>
								. Tối ưu cơ hội tiếp cận khách hàng.
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
									<FiActivity className="w-3.5 h-3.5 text-purple-600" />
								</div>
								<h4 className="text-sm font-bold text-gray-900">
									Hiển Thị Ổn Định
								</h4>
							</div>

							<p className="text-xs text-gray-600 leading-relaxed">
								Tin của thành viên được{' '}
								<span className="font-semibold">
									hiển thị ổn định hơn
								</span>{' '}
								nhờ khả năng đăng nhiều tin và duy trì sự xuất
								hiện thường xuyên trên hệ thống.
							</p>
						</div>

						<div className="bg-white/80 backdrop-blur-sm rounded-lg p-3">
							<div className="flex items-center gap-1.5 mb-1.5">
								<div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
									<FiEdit3 className="w-3.5 h-3.5 text-amber-600" />
								</div>
								<h4 className="text-sm font-bold text-gray-900">
									Quản Lý Tin Hiệu Quả
								</h4>
							</div>

							<p className="text-xs text-gray-600 leading-relaxed">
								<span className="font-semibold">
									Dễ dàng quản lý, chỉnh sửa và gia hạn tin
									đăng,
								</span>{' '}
								giúp bạn chủ động kiểm soát hoạt động bán hàng
								của mình.
							</p>
						</div>
					</div>
				</motion.div>

				{/* Packages Grid */}
				<div className="mb-4">
					<h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-1.5">
						<FiAward className="w-5 h-5 text-purple-600" />
						Chọn gói phù hợp với bạn
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
						{packages.map((pkg, index) => {
							const style = getMembershipStyle(
								pkg.membership_type
							);
							const features = getPackageFeatures(pkg);
							const isPopular = isPopularPackage(pkg);
							const savings = getSavingsPercentage(pkg);

							return (
								<motion.div
									key={pkg.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									className="relative"
								>
									{/* Popular Badge */}
									{isPopular && (
										<div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
											<span className="px-2.5 py-0.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full shadow-lg">
												PHỔ BIẾN NHẤT
											</span>
										</div>
									)}

									{/* Savings Badge */}
									{savings && (
										<div className="absolute -top-2 -right-2 z-10">
											<div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
												Tiết kiệm {savings}
											</div>
										</div>
									)}

									<div
										className={`bg-white rounded-lg border-2 ${
											style.borderColor
										} ${
											style.shadowColor
										} shadow-lg p-3.5 hover:scale-[1.02] transition-all duration-300 cursor-pointer h-full flex flex-col ${
											selectedPackage === pkg.id
												? 'ring-4 ring-offset-2 ring-opacity-50'
												: ''
										} ${isPopular ? 'border-4' : ''}`}
										onClick={() =>
											setSelectedPackage(pkg.id)
										}
									>
										{/* Package Header */}
										<div className="text-center mb-3">
											<div
												className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center text-2xl shadow-md mx-auto mb-2`}
											>
												{style.icon}
											</div>
											<h3 className="text-base font-bold text-gray-900 mb-0.5">
												{pkg.display_name}
											</h3>
											<p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
												<FiCalendar className="w-3 h-3" />
												{pkg.membership_days} ngày
											</p>
										</div>

										{/* Price */}
										<div className="text-center pb-3 border-b border-gray-100 mb-3">
											<div className="flex items-end justify-center gap-1.5">
												<span
													className={`text-2xl font-bold bg-gradient-to-r ${style.gradient} text-transparent bg-clip-text`}
												>
													{formatPrice(
														parseFloat(pkg.price)
													)}
												</span>
											</div>
											<p className="text-[10px] text-gray-500 mt-0.5">
												~
												{Math.round(
													parseFloat(pkg.price) /
														pkg.max_posts
												).toLocaleString('vi-VN')}
												đ/tin
											</p>
										</div>

										{/* Features */}
										<div className="flex-1 mb-3">
											<ul className="space-y-1.5">
												{features.map(
													(feature, idx) => (
														<li
															key={idx}
															className="flex items-start gap-1.5 text-xs text-gray-700"
														>
															<FiCheck className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
															<span>
																{feature}
															</span>
														</li>
													)
												)}
											</ul>
										</div>

										{/* Select Button */}
										<motion.button
											whileHover={{ scale: 1.02 }}
											whileTap={{ scale: 0.98 }}
											onClick={() =>
												setSelectedPackage(pkg.id)
											}
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
					transition={{ delay: 0.9 }}
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
									• Gói membership có hiệu lực ngay sau khi
									thanh toán thành công
								</li>
								<li>
									• Không thể hoàn tiền sau khi đã kích hoạt
								</li>
								<li>
									• Có thể nâng cấp lên gói cao hơn bất kỳ lúc
									nào
								</li>
								<li>
									• Thời hạn sẽ được cộng dồn khi gia hạn cùng
									loại gói
								</li>
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
								selectedPackage &&
								handlePurchase(selectedPackage)
							}
							disabled={!selectedPackage || isProcessing}
							size="md"
							fullWidth
						>
							{isProcessing
								? 'Đang xử lý...'
								: 'Xác nhận nâng cấp'}
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
