'use client';

import { useEffect, useState } from 'react';
import { FiShield } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import { useSearchParams } from 'next/navigation';

import { useRedirect } from '@/hooks/useRedirect';
import { resendOTP, verifyOTP } from '@/lib/api/authApi';
import { handleApiError } from '@/lib/utils';
import RedirectLoading from '@/components/shared/PageTransition';
import BackButton from '@/components/ui/BackButton';
import Logo from '@/components/ui/Logo';
import AuthHeader from '@/components/auth/AuthHeader';
import Input from '@/components/ui/Input';
import GradientButton from '@/components/ui/GradientButton';
import { VerifyOtpError } from '@/types/auth';

export default function VerifyOTP() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [otpCode, setOtpCode] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [errors, setErrors] = useState<VerifyOtpError>({});
	const { isRedirecting, redirectTo } = useRedirect();

	useEffect(() => {
		const emailFromQuery = searchParams.get('email');
		if (emailFromQuery) setEmail(emailFromQuery);
	}, [searchParams]);

	useEffect(() => {
		if (countdown > 0) {
			const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
			return () => clearTimeout(timer);
		} else {
			setCanResend(true);
		}
	}, [countdown]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			if (!otpCode) {
				toast.warning('Vui lòng nhập mã OTP');
				setIsLoading(false);
				return;
			}
			await verifyOTP({ email, otpCode });
			toast.success('Xác minh OTP thành công!');
			redirectTo(`/reset-password?email=${email}`);
		} catch (error) {
			const fieldErrors = handleApiError<VerifyOtpError>(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleResendOTP = async () => {
		try {
			await resendOTP({ email });
			toast.success('Đã gửi lại mã OTP mới!');
			setCountdown(60);
			setCanResend(false);
		} catch (error) {
			toast.error('Không thể gửi lại mã OTP');
		}
	};

	if (isRedirecting) {
		return <RedirectLoading message="Chuyển đến trang đổi mật khẩu..." />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background effects */}
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
					<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-2xl"></div>
					<Logo />

					<div className="relative z-10 mt-6">
						<AuthHeader
							title="Xác minh mã OTP"
							content1="Mã xác nhận đã được gửi đến"
							content2={email}
							showStudentSwap={false}
							theme="dark"
						/>

						<form onSubmit={handleSubmit}>
							<Input
								label="Nhập mã OTP"
								name="otpCode"
								type="text"
								value={otpCode}
								onChange={(e) => setOtpCode(e.target.value)}
								placeholder="Nhập mã OTP gồm 6 chữ số"
								icon={<FiShield />}
								error={
									errors.otpCode
										? errors.otpCode[0]
										: undefined
								}
								theme="dark"
							/>

							<GradientButton
								type="submit"
								isLoading={isLoading}
								loadingText="Đang xác minh..."
								size="md"
								variant="primary"
								className="mt-4"
							>
								Xác minh OTP
							</GradientButton>
						</form>

						<div className="mt-6 text-center text-gray-300">
							{canResend ? (
								<button
									onClick={handleResendOTP}
									className="text-emerald-400 cursor-pointer hover:text-teal-400 font-semibold underline underline-offset-2 transition-colors"
								>
									Gửi lại mã OTP
								</button>
							) : (
								<p>
									Bạn có thể gửi lại mã sau{' '}
									<span className="text-teal-400 font-semibold">
										{countdown}s
									</span>
								</p>
							)}
						</div>
					</div>
				</div>

				<p className="text-center text-gray-300 text-sm mt-6">
					Vui lòng kiểm tra email và nhập đúng mã OTP
				</p>
			</div>
		</div>
	);
}
