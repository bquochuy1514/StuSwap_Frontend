'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { resendCode, verifyAccount } from '@/lib/api/authApi';
import RedirectLoading from '@/components/shared/PageTransition';
import AuthHeader from '@/components/auth/AuthHeader';
import { FiKey, FiMail } from 'react-icons/fi';
import GradientButton from '@/components/ui/GradientButton';
import BackButton from '@/components/ui/BackButton';
import Logo from '@/components/ui/Logo';
import { useRedirect } from '@/hooks/useRedirect';
import { VerifyAccountErrors } from '@/types/auth';
import { ApiError } from 'next/dist/server/api-utils';
import Input from '@/components/ui/Input';

export default function ActivateAccountPage() {
	const searchParams = useSearchParams();
	const [email, setEmail] = useState('');
	const [codeId, setCodeId] = useState('');
	const [loading, setLoading] = useState(false);
	const [countdown, setCountdown] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const [errors, setErrors] = useState<VerifyAccountErrors>({});
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

	const handleActivate = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!codeId) {
			toast.warning('Vui lòng nhập mã kích hoạt!');
			return;
		}

		setLoading(true);
		try {
			await verifyAccount({ email, codeId });
			setCodeId('');
			redirectTo('/login');
		} catch (err) {
			const error = err as ApiError;
			console.error('Activate account error: ', err);
			toast.error(error.message || 'Không thể kích hoạt tài khoản');
			setErrors({ codeId: error.message });
		} finally {
			setLoading(false);
		}
	};

	const handleResendCode = async () => {
		if (!email) {
			toast.warning('Không tìm thấy email, vui lòng đăng ký lại!');
			return;
		}

		try {
			await resendCode({ email });
			setCountdown(60);
			setCanResend(false);
			toast.success('Mã xác nhận mới đã được gửi đến email của bạn!');
		} catch (err) {
			const error = err as ApiError;
			console.error('Resend code error: ', error);
			toast.error(error.message || 'Không thể gửi lại mã kích hoạt');
		}
	};

	if (isRedirecting) {
		return <RedirectLoading message="Kích hoạt tài khoản thành công..." />;
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-[#0a4d3c] via-[#1a5c47] to-[#2d7a5f] flex items-center justify-center p-4 relative overflow-hidden">
			{/* Background orbs */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-emerald-500/30 to-green-500/30 rounded-full blur-3xl animate-pulse"></div>
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-linear-to-br from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
				<div className="absolute top-1/2 left-1/2 w-72 h-72 bg-linear-to-br from-lime-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
			</div>
			<div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

			<div className="w-full max-w-md relative z-10">
				<BackButton />

				<div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 rounded-2xl"></div>

					<Logo />

					<div className="relative z-10 mt-6">
						<AuthHeader
							title="Kích hoạt tài khoản"
							content1="Vui lòng kiểm tra email của bạn!"
							content2="Nhập mã kích hoạt để kích hoạt tài khoản."
							showStudentSwap={false}
							theme="dark"
						/>

						<form onSubmit={handleActivate} className="space-y-6">
							<Input
								label="Email đăng ký"
								name="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="example@email.com"
								icon={<FiMail />}
								error={undefined}
								theme="dark"
								disabled={true}
							/>

							<Input
								label="Mã kích hoạt"
								name="codeId"
								type="text"
								value={codeId}
								onChange={(e) => {
									setCodeId(e.target.value);
									setErrors({ codeId: undefined });
								}}
								placeholder="Nhập mã trong email..."
								icon={<FiKey />}
								error={errors.codeId}
								theme="dark"
							/>

							<GradientButton
								type="submit"
								isLoading={loading}
								loadingText="Đang kích hoạt...."
								size="md"
								variant="primary"
							>
								Kích hoạt tài khoản
							</GradientButton>
						</form>

						<div className="mt-6 text-center text-gray-300">
							{canResend ? (
								<button
									onClick={handleResendCode}
									className="text-emerald-400 cursor-pointer hover:text-teal-300 font-semibold underline underline-offset-2 transition"
								>
									Gửi lại mã kích hoạt tài khoản
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
					Chúng tôi sẽ gửi hướng dẫn kích hoạt tài khoản đến email của
					bạn
				</p>
			</div>
		</div>
	);
}
