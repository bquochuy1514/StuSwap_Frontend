'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AuthHeader from '@/components/auth/AuthHeader';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/lib/api/authApi';
import BackButton from '@/components/ui/BackButton';
import { FiLock, FiMail } from 'react-icons/fi';
import RedirectLoading from '@/components/shared/PageTransition';
import { useRedirect } from '@/hooks/useRedirect';
import { ResetPasswordError } from '@/types/auth';
import { handleApiError } from '@/lib/utils';
import Input from '@/components/ui/Input';
import GradientButton from '@/components/ui/GradientButton';
import Logo from '@/components/ui/Logo';

export default function ResetPassword() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState<ResetPasswordError>({});
	const { isRedirecting, redirectTo } = useRedirect();

	useEffect(() => {
		const emailFromQuery = searchParams.get('email');
		if (emailFromQuery) setEmail(emailFromQuery);
	}, [searchParams]);

	const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setErrors({});

		try {
			const result = await resetPassword({
				email,
				password,
				confirmPassword,
			});
			console.log('>>> Check reset password result ', result);
			toast.success(result.message || 'Đặt lại mật khẩu thành công!');
			redirectTo('/login');
		} catch (err) {
			console.error('>>> check reset password error', err);
			const fieldErrors = handleApiError<ResetPasswordError>(err);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setLoading(false);
		}
	};

	if (isRedirecting) {
		return <RedirectLoading message="Đặt lại mật khẩu thành công!" />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-500/30 to-green-500/30 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
				<div className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-lime-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>

			{/* Overlay tối */}
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

			<div className="w-full max-w-md relative z-10">
				<BackButton />

				<div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
					<Logo />
					<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-2xl"></div>

					<div className="relative z-10 mt-4">
						<AuthHeader
							title="Đặt lại mật khẩu"
							content1="Vui lòng kiểm tra email của bạn!"
							content2="Nhập mật khẩu mới bên dưới."
							showStudentSwap={false}
							theme="dark"
						/>

						<form
							onSubmit={handleResetPassword}
							className="space-y-3"
						>
							<Input
								label="Email"
								name="email"
								disabled={true}
								type="email"
								icon={<FiMail />}
								value={email}
								onChange={() => {}}
								placeholder="example@email.com"
								theme="dark"
							/>

							<Input
								label="Mật khẩu mới"
								name="password"
								type="password"
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
									setErrors((prev) => ({
										...prev,
										password: undefined,
									}));
								}}
								placeholder="Nhập mật khẩu mới..."
								icon={<FiLock />}
								error={
									errors.password
										? errors.password[0]
										: undefined
								}
								theme="dark"
							/>

							<Input
								label="Xác nhận mật khẩu mới"
								name="confirmPassword"
								type="password"
								value={confirmPassword}
								onChange={(e) => {
									setConfirmPassword(e.target.value);
									setErrors((prev) => ({
										...prev,
										confirmPassword: undefined,
									}));
								}}
								placeholder="Nhập lại mật khẩu mới..."
								icon={<FiLock />}
								error={
									errors.confirmPassword
										? errors.confirmPassword[0]
										: undefined
								}
								theme="dark"
							/>

							<GradientButton
								type="submit"
								isLoading={loading}
								loadingText="Đang xử lý..."
								size="md"
								variant="primary"
							>
								Đặt lại mật khẩu
							</GradientButton>
						</form>
					</div>
				</div>

				<p className="text-center text-gray-300 text-sm mt-6">
					Vui lòng nhập đúng mật khẩu mới để hoàn tất quá trình đặt
					lại mật khẩu
				</p>
			</div>
		</div>
	);
}
