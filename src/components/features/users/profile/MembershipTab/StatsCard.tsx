// src/components/features/users/profile/MembershipTab/StatsCard.tsx
'use client';

import React from 'react';
import { FiFileText, FiCheckCircle, FiClock } from 'react-icons/fi';
import { MembershipInfo } from './index';

interface StatsCardProps {
	stats?: MembershipInfo['stats'];
}

export default function StatsCard({ stats }: StatsCardProps) {
	if (!stats) return null;

	const statItems = [
		{
			icon: <FiFileText className="w-5 h-5" />,
			label: 'Tổng bài đã đăng',
			value: stats.totalPosts,
			color: 'from-blue-500 to-cyan-500',
			bgColor: 'bg-blue-50/50',
		},
		{
			icon: <FiCheckCircle className="w-5 h-5" />,
			label: 'Bài đang hoạt động',
			value: stats.activePosts,
			color: 'from-emerald-500 to-teal-500',
			bgColor: 'bg-emerald-50/50',
		},
		{
			icon: <FiClock className="w-5 h-5" />,
			label: 'Bài hết hạn',
			value: stats.expiredPosts,
			color: 'from-gray-500 to-gray-600',
			bgColor: 'bg-gray-50',
		},
	];

	return (
		<div className="bg-white rounded-xl p-5 border-2 border-gray-200">
			<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
				📊 Thống kê hoạt động
			</h3>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{statItems.map((item, index) => (
					<div
						key={index}
						className={`${item.bgColor} rounded-lg p-4 border border-gray-200/50 hover:shadow-md transition-all duration-200`}
					>
						<div className="flex items-center gap-3">
							<div
								className={`flex-shrink-0 p-2.5 bg-gradient-to-br ${item.color} text-white rounded-lg`}
							>
								{item.icon}
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-2xl font-bold text-gray-900 leading-none mb-1">
									{item.value}
								</p>
								<p className="text-xs font-medium text-gray-600 leading-tight">
									{item.label}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
