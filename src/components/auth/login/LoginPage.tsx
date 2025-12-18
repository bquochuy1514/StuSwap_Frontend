'use client';

import HomeButton from '@/components/ui/HomeButton';
import AuthHeader from '../AuthHeader';
import Divider from '@/components/ui/Divider';
import SocialLogin from '../SocialLogin';
import AuthRedirect from '../AuthRedirect';
import LoginForm from './LoginForm';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from '@/components/ui/Toast';
import { FiTag, FiShield, FiStar } from 'react-icons/fi';

export default function LoginPage() {
	const searchParams = useSearchParams();
	const hasRedirected = useRef(false);

	useEffect(() => {
		if (!hasRedirected.current) {
			hasRedirected.current = true;
			const error = searchParams.get('error');
			if (error) {
				if (error === 'invalid_email') {
					toast.error('Email phải có .edu hoặc .edu.vn');
				} else {
					toast.error('Đăng nhập thất bại, vui lòng thử lại!');
				}
			}
		}
	}, [searchParams]);

	const features = [
		{
			icon: <FiStar className="w-5 h-5" />,
			title: 'Dự Án Cá Nhân Của Sinh Viên',
			description:
				'StudentSwap được xây dựng như một side-project của sinh viên UIT, hoàn toàn phi thương mại.',
			gradient: 'from-indigo-500 to-purple-500',
		},
		{
			icon: <FiShield className="w-5 h-5" />,
			title: 'Học Tập & Trải Nghiệm',
			description:
				'Dự án được phát triển để học hỏi, trau dồi kỹ năng và mang lại một sản phẩm hữu ích cho cộng đồng.',
			gradient: 'from-emerald-500 to-teal-500',
		},
		{
			icon: <FiTag className="w-5 h-5" />,
			title: 'Xây Dựng Vì Sinh Viên',
			description:
				'Nơi sinh viên có thể mua bán, chia sẻ đồ cũ một cách thân thiện, minh bạch và dễ tiếp cận.',
			gradient: 'from-orange-500 to-amber-500',
		},
	];

	return (
		<div className="w-full max-w-md mx-auto py-2">
			<HomeButton />

			{/* Header */}
			<AuthHeader
				title="Đăng nhập StudentSwap"
				content1="Kết nối lại với cộng đồng sinh viên"
				content2="Trao đổi, chia sẻ và tìm những món đồ phù hợp cho bạn"
				theme="light"
			/>

			{/* Login Form */}
			<LoginForm />

			{/* Divider */}
			<Divider text="Hoặc đăng nhập với" />

			{/* Social Login */}
			<SocialLogin />

			{/* Login Link */}
			<AuthRedirect
				text="Bạn mới biết đến StuSwap?"
				linkText="Đăng ký ngay"
				href="/register"
			/>

			{/* Features Section */}
			<div className="mt-8 space-y-3">
				{features.map((feature, index) => (
					<div
						key={index}
						className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
					>
						<div
							className={`p-2 rounded-lg bg-gradient-to-br ${feature.gradient} flex-shrink-0`}
						>
							<div className="text-white">{feature.icon}</div>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-gray-900 text-sm mb-0.5">
								{feature.title}
							</h3>
							<p className="text-xs text-gray-600 leading-relaxed">
								{feature.description}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Footer Text */}
			<p className="text-center text-xs text-gray-500 mt-6 px-4">
				Code bởi sinh viên, chạy bằng cà phê và niềm tin ☕😁
			</p>
		</div>
	);
}
