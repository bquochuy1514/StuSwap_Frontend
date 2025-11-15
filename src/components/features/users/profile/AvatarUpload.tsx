// components/features/users/profile/AvatarUpload.tsx - Full code với fix

'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiX, FiUpload, FiEye, FiZoomIn } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { uploadAvatar } from '@/lib/api/userApi';
import { useAuth } from '@/contexts/AuthContext';

interface AvatarUploadProps {
	maxSizeMB?: number;
	allowedTypes?: string[];
}

export default function AvatarUpload({
	maxSizeMB = 4,
	allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
}: AvatarUploadProps) {
	const { user, setUser } = useAuth();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [showFullImage, setShowFullImage] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const userName = user?.fullName || user?.email || 'User';
	const currentAvatar = user?.avatar;

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!allowedTypes.includes(file.type)) {
			toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)');
			return;
		}

		// Validate file size
		const fileSizeMB = file.size / (1024 * 1024);
		if (fileSizeMB > maxSizeMB) {
			toast.error(`Kích thước file không được vượt quá ${maxSizeMB}MB`);
			return;
		}

		// Create preview
		const reader = new FileReader();
		reader.onloadend = () => {
			setPreviewUrl(reader.result as string);
		};
		reader.readAsDataURL(file);

		// Upload
		setIsUploading(true);
		setShowMenu(false);
		try {
			const response = await uploadAvatar(file);
			// Update user context with new avatar
			if (user) {
				setUser({ ...user, avatar: response.avatar });
			}
			toast.success('Cập nhật ảnh đại diện thành công!');
		} catch (error) {
			console.error('Error uploading avatar:', error);
			toast.error('Lỗi khi tải ảnh lên');
			setPreviewUrl(null);
		} finally {
			setIsUploading(false);
		}

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const handleClickUpload = () => {
		fileInputRef.current?.click();
		setShowMenu(false);
	};

	const handleViewFullImage = () => {
		setShowFullImage(true);
		setShowMenu(false);
	};

	const displayAvatar = previewUrl || currentAvatar;

	// Click outside to close menu
	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showMenu]);

	// Handle header visibility when modal opens
	React.useEffect(() => {
		if (showFullImage) {
			document.body.style.overflow = 'hidden';
			const header = document.querySelector('header');
			if (header) {
				(header as HTMLElement).style.opacity = '0';
				(header as HTMLElement).style.pointerEvents = 'none';
			}
		} else {
			document.body.style.overflow = 'unset';
			const header = document.querySelector('header');
			if (header) {
				(header as HTMLElement).style.opacity = '1';
				(header as HTMLElement).style.pointerEvents = 'auto';
			}
		}

		return () => {
			document.body.style.overflow = 'unset';
			const header = document.querySelector('header');
			if (header) {
				(header as HTMLElement).style.opacity = '1';
				(header as HTMLElement).style.pointerEvents = 'auto';
			}
		};
	}, [showFullImage]);

	return (
		<div className="relative" ref={menuRef}>
			{/* Avatar Container */}
			<div className="relative w-32 h-32 mx-auto mb-4 group">
				<motion.div
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.98 }}
					onClick={() => setShowMenu(!showMenu)}
					className="w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-xl cursor-pointer relative"
				>
					{displayAvatar ? (
						<div className="relative w-full h-full">
							<Image
								src={displayAvatar}
								alt={userName}
								fill
								className="object-cover transition-all duration-300 group-hover:brightness-110"
								sizes="128px"
								priority
							/>
							{/* Hover Overlay */}
							<div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

							{/* Hover Icon */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							>
								<div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
									<FiCamera className="w-5 h-5 text-emerald-600" />
								</div>
							</motion.div>

							{/* Loading Overlay */}
							{isUploading && (
								<div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
									<div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
								</div>
							)}
						</div>
					) : (
						<div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold transition-all duration-300 group-hover:brightness-110">
							{userName.charAt(0).toUpperCase()}
							{/* Hover Icon for no avatar */}
							<motion.div
								initial={{ opacity: 0 }}
								className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20"
							>
								<div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
									<FiCamera className="w-5 h-5 text-emerald-600" />
								</div>
							</motion.div>
						</div>
					)}
				</motion.div>
			</div>

			{/* Hidden File Input */}
			<input
				ref={fileInputRef}
				type="file"
				accept={allowedTypes.join(',')}
				onChange={handleFileSelect}
				className="hidden"
			/>

			{/* Action Menu - Compact without backdrop */}
			<AnimatePresence>
				{showMenu && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -10 }}
						transition={{
							type: 'spring',
							damping: 20,
							stiffness: 300,
						}}
						className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 w-44"
					>
						{/* View Avatar (only if avatar exists) */}
						{displayAvatar && (
							<>
								<motion.button
									whileHover={{
										backgroundColor: 'rgb(249 250 251)',
									}}
									whileTap={{ scale: 0.98 }}
									onClick={handleViewFullImage}
									className="w-full px-3 py-2 cursor-pointer flex items-center gap-2.5 text-left text-gray-700 hover:text-blue-600 transition-colors"
								>
									<div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
										<FiEye className="w-3.5 h-3.5 text-blue-600" />
									</div>
									<span className="text-sm font-medium">
										Xem ảnh
									</span>
								</motion.button>
								<div className="h-px bg-gray-200" />
							</>
						)}

						{/* Upload Avatar */}
						<motion.button
							whileHover={{
								backgroundColor: 'rgb(249 250 251)',
							}}
							whileTap={{ scale: 0.98 }}
							onClick={handleClickUpload}
							className="w-full px-3 py-2 cursor-pointer flex items-center gap-2.5 text-left text-gray-700 hover:text-emerald-600 transition-colors"
						>
							<div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
								<FiUpload className="w-3.5 h-3.5 text-emerald-600" />
							</div>
							<span className="text-sm font-medium">
								{displayAvatar ? 'Thay đổi' : 'Tải lên'}
							</span>
						</motion.button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Full Image Modal */}
			<AnimatePresence>
				{showFullImage && displayAvatar && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setShowFullImage(false)}
							className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center p-4"
						>
							{/* Close Button */}
							<motion.button
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ delay: 0.1 }}
								onClick={() => setShowFullImage(false)}
								className="absolute top-4 right-4 bg-white/10 cursor-pointer hover:bg-white/20 backdrop-blur-sm text-white rounded-full p-3 transition-colors z-10"
							>
								<FiX className="w-6 h-6" />
							</motion.button>

							{/* Image Container */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.8, y: 20 }}
								transition={{
									type: 'spring',
									damping: 25,
									stiffness: 300,
								}}
								onClick={(e) => e.stopPropagation()}
								className="relative max-w-3xl max-h-[85vh] w-full"
							>
								<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
									<Image
										src={displayAvatar}
										alt={userName}
										width={800}
										height={800}
										className="object-contain w-full h-full max-h-[85vh]"
										priority
									/>
								</div>

								{/* User Info Overlay */}
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 rounded-b-2xl"
								>
									<h3 className="text-white text-xl font-bold mb-1">
										{userName}
									</h3>
									<p className="text-white/80 text-sm flex items-center gap-2">
										<FiZoomIn className="w-4 h-4" />
										Ảnh đại diện
									</p>
								</motion.div>
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
}
