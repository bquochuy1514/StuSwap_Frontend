// src/app/(main)/(protected)/profile/page.tsx - Updated

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiShield, FiLogOut } from 'react-icons/fi';
import ProfileInfoTab from '@/components/features/users/profile/ProfileInfoTab';
import ChangePasswordTab from '@/components/features/users/profile/ChangePasswordTab';
import AvatarUpload from '@/components/features/users/profile/AvatarUpload';
import { useAuth } from '@/contexts/AuthContext';
import ActiveButton from '@/components/ui/ActiveButton';

type TabType = 'info' | 'password' | 'security';

export default function ProfilePage() {
	const { user, setUser, logout } = useAuth();

	const [activeTab, setActiveTab] = useState<TabType>('info');
	const [isEditing, setIsEditing] = useState(false);

	const getRoleLabel = (role: string) => {
		const roleMap: Record<string, string> = {
			customer: 'Người dùng',
			admin: 'Quản trị viên',
			premium: 'Tài khoản Premium',
		};
		return roleMap[role] || role;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6"
		>
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Left Sidebar */}
					<div className="lg:w-80 flex-shrink-0 space-y-4">
						{/* Avatar Card */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.1 }}
							className="bg-white shadow-lg rounded-2xl p-6"
						>
							{/* Avatar Upload Component */}
							<AvatarUpload maxSizeMB={5} />

							{/* User Info */}
							<div className="text-center">
								<h2 className="text-xl font-bold text-gray-900 mb-1">
									{user?.fullName}
								</h2>
								<p className="text-sm text-gray-500 mb-3 break-all">
									{user?.email}
								</p>

								{/* User Role Badge */}
								<div className="flex items-center justify-center gap-2">
									<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
										{getRoleLabel(user?.role || '')}
									</span>
								</div>

								{/* Logout Button */}
								<button
									onClick={logout}
									className="flex items-center justify-center cursor-pointer gap-2 w-full py-2 mt-4 
										text-sm font-medium text-red-600 bg-red-50 
										hover:bg-red-100 active:bg-red-200 
										rounded-xl transition-all"
								>
									<FiLogOut className="w-4 h-4" />
									Đăng xuất
								</button>
							</div>
						</motion.div>

						{/* Menu Navigation */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className="bg-white shadow-lg rounded-2xl p-3 space-y-1"
						>
							<ActiveButton
								icon={<FiUser />}
								isActive={activeTab === 'info'}
								onClick={() => {
									setActiveTab('info');
									setIsEditing(false);
								}}
								size="sm"
							>
								Thông tin cá nhân
							</ActiveButton>

							<ActiveButton
								icon={<FiLock />}
								isActive={activeTab === 'password'}
								onClick={() => {
									setActiveTab('password');
									setIsEditing(false);
								}}
								size="sm"
							>
								Thay đổi mật khẩu
							</ActiveButton>

							<ActiveButton
								icon={<FiShield />}
								isActive={activeTab === 'security'}
								onClick={() => {
									setActiveTab('security');
									setIsEditing(false);
								}}
								size="sm"
							>
								Bảo mật
							</ActiveButton>
						</motion.div>
					</div>

					{/* Right Content */}
					<div className="flex-1">
						<AnimatePresence mode="wait">
							{activeTab === 'info' && (
								<ProfileInfoTab
									user={user}
									setUser={setUser}
									isEditing={isEditing}
									setIsEditing={setIsEditing}
								/>
							)}

							{activeTab === 'password' && <ChangePasswordTab />}

							{activeTab === 'security' && (
								<motion.div
									key="security"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.2 }}
									className="bg-white shadow-lg rounded-2xl p-6"
								>
									<div className="flex items-start gap-3 mb-6">
										<div className="p-2.5 bg-emerald-100 rounded-xl">
											<FiShield className="w-5 h-5 text-emerald-600" />
										</div>
										<div className="flex-1">
											<h2 className="text-2xl font-bold text-gray-900 mb-1">
												Bảo mật
											</h2>
											<p className="text-sm text-gray-500">
												Tính năng đang được phát triển
											</p>
										</div>
									</div>
									<div className="text-center py-12">
										<p className="text-gray-400">
											Đang cập nhật...
										</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
