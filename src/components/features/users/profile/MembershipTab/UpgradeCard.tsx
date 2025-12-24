// src/components/features/users/profile/MembershipTab/UpgradeCard.tsx
'use client';

import React from 'react';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import CompactButton from '@/components/ui/CompactButton';

interface UpgradeCardProps {
	currentType?: 'FREE' | 'MEMBERSHIP';
}

export default function UpgradeCard({ currentType }: UpgradeCardProps) {
	const router = useRouter();

	const benefits = [
		'Đăng nhiều tin hơn mỗi tháng',
		'Tin được ưu tiên hiển thị',
		'Không giới hạn với gói VIP',
		'Hỗ trợ khách hàng ưu tiên',
	];

	const handleUpgrade = () => {
		router.push('/services/membership'); // Chuyển đến trang packages
	};

	return (
		<div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 rounded-xl p-6 border-2 border-purple-200">
			<div className="flex items-start gap-3 mb-4">
				<span className="text-3xl">💎</span>
				<div>
					<h3 className="text-xl font-bold text-gray-900 mb-1">
						Nâng cấp gói thành viên
					</h3>
					<p className="text-sm text-gray-600">
						Mở khóa nhiều tính năng độc quyền
					</p>
				</div>
			</div>

			{/* Benefits list */}
			<ul className="space-y-2 mb-5">
				{benefits.map((benefit, index) => (
					<li
						key={index}
						className="flex items-start gap-2 text-sm text-gray-700"
					>
						<FiCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
						<span>{benefit}</span>
					</li>
				))}
			</ul>

			{/* CTA Button */}
			<CompactButton
				onClick={handleUpgrade}
				variant="secondary"
				fullWidth
				size="lg"
				icon={<FiArrowRight className="w-4 h-4" />}
				className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl outline-none border-none"
			>
				Xem các gói thành viên
			</CompactButton>
		</div>
	);
}
