'use client';

import { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { LoginError } from '@/types/auth';
import GradientButton from '@/components/ui/GradientButton';
import VerifyModal from './VerifyModal';
import Input from '@/components/ui/Input';
import { handleApiError } from '@/lib/utils';

export default function LoginForm() {
	const { login } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState<LoginError>({});
	const [showVerifyModal, setShowVerifyModal] = useState(false);
	const [verifyEmail, setVerifyEmail] = useState('');
	const [rememberMe, setRememberMe] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof LoginError]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }));
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			await login(formData, rememberMe);
		} catch (error) {
			console.log('API response error: ', error);

			const fieldErrors = handleApiError<LoginError>(error, (message) => {
				// Xử lý trường hợp đặc biệt: tài khoản chưa kích hoạt
				if (message.includes('chưa được kích hoạt')) {
					setVerifyEmail(formData.email);
					setShowVerifyModal(true);
					return true; // Đã xử lý
				}
				return false; // Chưa xử lý, sẽ hiển thị toast
			});

			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<form className="space-y-4" onSubmit={handleSubmit}>
				{/* Email Input */}
				<Input
					label="Email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="example@email.com"
					type="text"
					icon={<FiMail />}
					error={errors.email ? errors.email[0] : undefined}
					theme="light"
				/>

				{/* Password Input */}
				<div className="relative">
					<Input
						label="Mật khẩu"
						name="password"
						value={formData.password}
						onChange={handleChange}
						placeholder="••••••••"
						type={showPassword ? 'text' : 'password'}
						icon={<FiLock />}
						error={errors.password ? errors.password[0] : undefined}
						theme="light"
						showPasswordToggle={true}
						showPassword={showPassword}
						onTogglePassword={() => setShowPassword(!showPassword)}
					/>
				</div>

				{/* Remember Me & Forgot Password */}
				<div className="flex items-center justify-between text-sm pt-1">
					<label className="flex items-center cursor-pointer group">
						<input
							type="checkbox"
							checked={rememberMe}
							onChange={(e) => setRememberMe(e.target.checked)}
							className="w-4 h-4 rounded border-gray-300 bg-white text-emerald-600 focus:ring-2 accent-emerald-600 focus:ring-emerald-500/30 focus:ring-offset-0 focus:outline-none transition-all cursor-pointer"
						/>
						<span className="ml-2 text-gray-500 group-hover:text-gray-800 transition-colors">
							Ghi nhớ đăng nhập
						</span>
					</label>

					<Link
						href="/forgot-password"
						tabIndex={-1}
						className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium hover:underline"
					>
						Quên mật khẩu?
					</Link>
				</div>

				{/* Submit Button */}
				<GradientButton
					type="submit"
					isLoading={isLoading}
					loadingText="Đang đăng nhập..."
					size="md"
					variant="primary"
				>
					Đăng nhập
				</GradientButton>
			</form>

			{/* Modal xác minh */}
			{showVerifyModal && (
				<VerifyModal
					email={verifyEmail}
					onClose={() => setShowVerifyModal(false)}
				/>
			)}
		</>
	);
}
