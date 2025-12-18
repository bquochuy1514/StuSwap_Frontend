// src/components/features/users/profile/MembershipTab/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAward } from 'react-icons/fi';
import QuotaStatusCard from './QuotaStatusCard';
import StatsCard from './StatsCard';
import UpgradeCard from './UpgradeCard';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { getMembershipInfo } from '@/lib/api/userApi';
import { toast } from '@/components/ui/Toast';

export interface MembershipInfo {
	quota: {
		type: 'FREE' | 'MEMBERSHIP';
		membershipType: 'BASIC' | 'PREMIUM' | 'VIP' | null;
		currentUsed: number;
		totalQuota: number | null; // null = unlimited
		remaining: number | null; // null = unlimited
		resetAt: string | null; // cho FREE
		expiresAt: string | null; // cho MEMBERSHIP
	};
	stats: {
		totalPosts: number;
		activePosts: number;
		expiredPosts: number;
	};
}

export default function MembershipTab() {
	const [membershipInfo, setMembershipInfo] = useState<MembershipInfo | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchMembershipInfo();
	}, []);

	const fetchMembershipInfo = async () => {
		try {
			setIsLoading(true);
			const data = await getMembershipInfo();
			setMembershipInfo(data);
		} catch (error) {
			console.error('Error fetching membership info:', error);
			toast.error('Không thể tải thông tin gói thành viên');
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<motion.div
				key="membership"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				exit={{ opacity: 0, x: -20 }}
				transition={{ duration: 0.2 }}
				className="bg-white shadow-lg rounded-2xl p-6 relative min-h-[400px]"
			>
				<LoadingOverlay isVisible={true} message="Đang tải..." />
			</motion.div>
		);
	}

	return (
		<motion.div
			key="membership"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.2 }}
			className="bg-white shadow-lg rounded-2xl p-6"
		>
			{/* Header */}
			<div className="flex items-start gap-3 mb-6">
				<div className="p-2.5 bg-emerald-100 rounded-xl">
					<FiAward className="w-5 h-5 text-emerald-600" />
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						Gói thành viên
					</h2>
					<p className="text-sm text-gray-500">
						Quản lý gói thành viên và quota đăng bài
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-4">
				{/* Quota Status */}
				<QuotaStatusCard quota={membershipInfo?.quota} />

				{/* Stats */}
				<StatsCard stats={membershipInfo?.stats} />

				{/* Upgrade CTA */}
				<UpgradeCard currentType={membershipInfo?.quota.type} />
			</div>
		</motion.div>
	);
}
