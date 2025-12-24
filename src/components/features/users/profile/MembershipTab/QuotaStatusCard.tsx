// src/components/features/users/profile/MembershipTab/QuotaStatusCard.tsx
'use client';

import React from 'react';
import { FiRefreshCw, FiTrendingUp } from 'react-icons/fi';
import { MembershipInfo } from './index';
import CompactButton from '@/components/ui/CompactButton';

interface QuotaStatusCardProps {
	quota?: MembershipInfo['quota'];
}

export default function QuotaStatusCard({ quota }: QuotaStatusCardProps) {
	if (!quota) return null;

	const isFree = quota.type === 'FREE';

	// Calculate progress percentage
	const progressPercentage =
		(quota.currentUsed / (quota.totalQuota || 1)) * 100;

	// Format date
	const formatDate = (dateString: string | null) => {
		if (!dateString) return 'N/A';
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
	};

	// Calculate days remaining
	const getDaysRemaining = (dateString: string | null) => {
		if (!dateString) return null;
		const targetDate = new Date(dateString);
		const today = new Date();
		const diffTime = targetDate.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > 0 ? diffDays : 0;
	};

	// Get card style based on type
	const getCardStyle = () => {
		if (isFree) {
			return {
				gradient: 'from-gray-50 to-gray-100/50',
				border: 'border-gray-200',
				badge: 'bg-gray-100 text-gray-700',
				icon: '🆓',
				title: 'GÓI MIỄN PHÍ',
			};
		}

		switch (quota.membershipType) {
			case 'VIP':
				return {
					gradient: 'from-purple-50 to-pink-50',
					border: 'border-purple-200',
					badge: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
					icon: '👑',
					title: 'GÓI VIP',
				};
			case 'PREMIUM':
				return {
					gradient: 'from-yellow-50 to-orange-50',
					border: 'border-yellow-200',
					badge: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
					icon: '⭐',
					title: 'GÓI PREMIUM',
				};
			case 'BASIC':
				return {
					gradient: 'from-blue-50 to-cyan-50',
					border: 'border-blue-200',
					badge: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
					icon: '📦',
					title: 'GÓI CƠ BẢN',
				};
			default:
				return {
					gradient: 'from-gray-50 to-gray-100/50',
					border: 'border-gray-200',
					badge: 'bg-gray-100 text-gray-700',
					icon: '📦',
					title: 'GÓI THÀNH VIÊN',
				};
		}
	};

	const style = getCardStyle();
	const daysRemaining = isFree
		? getDaysRemaining(quota.resetAt)
		: getDaysRemaining(quota.expiresAt);

	return (
		<div
			className={`bg-gradient-to-br ${style.gradient} rounded-xl p-5 border-2 ${style.border} transition-all duration-300 hover:shadow-md`}
		>
			{/* Header */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<span className="text-2xl">{style.icon}</span>
					<span
						className={`px-3 py-1 ${style.badge} rounded-full text-xs font-bold tracking-wide`}
					>
						{style.title}
					</span>
				</div>
				{!isFree && daysRemaining !== null && (
					<span className="text-xs font-semibold text-gray-600">
						Còn {daysRemaining} ngày
					</span>
				)}
			</div>

			{/* Progress Bar */}
			<div className="mb-4">
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-semibold text-gray-700">
						Bài đã đăng
					</span>
					<span className="text-sm font-bold text-gray-900">
						{quota.currentUsed}/{quota.totalQuota}
					</span>
				</div>

				{/* Progress bar */}
				<div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
					<div
						className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
							isFree
								? 'bg-gradient-to-r from-emerald-500 to-teal-500'
								: 'bg-gradient-to-r from-blue-500 to-cyan-500'
						}`}
						style={{
							width: `${Math.min(progressPercentage, 100)}%`,
						}}
					/>
				</div>
			</div>

			{/* Info */}
			<div className="space-y-2">
				{/* Remaining quota */}
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-600 font-medium">Còn lại:</span>
					<span className="font-bold text-emerald-600">
						{quota.remaining} bài
					</span>
				</div>

				{/* Reset/Expire date */}
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-600 font-medium">
						{isFree ? 'Reset vào:' : 'Hết hạn:'}
					</span>
					<span className="font-semibold text-gray-900">
						{formatDate(isFree ? quota.resetAt : quota.expiresAt)}
					</span>
				</div>
			</div>
		</div>
	);
}
