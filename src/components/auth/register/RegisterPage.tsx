// src/components/auth/register/RegisterForm.jsx
'use client';

import HomeButton from '@/components/ui/HomeButton';
import Logo from '@/components/ui/Logo';
import AuthHeader from '../AuthHeader';
import Divider from '@/components/ui/Divider';
import SocialLogin from '../SocialLogin';
import AuthRedirect from '../AuthRedirect';
import RegisterForm from './RegisterForm';

export default function RegisterPage() {
	return (
		<div className="w-full max-w-md mx-auto py-2">
			<HomeButton />

			<div className="block lg:hidden mb-8">
				<Logo width={180} height={180} canClick={false} theme="dark" />
			</div>

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
		</div>
	);
}
