'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
	FiUser,
	FiEdit2,
	FiSave,
	FiX,
	FiMail,
	FiPhone,
	FiBookOpen,
	FiMapPin,
	FiAward,
	FiAlertCircle,
} from 'react-icons/fi';
import { AddressData, User } from '@/types/auth';
import CompactButton from '@/components/ui/CompactButton';
import Input from '@/components/ui/Input';
import LocationSelector from '@/components/ui/LocationSelector';
import { updateUserProfile } from '@/lib/api/userApi';
import { toast } from 'react-toastify';
import { handleApiError } from '@/lib/utils';
import { UpdateUserProfilePayload } from '@/types/user';

interface ProfileInfoTabProps {
	user: User | null;
	isEditing: boolean;
	setUser: (user: User | null) => void;
	setIsEditing: (value: boolean) => void;
}

export default function ProfileInfoTab({
	user,
	setUser,
	isEditing,
	setIsEditing,
}: ProfileInfoTabProps) {
	const [hasChanges, setHasChanges] = useState(false);
	const [addressData, setAddressData] = useState<AddressData>({
		specificAddress: '',
		ward: '',
		district: '',
		province: '',
	});

	const [formData, setFormData] = useState({
		fullName: '',
		phone: '',
		university: '',
		bio: '',
	});
	const [errors, setErrors] = useState<Record<string, string[]>>({});

	// Track changes khi user edit
	useEffect(() => {
		if (!isEditing || !user) return;

		const formChanged =
			formData.fullName !== (user.fullName || '') ||
			formData.phone !== (user.phone || '') ||
			formData.university !== (user.university || '') ||
			formData.bio !== (user.bio || '');

		const addressChanged =
			addressData.specificAddress !==
				(user.address?.specificAddress || '') ||
			addressData.ward !== (user.address?.ward || '') ||
			addressData.district !== (user.address?.district || '') ||
			addressData.province !== (user.address?.province || '');

		setHasChanges(formChanged || addressChanged);
	}, [formData, addressData, isEditing, user]);

	// Khởi tạo từ user data
	useEffect(() => {
		if (user) {
			setFormData({
				fullName: user.fullName || '',
				phone: user.phone || '',
				university: user.university || '',
				bio: user.bio || '',
			});

			// Set addressData riêng
			if (user.address) {
				setAddressData({
					specificAddress: user.address.specificAddress || '',
					ward: user.address.ward || '',
					district: user.address.district || '',
					province: user.address.province || '',
				});
			}
		}
	}, [user]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: [] }));
		}
	};

	const handleSave = async () => {
		try {
			const changedData: UpdateUserProfilePayload = {};

			// Chỉ gửi fields đã thay đổi
			if (formData.fullName !== (user?.fullName || '')) {
				changedData.fullName = formData.fullName;
			}
			if (formData.phone !== (user?.phone || '')) {
				changedData.phone = formData.phone;
			}
			if (formData.university !== (user?.university || '')) {
				changedData.university = formData.university;
			}
			if (formData.bio !== (user?.bio || '')) {
				changedData.bio = formData.bio;
			}

			// Check address changes
			const addressChanged = Object.keys(addressData).some(
				(key) =>
					addressData[key as keyof AddressData] !==
					(user?.address?.[key as keyof AddressData] || '')
			);

			if (addressChanged) {
				changedData.address = addressData;
			}

			console.log('Changed Data = ', changedData);
			const response = await updateUserProfile(changedData);
			toast.success('Cập nhật thông tin thành công!');

			setUser(response);
			setIsEditing(false);
		} catch (error) {
			const fieldErrors = handleApiError(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		}
	};

	const handleCancel = () => {
		setErrors({});
		setFormData({
			fullName: user?.fullName || '',
			phone: user?.phone || '',
			university: user?.university || '',
			bio: user?.bio || '',
		});

		// Reset addressData
		if (user?.address) {
			setAddressData({
				specificAddress: user.address.specificAddress || '',
				ward: user.address.ward || '',
				district: user.address.district || '',
				province: user.address.province || '',
			});
		}

		setIsEditing(false);
	};

	return (
		<motion.div
			key="info"
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			transition={{ duration: 0.2 }}
			className="bg-white shadow-lg rounded-2xl p-6 overflow-visible"
		>
			{/* Header  */}
			<div className="flex items-start gap-3 mb-6">
				<div className="p-2.5 bg-emerald-100 rounded-xl">
					<FiUser className="w-5 h-5 text-emerald-600" />
				</div>
				<div className="flex-1">
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						Thông tin cá nhân
					</h2>
					<p className="text-sm text-gray-500">
						Quản lý thông tin hồ sơ của bạn
					</p>
				</div>

				{/* Edit Buttons */}
				<div className="flex gap-2">
					{!isEditing ? (
						<CompactButton
							onClick={() => setIsEditing(true)}
							icon={<FiEdit2 className="w-3.5 h-3.5" />}
							variant="primary"
							size="sm"
						>
							Chỉnh sửa
						</CompactButton>
					) : (
						<>
							<CompactButton
								onClick={handleSave}
								icon={<FiSave className="w-3.5 h-3.5" />}
								variant="primary"
								size="sm"
								disabled={!hasChanges}
							>
								Lưu
							</CompactButton>
							<CompactButton
								onClick={handleCancel}
								icon={<FiX className="w-3.5 h-3.5" />}
								variant="secondary"
								size="sm"
							>
								Huỷ
							</CompactButton>
						</>
					)}
				</div>
			</div>

			{/* Fields  */}
			<div className="space-y-4 overflow-visible">
				{/* Full Name  */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
					{isEditing ? (
						<Input
							label="Họ và tên"
							name="fullName"
							value={formData.fullName}
							onChange={handleInputChange}
							placeholder="Nhập họ và tên của bạn"
							type="text"
							size="sm"
							icon={<FiUser />}
							error={
								errors.fullName ? errors.fullName[0] : undefined
							}
							theme="light"
						/>
					) : (
						<>
							<label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
								<FiUser className="w-3.5 h-3.5 text-emerald-600" />
								Họ và tên
							</label>
							<p className="text-gray-900 text-sm font-medium">
								{formData.fullName || (
									<span className="text-gray-400 italic">
										Chưa cập nhật
									</span>
								)}
							</p>
						</>
					)}
				</div>

				{/* Email */}
				<div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 border border-blue-200/50">
					<label className="flex items-center gap-2 text-xs font-semibold text-blue-700 mb-2">
						<FiMail className="w-3.5 h-3.5 text-blue-600" />
						Email
					</label>
					<p className="text-gray-900 text-sm font-medium break-all">
						{user?.email}
					</p>
					<div className="flex items-center gap-1.5 mt-2 text-xs text-blue-600">
						<FiAlertCircle className="w-3 h-3" />
						<span>Email không thể thay đổi</span>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{/* Phone  */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
						{isEditing ? (
							<Input
								label="Số điện thoại"
								name="phone"
								value={formData.phone}
								onChange={handleInputChange}
								placeholder="Nhập số điện thoại"
								type="tel"
								size="sm"
								icon={<FiPhone />}
								error={
									errors.phone ? errors.phone[0] : undefined
								}
								theme="light"
							/>
						) : (
							<>
								<label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
									<FiPhone className="w-3.5 h-3.5 text-emerald-600" />
									Số điện thoại
								</label>
								<p className="text-gray-900 text-sm font-medium">
									{formData.phone || (
										<span className="text-gray-400 italic">
											Chưa cập nhật
										</span>
									)}
								</p>
							</>
						)}
					</div>

					{/* University  */}
					<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
						{isEditing ? (
							<Input
								label="Trường đại học"
								name="university"
								value={formData.university}
								onChange={handleInputChange}
								placeholder="VD: ĐH Công nghệ Thông tin"
								type="text"
								size="sm"
								icon={<FiBookOpen />}
								error={
									errors.university
										? errors.university[0]
										: undefined
								}
								theme="light"
							/>
						) : (
							<>
								<label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
									<FiBookOpen className="w-3.5 h-3.5 text-emerald-600" />
									Trường đại học
								</label>
								<p className="text-gray-900 text-sm font-medium">
									{formData.university || (
										<span className="text-gray-400 italic">
											Chưa cập nhật
										</span>
									)}
								</p>
							</>
						)}
					</div>
				</div>

				{/* Address  */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
					<label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
						<FiMapPin className="w-3.5 h-3.5 text-emerald-600" />
						Địa chỉ
					</label>
					<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
						<LocationSelector
							addressData={addressData}
							onChange={(value) => {
								setAddressData(value);
								console.log(value);
							}}
							isEditing={isEditing}
							showLabel={true}
						/>
					</div>
				</div>

				{/* Bio  */}
				<div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/50 hover:border-emerald-300 transition-all duration-200">
					<label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
						<FiEdit2 className="w-3.5 h-3.5 text-emerald-600" />
						Giới thiệu bản thân
					</label>
					{isEditing ? (
						<textarea
							name="bio"
							value={formData.bio}
							onChange={handleInputChange}
							rows={3}
							className="w-full px-3 py-2.5 text-sm border border-gray-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-all duration-200"
							placeholder="Viết vài dòng giới thiệu về bản thân..."
						/>
					) : (
						<p className="text-gray-900 text-sm leading-relaxed">
							{formData.bio || (
								<span className="text-gray-400 italic">
									Chưa có mô tả
								</span>
							)}
						</p>
					)}
				</div>
			</div>

			{/* Member Since */}
			<div className="mt-6 pt-6 border-t border-gray-200">
				<div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200/50">
					<FiAward className="w-4 h-4 text-emerald-600" />
					<span className="text-sm font-medium text-emerald-700">
						Thành viên từ{' '}
						{user?.createdAt
							? new Date(user.createdAt).toLocaleDateString(
									'vi-VN',
									{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									}
							  )
							: 'N/A'}
					</span>
				</div>
			</div>
		</motion.div>
	);
}
