// components/features/users/profile/ChangePasswordTab.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield } from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import { changeUserPassword } from '@/lib/api/userApi';
import { ChangeUserPasswordPayload } from '@/types/user';
import Input from '@/components/ui/Input';
import { handleApiError } from '@/lib/utils';
import GradientButton from '@/components/ui/GradientButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface PasswordErrors {
	currentPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
}

export default function ChangePasswordTab() {
	const [formData, setFormData] = useState<ChangeUserPasswordPayload>({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});

	const [showPasswords, setShowPasswords] = useState({
		currentPassword: false,
		newPassword: false,
		confirmPassword: false,
	});

	const [errors, setErrors] = useState<PasswordErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateForm = (): boolean => {
		const newErrors: PasswordErrors = {};

		// Validate current password
		if (!formData.currentPassword) {
			newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
		}

		// Validate new password
		if (!formData.newPassword) {
			newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
		} else if (formData.newPassword.length < 6) {
			newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
		} else if (formData.newPassword === formData.currentPassword) {
			newErrors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
		}

		// Validate confirm password
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
		} else if (formData.confirmPassword !== formData.newPassword) {
			newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			await changeUserPassword({
				currentPassword: formData.currentPassword,
				newPassword: formData.newPassword,
				confirmPassword: formData.confirmPassword,
			});

			toast.success('Đổi mật khẩu thành công!');

			// Reset form
			setFormData({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
			setErrors({});
		} catch (error) {
			const fieldErrors = handleApiError(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (field: keyof typeof formData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors((prev) => ({ ...prev, [field]: undefined }));
		}
	};

	const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
		setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
	};

	return (
		<motion.div
			key="password"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.2 }}
			className="bg-white shadow-lg rounded-2xl p-6"
		>
			{/* Header */}
			<div className="flex items-start gap-3 mb-6 pb-6 border-b border-gray-200">
				<div className="p-2.5 bg-gradient-to-br bg-emerald-100 rounded-xl shadow-lg">
					<FiLock className="w-5 h-5 text-emerald-600" />
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						Đổi mật khẩu
					</h2>
					<p className="text-sm text-gray-500">
						Cập nhật mật khẩu của bạn để bảo mật tài khoản
					</p>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="space-y-5">
				{/* Current Password */}
				<Input
					label="Mật khẩu hiện tại"
					name="currentPassword"
					value={formData.currentPassword}
					onChange={(e) => {
						handleChange('currentPassword', e.target.value);
					}}
					placeholder="••••••••"
					type={showPasswords.currentPassword ? 'text' : 'password'}
					icon={<FiLock />}
					error={errors.currentPassword}
					theme="light"
					showPasswordToggle={true}
					showPassword={showPasswords.currentPassword}
					onTogglePassword={() =>
						togglePasswordVisibility('currentPassword')
					}
					size="sm"
				/>

				{/* New Password */}
				<Input
					label="Mật khẩu mới"
					name="newPassword"
					value={formData.newPassword}
					onChange={(e) => {
						handleChange('newPassword', e.target.value);
					}}
					placeholder="Nhập mật khẩu mới"
					type={showPasswords.newPassword ? 'text' : 'password'}
					icon={<FiLock />}
					error={errors.newPassword}
					theme="light"
					showPasswordToggle={true}
					showPassword={showPasswords.newPassword}
					onTogglePassword={() =>
						togglePasswordVisibility('newPassword')
					}
					size="sm"
				/>

				{/* Confirm Password */}
				<Input
					label="Xác nhận mật khẩu mới"
					name="confirmPassword"
					value={formData.confirmPassword}
					onChange={(e) => {
						handleChange('confirmPassword', e.target.value);
					}}
					placeholder="Nhập lại mật khẩu mới"
					type={showPasswords.confirmPassword ? 'text' : 'password'}
					icon={<FiLock />}
					error={errors.confirmPassword}
					theme="light"
					showPasswordToggle={true}
					showPassword={showPasswords.confirmPassword}
					onTogglePassword={() =>
						togglePasswordVisibility('confirmPassword')
					}
					size="sm"
				/>

				{/* Submit Button */}
				<GradientButton
					type="submit"
					isLoading={isSubmitting}
					loadingText="Đang xử lý..."
					size="sm"
					variant="primary"
					icon={<FiLock />}
				>
					Đổi mật khẩu
				</GradientButton>

				{/* Security Notice */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3"
				>
					<FiShield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
					<div className="flex-1">
						<h3 className="text-sm font-semibold text-blue-900 mb-1">
							Lưu ý bảo mật
						</h3>
						<p className="text-xs text-blue-700">
							Mật khẩu phải có ít nhất 6 ký tự. Nên sử dụng kết
							hợp chữ hoa, chữ thường, số và ký tự đặc biệt.
						</p>
					</div>
				</motion.div>
			</form>

			<LoadingOverlay isVisible={isSubmitting} message="Đang tải..." />
		</motion.div>
	);
}
