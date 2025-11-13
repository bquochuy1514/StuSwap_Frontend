'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { FiMenu, FiX } from 'react-icons/fi';
import { MdAddCircleOutline } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import Logo from '@/components/ui/Logo';
import CompactButton from '@/components/ui/CompactButton';
import SearchInput from './SearchInput';
import Image from 'next/image';

export default function Header() {
	const router = useRouter();
	const { user, accessToken, logout } = useAuth();
	const pathname = usePathname();
	const [openMenu, setOpenMenu] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const navItems = [
		{ label: 'Trang chủ', href: '/' },
		{ label: 'Danh mục', href: '/categories' },
		{ label: 'Tin mới', href: '/newest' },
		{ label: 'Liên hệ', href: '/contact' },
	];

	const handleSearch = (
		query: string,
		category?: string,
		location?: string
	) => {
		console.log('Search:', { query, category, location });
		// Implement search logic
	};

	// Đóng dropdown khi click ra ngoài
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

	// Đóng menu khi đổi route
	useEffect(() => {
		setOpenMenu(false);
	}, [pathname]);

	return (
		<header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg">
			{/* Top row - Logo, Nav, Auth */}
			<div className="bg-emerald-600/95 backdrop-blur-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Logo */}
						<div className="flex-shrink-0">
							<Logo width={130} height={60} />
						</div>

						{/* Desktop nav */}
						<nav className="hidden md:flex items-center gap-6">
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-sm font-medium transition-colors ${
										pathname === item.href
											? 'text-white font-bold'
											: 'text-emerald-50 hover:text-white'
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>

						{/* Right side */}
						<div className="flex items-center gap-3">
							{accessToken ? (
								<>
									<CompactButton
										variant="secondary"
										size="md"
										onClick={() => router.push('/post')}
										icon={
											<MdAddCircleOutline className="w-5 h-5" />
										}
										className="hidden sm:flex"
									>
										Đăng tin
									</CompactButton>

									{/* Avatar + Dropdown */}
									<div className="relative" ref={dropdownRef}>
										<button
											onClick={() =>
												setOpenDropdown(!openDropdown)
											}
											className="w-10 h-10 rounded-full border-2 border-white overflow-hidden hover:scale-110 transition-all shadow-md"
										>
											{user?.avatar ? (
												<Image
													src={
														user.avatar ||
														`${process.env.NEXT_PUBLIC_API_URL}/images/users/default_avatar.jpg`
													}
													alt="User Avatar"
													className="w-full h-full object-cover cursor-pointer"
													width={70}
													height={70}
												/>
											) : (
												<FaUserCircle className="text-white w-full h-full" />
											)}
										</button>

										{/* Dropdown menu */}
										{openDropdown && (
											<div className="absolute right-0 mt-3 w-44 bg-white border border-emerald-100 rounded-xl shadow-lg py-2 animate-fadeIn z-50">
												<Link
													href="/profile"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
												>
													Trang cá nhân
												</Link>
												<Link
													href="/my-posts"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50"
												>
													Bài đăng của tôi
												</Link>
												<button
													onClick={logout}
													className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
												>
													Đăng xuất
												</button>
											</div>
										)}
									</div>
								</>
							) : (
								<div className="hidden sm:flex items-center gap-3">
									<CompactButton
										variant="secondary"
										size="md"
										onClick={() => router.push('/login')}
									>
										Đăng nhập
									</CompactButton>
									<CompactButton
										variant="outline"
										size="md"
										onClick={() => router.push('/post')}
										icon={
											<MdAddCircleOutline className="w-5 h-5" />
										}
										className="hidden lg:flex"
									>
										Đăng tin
									</CompactButton>
								</div>
							)}

							{/* Mobile menu button */}
							<button
								onClick={() => setOpenMenu(!openMenu)}
								className="md:hidden p-2 text-white hover:bg-emerald-700 rounded-lg transition"
							>
								{openMenu ? (
									<FiX className="w-6 h-6" />
								) : (
									<FiMenu className="w-6 h-6" />
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom row - Search */}
			<div className="bg-white/10 backdrop-blur-sm border-t border-white/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
					<SearchInput onSearch={handleSearch} />
				</div>
			</div>

			{/* Mobile menu */}
			{openMenu && (
				<div className="md:hidden bg-white border-t border-emerald-100 shadow-md animate-fadeIn">
					<div className="p-4 space-y-3">
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`block text-sm font-medium py-2 rounded-md px-3 hover:bg-emerald-50 ${
									pathname === item.href
										? 'text-emerald-600 font-semibold'
										: 'text-gray-700'
								}`}
							>
								{item.label}
							</Link>
						))}

						{/* Mobile auth */}
						<div className="mt-3 flex flex-col gap-2">
							{accessToken ? (
								<>
									<CompactButton
										variant="primary"
										size="md"
										fullWidth
										onClick={() => router.push('/post')}
										icon={
											<MdAddCircleOutline className="w-5 h-5" />
										}
									>
										Đăng tin
									</CompactButton>
									<button
										onClick={logout}
										className="w-full py-2 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"
									>
										Đăng xuất
									</button>
								</>
							) : (
								<>
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
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
