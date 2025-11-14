'use client';
import { User } from '@/types/auth';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiShoppingCart } from 'react-icons/fi';
import { MdArticle, MdLogout, MdPerson } from 'react-icons/md';

type DropdownMenuProps = {
	isOpen: boolean;
	user: User | null;
	logout: () => void;
	onClose: () => void;
};

export default function UserDropdownMenu({
	isOpen,
	user,
	logout,
	onClose,
}: DropdownMenuProps) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, y: -10, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.95 }}
					transition={{ duration: 0.2 }}
					className={`absolute -right-5 mt-1.5 z-20 w-56 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden `}
				>
					{/* User info header */}
					<div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
						<p className="font-semibold text-sm truncate">
							{user?.fullName || user?.email}
						</p>
						<p className="text-xs text-white/80 truncate">
							{user?.email}
						</p>
					</div>

					{/* Menu items */}
					<div className="py-2">
						<Link
							href="/profile"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
							onClick={onClose}
						>
							<MdPerson className="w-5 h-5" />
							Trang cá nhân
						</Link>
						<Link
							href="/my-posts"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
							onClick={onClose}
						>
							<MdArticle className="w-5 h-5" />
							Quản lý tin đăng
						</Link>
						<Link
							href="/cart"
							className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
							onClick={onClose}
						>
							<FiShoppingCart className="w-5 h-5" />
							Giỏ hàng
						</Link>
					</div>

					{/* Divider */}
					<div className="border-t border-gray-700"></div>

					{/* Logout button */}
					<div className="py-2">
						<button
							onClick={() => {
								logout();
								onClose();
							}}
							className="w-full flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
						>
							<MdLogout className="w-5 h-5" />
							Đăng xuất
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
