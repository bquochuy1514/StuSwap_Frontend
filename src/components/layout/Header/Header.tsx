// components/layout/Header.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { MdAddCircleOutline, MdMenu, MdClose } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';
import CompactButton from '@/components/ui/CompactButton';
import SearchBar from './SearchBar';
import Image from 'next/image';
import UserDropdownMenu from './UserDropDownMenu';

export default function Header() {
	const router = useRouter();
	const { user, accessToken, logout } = useAuth();
	const pathname = usePathname();
	const [openMenu, setOpenMenu] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const navItems = [
		{ label: 'Trang chủ', href: '/' },
		{ label: 'Về chúng tôi', href: '/about' },
		{ label: 'Liên hệ', href: '/contact' },
		{ label: 'Báo lỗi / Feedback', href: '/feedback' },
	];

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpenDropdown(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		setOpenMenu(false);
	}, [pathname]);

	return (
		<header className="fixed top-0 left-0 w-full z-50 shadow-xl">
			{/* Top row - Logo, Nav, Auth */}
			<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<div className="flex-shrink-0">
							<Logo width={130} height={60} />
						</div>

						{/* Desktop nav */}
						<nav className="hidden lg:flex items-center gap-8">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`relative text-sm font-semibold transition-all duration-200 group ${
										pathname === item.href
											? 'text-white'
											: 'text-gray-300 hover:text-white'
									}`}
								>
									{item.label}
									<span
										className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-200 ${
											pathname === item.href
												? 'w-full'
												: 'w-0 group-hover:w-full'
										}`}
									/>
								</Link>
							))}
						</nav>

						{/* Right side */}
						<div className="flex items-center gap-3">
							{accessToken ? (
								<>
									{/* Nút đăng tin – luôn hiện trên mobile & desktop */}
									<CompactButton
										variant="primary"
										size="md"
										onClick={() => router.push('/post')}
										icon={
											<MdAddCircleOutline className="w-5 h-5" />
										}
										className="hidden sm:flex"
									>
										Đăng bán
									</CompactButton>

									{/* Avatar + Dropdown (chỉ desktop) */}
									<div
										className="relative z-50 hidden lg:block"
										ref={dropdownRef}
									>
										<button
											onClick={() =>
												setOpenDropdown(!openDropdown)
											}
											className="relative w-10 h-10 rounded-full border-2 border-gray-600 overflow-hidden hover:scale-110 hover:border-emerald-500 transition-all duration-200 shadow-lg hover:shadow-xl"
										>
											{user?.avatar ? (
												<Image
													src={
														user.avatar ||
														`${process.env.NEXT_PUBLIC_API_URL}/images/users/default_avatar.jpg`
													}
													alt="User Avatar"
													className="w-full h-full object-cover cursor-pointer"
													width={40}
													height={40}
												/>
											) : (
												<FaUserCircle className="text-gray-300 w-full h-full" />
											)}
										</button>

										<UserDropdownMenu
											isOpen={openDropdown}
											user={user}
											logout={logout}
											onClose={() =>
												setOpenDropdown(false)
											}
										/>
									</div>

									{/* Mobile menu button (logged in) */}
									<button
										onClick={() => setOpenMenu(!openMenu)}
										className="lg:hidden text-gray-300 hover:text-white transition-colors p-2"
									>
										{openMenu ? (
											<MdClose className="w-6 h-6" />
										) : (
											<MdMenu className="w-6 h-6" />
										)}
									</button>
								</>
							) : (
								<>
									{/* Not logged in – mobile & desktop */}
									<CompactButton
										variant="secondary"
										size="md"
										onClick={() => router.push('/login')}
										className="hidden sm:block"
									>
										Đăng nhập
									</CompactButton>

									<CompactButton
										variant="primary"
										size="md"
										onClick={() => router.push('/post')}
										icon={
											<MdAddCircleOutline className="w-5 h-5" />
										}
									>
										Đăng bán
									</CompactButton>

									{/* Mobile menu button (not logged in) */}
									<button
										onClick={() => setOpenMenu(!openMenu)}
										className="lg:hidden text-gray-300 hover:text-white transition-colors p-2"
									>
										{openMenu ? (
											<MdClose className="w-6 h-6" />
										) : (
											<MdMenu className="w-6 h-6" />
										)}
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Bottom row - Search */}
			<div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 pt-1">
					<SearchBar />
				</div>
			</div>

			{/* Mobile menu - Only show when not logged in */}
			{openMenu && !accessToken && (
				<div className="lg:hidden bg-gray-900 border-t border-gray-700 shadow-2xl animate-fadeIn">
					<div className="p-4 space-y-2">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block text-sm font-medium py-3 px-4 rounded-lg transition-all ${
									pathname === item.href
										? 'bg-emerald-600 text-white shadow-md'
										: 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
								}`}
							>
								{item.label}
							</Link>
						))}

						{/* Mobile auth for non-logged in users */}
						<div className="pt-3 mt-3 border-t border-gray-700 space-y-2">
							<CompactButton
								variant="secondary"
								size="md"
								fullWidth
								onClick={() => router.push('/login')}
							>
								Đăng nhập
							</CompactButton>
							<CompactButton
								variant="primary"
								size="md"
								fullWidth
								onClick={() => router.push('/register')}
							>
								Đăng ký
							</CompactButton>
						</div>
					</div>
				</div>
			)}

			{/* Mobile menu for logged in users - Nav items + User options */}
			{openMenu && accessToken && (
				<div className="lg:hidden bg-gray-900 border-t border-gray-700 shadow-2xl animate-fadeIn">
					<div className="p-4 space-y-2">
						{/* User info section */}
						<div className="pb-3 mb-3 border-b border-gray-700">
							<div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
								<div className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden flex-shrink-0">
									{user?.avatar ? (
										<Image
											src={
												user.avatar ||
												`${process.env.NEXT_PUBLIC_API_URL}/images/users/default_avatar.jpg`
											}
											alt="User Avatar"
											className="w-full h-full object-cover"
											width={48}
											height={48}
										/>
									) : (
										<FaUserCircle className="text-white w-full h-full" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-white text-sm truncate">
										{user?.fullName || user?.email}
									</p>
									<p className="text-xs text-white/80 truncate">
										{user?.email}
									</p>
								</div>
							</div>
						</div>

						{/* Navigation items */}
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block text-sm font-medium py-3 px-4 rounded-lg transition-all ${
									pathname === item.href
										? 'bg-emerald-600 text-white shadow-md'
										: 'text-gray-300 hover:bg-gray-800 hover:text-emerald-400'
								}`}
								onClick={() => setOpenMenu(false)}
							>
								{item.label}
							</Link>
						))}

						{/* User menu items */}
						<div className="pt-3 mt-3 border-t border-gray-700 space-y-2">
							<Link
								href="/profile"
								className="block text-sm font-medium py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-all"
								onClick={() => setOpenMenu(false)}
							>
								Trang cá nhân
							</Link>
							<Link
								href="/my-posts"
								className="block text-sm font-medium py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-all"
								onClick={() => setOpenMenu(false)}
							>
								Quản lý tin đăng
							</Link>
							<Link
								href="/cart"
								className="block text-sm font-medium py-3 px-4 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-emerald-400 transition-all"
								onClick={() => setOpenMenu(false)}
							>
								Giỏ hàng
							</Link>
							<button
								onClick={() => {
									logout();
									setOpenMenu(false);
								}}
								className="w-full py-3 text-sm font-semibold text-red-400 bg-red-950/50 rounded-xl hover:bg-red-950 transition-colors"
							>
								Đăng xuất
							</button>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
