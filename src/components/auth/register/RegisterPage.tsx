// src/components/auth/register/RegisterForm.jsx
'use client';

import HomeButton from '@/components/ui/HomeButton';
import AuthHeader from '../AuthHeader';
import Divider from '@/components/ui/Divider';
import SocialLogin from '../SocialLogin';
import AuthRedirect from '../AuthRedirect';
import RegisterForm from './RegisterForm';
import { FiHeart, FiStar, FiUsers } from 'react-icons/fi';

export default function RegisterPage() {
	const highlights = [
		{
			icon: <FiStar className="w-5 h-5" />,
			title: 'Tham Gia Cộng Đồng Sinh Viên',
			description:
				'Kết nối với hàng trăm sinh viên khác đang chia sẻ, trao đổi và hỗ trợ nhau mỗi ngày.',
			gradient: 'from-pink-500 to-rose-500',
		},
		{
			icon: <FiUsers className="w-5 h-5" />,
			title: 'Không Cần Hoàn Hảo',
			description:
				'Đăng ký tài khoản chỉ mất vài giây — đơn giản vì đây là nền tảng sinh viên làm cho sinh viên.',
			gradient: 'from-sky-500 to-blue-500',
		},
		{
			icon: <FiHeart className="w-5 h-5" />,
			title: 'Dự Án Tự Làm Với Tâm Huyết',
			description:
				'StudentSwap được phát triển và duy trì bởi sinh viên UIT. Rất vui khi bạn chọn đồng hành.',
			gradient: 'from-violet-500 to-fuchsia-500',
		},
	];
	return (
		<div className="w-full max-w-md mx-auto py-2">
			<HomeButton />

			{/* Header */}
			<AuthHeader
				title="Tạo tài khoản StudentSwap"
				content1="Tham gia cộng đồng sinh viên"
				content2="Nơi mua bán, trao đổi đồ cũ dễ dàng"
				theme="light"
			/>

			{/* Form */}
			<RegisterForm />

			{/* Divider */}
			<Divider text="Hoặc đăng nhập với" />

			{/* Social Login Buttons */}
			<SocialLogin />

			{/* Login Link */}
			<AuthRedirect
				text="Bạn đã có tài khoản?"
				linkText="Đăng nhập ngay"
				href="/login"
			/>

			{/* Features Section */}
			<div className="mt-8 space-y-3">
				{highlights.map((highlight, index) => (
					<div
						key={index}
						className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
					>
						<div
							className={`p-2 rounded-lg bg-gradient-to-br ${highlight.gradient} flex-shrink-0`}
						>
							<div className="text-white">{highlight.icon}</div>
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-gray-900 text-sm mb-0.5">
								{highlight.title}
							</h3>
							<p className="text-xs text-gray-600 leading-relaxed">
								{highlight.description}
							</p>
						</div>
					</div>
				))}
			</div>

			{/* Footer Text */}
			<p className="text-center text-xs text-gray-500 mt-6 px-4">
				Made by a student, for students ❤️
			</p>
		</div>
	);
}
