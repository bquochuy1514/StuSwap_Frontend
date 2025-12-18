'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { verifyAccount, resendCode } from '@/lib/api/authApi';
import { ApiError } from '@/types/auth';
import GradientButton from '@/components/ui/GradientButton';
import { FiLock } from 'react-icons/fi';
import Input from '@/components/ui/Input';

export default function VerifyModal({
	email,
	onClose,
}: {
	email: string;
	onClose: () => void;
}) {
	const [code, setCode] = useState('');
	const [loading, setLoading] = useState(false);
	const [resending, setResending] = useState(false);

	const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		if (!code) {
			toast.warning('Vui lòng nhập mã kích hoạt');
			setLoading(false);
			return;
		}
		try {
			await verifyAccount({ email, codeId: code });
			toast.success('Kích hoạt thành công! Bạn có thể đăng nhập lại.');
			onClose();
		} catch (err) {
			const error = err as ApiError;
			let message = 'Đã xảy ra lỗi, vui lòng thử lại!';
			if (typeof error.message === 'string') {
				message = error.message;
			}
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};

	const handleResend = async () => {
		setResending(true);
		setCode('');
		try {
			await resendCode({ email });
			toast.success('Mã mới đã được gửi đến email của bạn!');
		} catch (err) {
			const error = err as ApiError;
			let message = 'Đã xảy ra lỗi, vui lòng thử lại!';
			if (typeof error.message === 'string') {
				message = error.message;
			}
			toast.error(message);
		} finally {
			setResending(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
			<div className="bg-gray-900 text-white rounded-2xl p-6 w-[90%] max-w-md shadow-lg border border-gray-700 relative">
				<h2 className="text-2xl font-bold text-center mb-4">
					Xác minh tài khoản
				</h2>
				<p className="text-gray-400 text-sm text-center mb-6">
					Một mã xác nhận đã được gửi đến{' '}
					<span className="text-emerald-400">{email}</span>. Nhập mã
					bên dưới để kích hoạt tài khoản của bạn.
				</p>

				<form onSubmit={handleVerify} className="space-y-4">
					<Input
						label="Nhập mã kích hoạt"
						name="password"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="Nhập mã kích hoạt"
						icon={<FiLock />}
						theme="dark"
						showPasswordToggle={false}
					/>

					<GradientButton
						type="submit"
						isLoading={loading}
						loadingText="Đang xác minh..."
						size="md"
						variant="primary"
					>
						Xác minh ngay
					</GradientButton>
				</form>

				<div className="text-center text-sm mt-4">
					Chưa nhận được mã?{' '}
					<span
						onClick={handleResend}
						className={`text-emerald-400 hover:underline cursor-pointer ${
							resending ? 'opacity-50 pointer-events-none' : ''
						}`}
					>
						{resending ? 'Đang gửi lại...' : 'Gửi lại mã'}
					</span>
				</div>

				<button
					onClick={onClose}
					className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg cursor-pointer"
				>
					✕
				</button>
			</div>
		</div>
	);
}
