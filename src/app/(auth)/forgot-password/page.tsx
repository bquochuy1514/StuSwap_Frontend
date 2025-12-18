// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import AuthHeader from '@/components/auth/AuthHeader';
import Link from 'next/link';
import BackButton from '@/components/ui/BackButton';
import Logo from '@/components/ui/Logo';
import RedirectLoading from '@/components/shared/PageTransition';
import { useRedirect } from '@/hooks/useRedirect';
import Input from '@/components/ui/Input';
import GradientButton from '@/components/ui/GradientButton';
import { forgotPassword } from '@/lib/api/authApi';
import { handleApiError } from '@/lib/utils';
import { ForgotPasswordError } from '@/types/auth';

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<ForgotPasswordError>({});
	const { isRedirecting, redirectTo } = useRedirect();

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setEmail(e.target.value);
		setErrors({});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		if (!email) {
			toast.warning('Vui lòng nhập email');
			setIsLoading(false);
			return;
		}

		try {
			const result = await forgotPassword({ email });
			console.log('API response success: ', result);
			toast.success('Đã gửi email khôi phục mật khẩu!');

			redirectTo(`forgot-password/verify-otp?email=${email}`);
		} catch (error) {
			const fieldErrors = handleApiError(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (isRedirecting) {
		return <RedirectLoading message="Chuyển đến trang xác thực OTP..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background effects - tone xanh lá */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{/* Orbs sáng nhẹ */}
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
				<div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-lime-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>

			{/* Overlay tối để nổi bật nội dung */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

			<div className="w-full max-w-md relative z-10">
				{/* Back Button */}
				<BackButton />

				{/* Card container */}
				<div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
					{/* Gradient border effect */}
					<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-2xl"></div>

					<Logo />

					<div className="relative z-10 mt-6">
						{/* Header */}
						<AuthHeader
							title="Quên mật khẩu?"
							content1="Đừng lo lắng! Nhập email của bạn và chúng tôi sẽ gửi"
							content2="Email kèm mã OTP để đặt lại mật khẩu."
							showStudentSwap={false}
							theme="dark"
						/>

						{/* Form */}
						<form onSubmit={handleSubmit}>
							{/* Email Input */}
							<Input
								label="Email"
								name="email"
								type="text"
								value={email}
								onChange={handleChange}
								placeholder="example@email.com"
								icon={<FiMail />}
								error={
									errors.email ? errors.email[0] : undefined
								}
								theme="dark"
							/>

							{/* Submit Button */}
							<GradientButton
								type="submit"
								isLoading={isLoading}
								loadingText="Đang gửi..."
								size="md"
								variant="primary"
								className="mt-4"
							>
								Gửi email khôi phục
							</GradientButton>
						</form>

						{/* Additional Info */}
						<div className="mt-6 text-center">
							<p className="text-sm text-gray-300">
								Bạn nhớ ra mật khẩu?{' '}
								<Link
									href="/login"
									className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 font-semibold transition-colors duration-300"
								>
									Đăng nhập ngay
								</Link>
							</p>
						</div>
					</div>
				</div>

				{/* Footer text */}
				<p className="text-center text-gray-300 text-sm mt-6">
					Chúng tôi sẽ gửi hướng dẫn khôi phục mật khẩu đến email của
					bạn
				</p>
			</div>
		</div>
	);
}
