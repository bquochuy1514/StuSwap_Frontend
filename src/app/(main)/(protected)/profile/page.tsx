// src/app/(main)/(protected)/profile/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLock, FiShield, FiCamera } from 'react-icons/fi';
import ProfileInfoTab from '@/components/features/users/profile/ProfileInfoTab';
import { useAuth } from '@/contexts/AuthContext';
import ActiveButton from '@/components/ui/ActiveButton';

type TabType = 'info' | 'password' | 'security';

export default function ProfilePage() {
	const { user, accessToken, setUser } = useAuth();

	const [activeTab, setActiveTab] = useState<TabType>('info');
	const [isEditing, setIsEditing] = useState(false);

	const getRoleLabel = (role: string) => {
		const roleMap: Record<string, string> = {
			customer: 'Người dùng',
			admin: 'Quản trị viên',
			seller: 'Người bán',
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
							{/* Avatar */}
							<div className="relative w-32 h-32 mx-auto mb-4 group">
								<div className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl">
									{user?.avatar ? (
										<img
											src={user.avatar}
											alt={user.fullName}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
											{user?.fullName?.charAt(0)}
										</div>
									)}
								</div>
								<button className="absolute bottom-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all hover:scale-110 opacity-0 group-hover:opacity-100">
									<FiCamera className="w-4 h-4" />
								</button>
							</div>

							{/* User Info */}
							<div className="text-center">
								<h2 className="text-xl font-bold text-gray-900 mb-1">
									{user?.fullName}
								</h2>
								<p className="text-sm text-gray-500 mb-3 break-all">
									{user?.email}
								</p>
								<div className="flex items-center justify-center gap-2">
									<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
										{getRoleLabel(user?.role || '')}
									</span>
									{user?.isActive && (
										<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
											Hoạt động
										</span>
									)}
								</div>
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
								size="md"
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
								gradientFrom="from-blue-500"
								gradientTo="to-indigo-600"
								size="md"
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
								gradientFrom="from-purple-500"
								gradientTo="to-pink-600"
								size="md"
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

							{activeTab === 'password' && (
								<motion.div
									key="password"
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: -20 }}
									transition={{ duration: 0.2 }}
									className="bg-white shadow-lg rounded-2xl p-6"
								>
									<div className="flex items-start gap-3 mb-6">
										<div className="p-2.5 bg-blue-100 rounded-xl">
											<FiLock className="w-5 h-5 text-blue-600" />
										</div>
										<div className="flex-1">
											<h2 className="text-2xl font-bold text-gray-900 mb-1">
												Đổi mật khẩu
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
										<div className="p-2.5 bg-purple-100 rounded-xl">
											<FiShield className="w-5 h-5 text-purple-600" />
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
