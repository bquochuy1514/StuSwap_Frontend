'use client';

import { useState } from 'react';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import { useRedirect } from '@/hooks/useRedirect';
import GradientButton from '@/components/ui/GradientButton';
import RedirectLoading from '@/components/shared/PageTransition';
import { registerUser } from '@/lib/api/authApi';
import { RegisterError } from '@/types/auth';
import Input from '@/components/ui/Input';
import { handleApiError } from '@/lib/utils';

export default function RegisterForm() {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { isRedirecting, redirectTo } = useRedirect();
	const [errors, setErrors] = useState<RegisterError>({});

	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name as keyof RegisterError])
			setErrors((prev) => ({ ...prev, [name]: undefined }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setErrors({});

		try {
			await registerUser(formData);
			toast.success('Đăng ký thành công!');

			redirectTo(`/verify-account?email=${formData.email}`);
		} catch (error) {
			const fieldErrors = handleApiError<RegisterError>(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
			setIsLoading(false); //  Chỉ tắt loading khi có lỗi
		}
	};

	if (isRedirecting) {
		return <RedirectLoading message="Chuyển đến trang xác thực..." />;
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<Input
				label="Họ và tên"
				name="fullName"
				value={formData.fullName}
				onChange={handleChange}
				placeholder="Nguyễn Văn A"
				type="text"
				icon={<FiUser />}
				error={errors.fullName ? errors.fullName[0] : undefined}
				theme="light"
			/>

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

			<Input
				label="Xác nhận mật khẩu"
				name="confirmPassword"
				value={formData.confirmPassword}
				onChange={handleChange}
				placeholder="••••••••"
				type={showConfirmPassword ? 'text' : 'password'}
				icon={<FiLock />}
				error={
					errors.confirmPassword
						? errors.confirmPassword[0]
						: undefined
				}
				theme="light"
				showPasswordToggle={true}
				showPassword={showConfirmPassword}
				onTogglePassword={() =>
					setShowConfirmPassword(!showConfirmPassword)
				}
			/>

			<GradientButton
				type="submit"
				isLoading={isLoading}
				loadingText="Đang đăng ký..."
				size="md"
				variant="primary"
			>
				Đăng ký
			</GradientButton>
		</form>
	);
}
