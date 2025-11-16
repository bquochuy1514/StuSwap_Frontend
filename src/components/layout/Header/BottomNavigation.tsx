// components/layout/BottomNavigation.tsx
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { IoHomeOutline, IoHome, IoClose } from 'react-icons/io5';
import { MdOutlinePostAdd, MdPerson, MdPostAdd } from 'react-icons/md';
import { BiCart, BiSolidCart } from 'react-icons/bi';
import { FiUser, FiUserCheck } from 'react-icons/fi';
import { HiOutlineDocumentText, HiDocumentText } from 'react-icons/hi';
import Image from 'next/image';
import GradientButton from '@/components/ui/GradientButton';
import { useState } from 'react';
import { useDropdownState } from '@/contexts/DropdownContext';
import { cn } from '@/lib/utils';

export default function BottomNavigation() {
	const { isAnyDropdownOpen } = useDropdownState();
	const router = useRouter();
	const pathname = usePathname();
	const [showLoginBanner, setShowLoginBanner] = useState(true);
	const { user, accessToken } = useAuth();

	// Navigation items - dùng chung cho cả đã và chưa đăng nhập
	const navItems = [
		{
			label: 'Trang chủ',
			href: '/',
			icon: IoHomeOutline,
			activeIcon: IoHome,
		},
		{
			label: 'Quản lý tin',
			href: '/my-posts',
			icon: HiOutlineDocumentText,
			activeIcon: HiDocumentText,
		},
		{
			label: 'Đăng bán',
			href: '/post',
			icon: MdOutlinePostAdd,
			activeIcon: MdPostAdd,
			isHighlight: true,
		},
		{
			label: 'Giỏ hàng',
			href: '/cart',
			icon: BiCart,
			activeIcon: BiSolidCart,
		},
		{
			label: 'Cá nhân',
			href: '/profile',
			icon: FiUser,
			activeIcon: FiUserCheck,
			showAvatar: true,
		},
	];

	const handleNavClick = (item: (typeof navItems)[0]) => {
		router.push(item.href);
	};

	return (
		<>
			{/* Banner đăng nhập - đè lên bottom navigation */}
			{!accessToken && showLoginBanner && (
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden">
					<div className="px-4 py-3 relative">
						{/* Close button */}
						<button
							onClick={() => setShowLoginBanner(false)}
							className="absolute top-2 right-4 p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
						>
							<IoClose className="w-5 h-5 text-gray-700" />
						</button>
						<div className="flex items-center gap-2 pr-6">
							<MdPerson className="w-10 h-10 text-gray-900 flex-shrink-0" />
							<p className="text-sm text-gray-900 font-semibold">
								Đăng nhập để đăng bán và xem sản phẩm chất lượng
								với giá hạt dẻ.
							</p>
						</div>
						<GradientButton
							onClick={() => router.push('/login')}
							variant="primary"
							size="sm"
						>
							Đăng nhập ngay
						</GradientButton>
					</div>
				</div>
			)}

			{/* Bottom Navigation - chỉ hiện khi đã đăng nhập hoặc đã tắt banner */}
			{(accessToken || !showLoginBanner) && (
				<nav
					className={cn(
						'fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl lg:hidden transition-transform duration-200',
						isAnyDropdownOpen && 'translate-y-96'
						// Trượt xuống dưới khi dropdown mở
					)}
				>
					<div className="flex items-end justify-around h-16 px-2 pt-1">
						{navItems.map((item) => {
							const isActive = pathname === item.href;
							const Icon = isActive ? item.activeIcon : item.icon;

							return (
								<button
									key={item.href}
									onClick={() => handleNavClick(item)}
									className={`flex flex-col items-center justify-end flex-1 h-full relative transition-all duration-200 pb-2`}
								>
									{/* Nút đăng bán nổi bật */}
									{item.isHighlight ? (
										<div className="absolute -top-6 left-1/2 -translate-x-1/2">
											<div className="relative">
												{/* Shadow effect */}
												<div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full blur-md opacity-50" />

												{/* Main button */}
												<div className="relative w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg flex items-center justify-center">
													<Icon className="w-7 h-7 text-white" />
												</div>

												{/* Label bên dưới */}
												<span
													className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium ${
														isActive
															? 'text-emerald-600'
															: 'text-gray-600'
													} whitespace-nowrap`}
												>
													{item.label}
												</span>

												{/* Active indicator */}
												{isActive && (
													<div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
												)}
											</div>
										</div>
									) : (
										<>
											{/* Icon hoặc Avatar */}
											<div className="mb-1">
												{item.showAvatar &&
												accessToken &&
												user?.avatar ? (
													<div
														className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all duration-200 ${
															isActive
																? 'border-emerald-500 scale-110'
																: 'border-gray-300'
														}`}
													>
														<Image
															src={
																user.avatar ||
																`${process.env.NEXT_PUBLIC_API_URL}/images/users/default_avatar.jpg`
															}
															alt="Avatar"
															width={24}
															height={24}
															className="w-full h-full object-cover"
														/>
													</div>
												) : (
													<Icon
														className={`transition-all duration-200 ${
															isActive
																? 'w-6 h-6 text-emerald-600'
																: 'w-6 h-6 text-gray-500'
														}`}
													/>
												)}
											</div>

											{/* Label */}
											<span
												className={`text-xs font-medium transition-all duration-200 ${
													isActive
														? 'text-emerald-600'
														: 'text-gray-600'
												}`}
											>
												{item.label}
											</span>

											{/* Active indicator */}
											{isActive && (
												<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
											)}
										</>
									)}
								</button>
							);
						})}
					</div>
				</nav>
			)}
		</>
	);
}
