// components/ui/Dropdown.tsx
'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { FiChevronDown, FiSearch, FiCheck, FiX } from 'react-icons/fi';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDropdownState } from '@/contexts/DropdownContext';

export interface DropdownItem {
	id: string | number;
	label: string;
	value?: string;
}

interface DropdownProps {
	items: DropdownItem[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	icon?: ReactNode;
	className?: string;
	fullWidth?: boolean;
	variant?: 'default' | 'compact' | 'minimal';
	position?: 'left' | 'right';
	searchable?: boolean;
	hideIconOnMobile?: boolean;
	defaultItem?: DropdownItem;
	size?: 'sm' | 'md' | 'lg';
}

export default function Dropdown({
	items,
	value,
	onChange,
	placeholder = 'Chọn...',
	label,
	icon,
	className,
	fullWidth = false,
	variant = 'default',
	position = 'left',
	searchable = false,
	hideIconOnMobile = false,
	defaultItem,
	size = 'md',
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const { setDropdownOpen } = useDropdownState();
	const [searchQuery, setSearchQuery] = useState('');
	const [isMobile, setIsMobile] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// Thông báo context khi dropdown mở/đóng
		setDropdownOpen(isOpen);

		// Cleanup khi unmount
		return () => setDropdownOpen(false);
	}, [isOpen, setDropdownOpen]);

	const allItems = defaultItem ? [defaultItem, ...items] : items;

	const currentItem = allItems.find(
		(item) => item.label === value || String(item.id) === value
	);

	const isDefaultSelected = defaultItem && currentItem?.id === defaultItem.id;
	const displayValue =
		currentItem && !isDefaultSelected ? currentItem.label : placeholder;

	const filteredItems = searchable
		? allItems.filter((item) =>
				item.label.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: allItems;

	// Size configurations
	const sizeClasses = {
		sm: 'h-9', // 36px
		md: 'h-11', // 44px
		lg: 'h-14', // 56px
	};

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 1024);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
				setSearchQuery('');
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		if (isOpen && searchable && searchInputRef.current) {
			setTimeout(() => searchInputRef.current?.focus(), 100);
		}
	}, [isOpen, searchable]);

	useEffect(() => {
		if (isOpen && isMobile) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen, isMobile]);

	const handleSelect = (item: DropdownItem) => {
		if (defaultItem && item.id === defaultItem.id) {
			onChange('');
		} else {
			onChange(item.label);
		}
		setIsOpen(false);
		setSearchQuery('');
	};

	const variantStyles = {
		default: {
			button: 'flex items-center cursor-pointer gap-2 px-3 text-gray-700 font-medium text-sm rounded-xl transition-all duration-300 border border-gray-200 group relative overflow-hidden',
			menu: 'w-64',
			item: 'w-full text-left px-4 py-3 text-sm cursor-pointer relative',
		},
		compact: {
			button: 'flex items-center cursor-pointer gap-2 px-2.5 sm:px-3 text-gray-700 font-medium text-sm transition-all duration-300 group relative overflow-hidden',
			menu: 'w-56',
			item: 'w-full text-left px-4 py-2.5 text-sm cursor-pointer relative',
		},
		minimal: {
			button: 'flex items-center cursor-pointer gap-2 px-3 text-gray-700 font-medium rounded-xl transition-all duration-200 text-sm group relative overflow-hidden',
			menu: 'w-52',
			item: 'w-full text-left px-3 py-2 text-sm cursor-pointer relative',
		},
	};

	const currentVariant = variantStyles[variant];

	// Animation variants (giữ nguyên như cũ)
	const desktopMenuVariants: Variants = {
		hidden: {
			opacity: 0,
			y: -10,
			scale: 0.95,
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: 'spring',
				damping: 25,
				stiffness: 300,
			},
		},
		exit: {
			opacity: 0,
			y: -10,
			scale: 0.95,
			transition: {
				duration: 0.15,
				ease: 'easeIn',
			},
		},
	};

	const mobileSheetVariants: Variants = {
		hidden: {
			y: '100%',
		},
		visible: {
			y: 0,
			transition: {
				type: 'spring',
				damping: 30,
				stiffness: 300,
			},
		},
		exit: {
			y: '100%',
			transition: {
				duration: 0.25,
				ease: 'easeInOut',
			},
		},
	};

	const itemVariants: Variants = {
		hidden: { opacity: 0, x: -10 },
		visible: (i: number) => ({
			opacity: 1,
			x: 0,
			transition: {
				delay: i * 0.03,
				duration: 0.2,
				ease: 'easeOut',
			},
		}),
	};

	const overlayVariants: Variants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { duration: 0.2 },
		},
		exit: {
			opacity: 0,
			transition: { duration: 0.15 },
		},
	};

	return (
		<div
			ref={dropdownRef}
			className={cn(
				'relative flex-shrink-0',
				fullWidth && 'w-full',
				className
			)}
		>
			{/* Label */}
			<AnimatePresence>
				{label && (
					<motion.label
						initial={{ opacity: 0, y: -5 }}
						animate={{ opacity: 1, y: 0 }}
						className="block text-sm font-semibold text-gray-700 mb-2"
					>
						{label}
					</motion.label>
				)}
			</AnimatePresence>

			{/* Dropdown Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				className={cn(
					currentVariant.button,
					sizeClasses[size],
					fullWidth && 'w-full justify-between',
					isOpen && 'ring-2 ring-emerald-500/20 border-emerald-400'
				)}
			>
				{/* Gradient background on hover */}
				<motion.div
					className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl"
					initial={{ opacity: 0 }}
					whileHover={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				/>

				<div className="flex items-center gap-2 flex-1 min-w-0 relative z-10">
					{/* Icon */}
					{icon && (
						<motion.span
							className={cn(
								'text-emerald-600 flex-shrink-0',
								hideIconOnMobile && 'hidden lg:inline-block'
							)}
							whileHover={{ scale: 1.1, rotate: 12 }}
							transition={{ type: 'spring', stiffness: 400 }}
						>
							{icon}
						</motion.span>
					)}
					{/* Text */}
					<span
						className={cn(
							'whitespace-nowrap truncate transition-all duration-200',
							isDefaultSelected && 'text-gray-500'
						)}
					>
						{displayValue}
					</span>
				</div>

				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3, ease: 'easeInOut' }}
					className="relative z-10"
				>
					<FiChevronDown className="w-4 h-4 text-emerald-600 shrink-0" />
				</motion.div>
			</motion.button>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<>
						{/* Overlay */}
						<motion.div
							variants={overlayVariants}
							initial="hidden"
							animate="visible"
							exit="exit"
							className={cn(
								'fixed inset-0 z-[999]',
								isMobile
									? 'bg-black/40 backdrop-blur-sm'
									: 'bg-black/5 backdrop-blur-[2px] lg:hidden'
							)}
							onClick={() => setIsOpen(false)}
						/>

						{/* Desktop Menu */}
						{!isMobile && (
							<motion.div
								variants={desktopMenuVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className={cn(
									'absolute top-full mt-3 bg-white/95 backdrop-blur-xl border border-emerald-100 rounded-2xl shadow-2xl overflow-hidden z-[1000]',
									currentVariant.menu,
									position === 'right' && 'left-auto right-0'
								)}
							>
								{/* Search Input */}
								{searchable && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
										className="px-3 py-2.5 border-b border-gray-100 bg-gray-50/50"
									>
										<div className="relative">
											<FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												ref={searchInputRef}
												type="text"
												value={searchQuery}
												onChange={(e) =>
													setSearchQuery(
														e.target.value
													)
												}
												placeholder="Tìm kiếm..."
												className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-white transition-all duration-200"
												onClick={(e) =>
													e.stopPropagation()
												}
											/>
										</div>
									</motion.div>
								)}

								{/* Items List */}
								<div className="max-h-80 overflow-y-auto py-1.5 custom-scrollbar">
									{filteredItems.length > 0 ? (
										filteredItems.map((item, index) => {
											const isSelected =
												(defaultItem &&
													item.id ===
														defaultItem.id &&
													value === '') ||
												item.label === value ||
												String(item.id) === value;

											return (
												<div key={item.id}>
													<motion.button
														custom={index}
														variants={itemVariants}
														initial="hidden"
														animate="visible"
														whileHover={{
															x: isSelected
																? 0
																: 4,
														}}
														transition={{
															type: 'spring',
															stiffness: 300,
															damping: 20,
														}}
														onClick={() =>
															handleSelect(item)
														}
														className={cn(
															currentVariant.item,
															'group overflow-visible',
															isSelected
																? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold'
																: 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700'
														)}
													>
														{/* Left indicator bar */}
														<motion.span
															initial={{
																scaleY: 0,
															}}
															animate={{
																scaleY: isSelected
																	? 1
																	: 0,
															}}
															whileHover={{
																scaleY: 1,
															}}
															transition={{
																duration: 0.2,
															}}
															className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-500 to-teal-500 origin-center"
														/>

														<span className="relative z-10 flex items-center justify-between">
															<span>
																{item.label}
															</span>

															{/* Checkmark */}
															{isSelected && (
																<motion.div
																	initial={{
																		scale: 0,
																		rotate: -180,
																	}}
																	animate={{
																		scale: 1,
																		rotate: 0,
																	}}
																	transition={{
																		type: 'spring',
																		stiffness: 500,
																		damping: 25,
																	}}
																>
																	<FiCheck className="w-4 h-4" />
																</motion.div>
															)}
														</span>
													</motion.button>
												</div>
											);
										})
									) : (
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.2 }}
											className="px-4 py-8 text-center"
										>
											<motion.div
												initial={{ y: -10 }}
												animate={{ y: 0 }}
												transition={{
													repeat: Infinity,
													repeatType: 'reverse',
													duration: 1.5,
													ease: 'easeInOut',
												}}
												className="text-gray-400 mb-2"
											>
												<svg
													className="w-12 h-12 mx-auto opacity-50"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</motion.div>
											<p className="text-sm text-gray-500 font-medium">
												Không tìm thấy kết quả
											</p>
										</motion.div>
									)}
								</div>
							</motion.div>
						)}

						{/* Mobile Bottom Sheet */}
						{isMobile && (
							<motion.div
								variants={mobileSheetVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								className="fixed bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Handle Bar */}
								<div className="flex justify-center pt-3 pb-2">
									<motion.div
										className="w-12 h-1.5 bg-gray-300 rounded-full"
										whileTap={{ scale: 0.9 }}
									/>
								</div>

								{/* Header */}
								<div className="flex items-center justify-between px-5 pb-4 pt-2 border-b border-gray-100">
									<div className="flex items-center gap-3">
										{icon && (
											<span className="text-emerald-600 text-xl">
												{icon}
											</span>
										)}
										<h3 className="text-lg font-bold text-gray-800">
											{label || placeholder}
										</h3>
									</div>
									<motion.button
										whileTap={{ scale: 0.9 }}
										onClick={() => setIsOpen(false)}
										className="p-2 hover:bg-gray-100 rounded-full transition-colors"
									>
										<FiX className="w-5 h-5 text-gray-500" />
									</motion.button>
								</div>

								{/* Search Input */}
								{searchable && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.1 }}
										className="px-5 py-3 border-b border-gray-100"
									>
										<div className="relative">
											<FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
											<input
												ref={searchInputRef}
												type="text"
												value={searchQuery}
												onChange={(e) =>
													setSearchQuery(
														e.target.value
													)
												}
												placeholder="Tìm kiếm..."
												className="w-full pl-12 pr-4 py-3.5 text-base border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 bg-gray-50 transition-all duration-200"
												onClick={(e) =>
													e.stopPropagation()
												}
											/>
										</div>
									</motion.div>
								)}

								{/* Items List - Mobile */}
								<div className="flex-1 overflow-y-auto mobile-scrollbar px-2 py-2">
									{filteredItems.length > 0 ? (
										filteredItems.map((item, index) => {
											const isSelected =
												(defaultItem &&
													item.id ===
														defaultItem.id &&
													value === '') ||
												item.label === value ||
												String(item.id) === value;

											const isDefaultItem =
												defaultItem && index === 0;

											return (
												<div key={item.id}>
													<motion.button
														custom={index}
														variants={itemVariants}
														initial="hidden"
														animate="visible"
														whileTap={{
															scale: 0.98,
														}}
														onClick={() =>
															handleSelect(item)
														}
														className={cn(
															'w-full text-left px-5 py-4 text-base cursor-pointer relative rounded-2xl mx-1 my-1 transition-all duration-200',
															isSelected
																? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/30'
																: 'text-gray-700 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 active:scale-[0.98]'
														)}
													>
														<span className="flex items-center justify-between">
															<span className="text-base">
																{item.label}
															</span>

															{/* Checkmark */}
															{isSelected && (
																<motion.div
																	initial={{
																		scale: 0,
																		rotate: -180,
																	}}
																	animate={{
																		scale: 1,
																		rotate: 0,
																	}}
																	transition={{
																		type: 'spring',
																		stiffness: 500,
																		damping: 25,
																	}}
																>
																	<FiCheck className="w-5 h-5" />
																</motion.div>
															)}
														</span>
													</motion.button>

													{/* Divider */}
													{isDefaultItem &&
														filteredItems.length >
															1 && (
															<motion.div
																initial={{
																	scaleX: 0,
																}}
																animate={{
																	scaleX: 1,
																}}
																transition={{
																	delay: 0.15,
																	duration: 0.3,
																}}
																className="my-2 mx-4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-center"
															/>
														)}
												</div>
											);
										})
									) : (
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.2 }}
											className="px-4 py-16 text-center"
										>
											<motion.div
												initial={{ y: -10 }}
												animate={{ y: 0 }}
												transition={{
													repeat: Infinity,
													repeatType: 'reverse',
													duration: 1.5,
													ease: 'easeInOut',
												}}
												className="text-gray-400 mb-3"
											>
												<svg
													className="w-16 h-16 mx-auto opacity-50"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
													/>
												</svg>
											</motion.div>
											<p className="text-base text-gray-500 font-medium">
												Không tìm thấy kết quả
											</p>
										</motion.div>
									)}
								</div>

								{/* Safe area bottom padding */}
								<div className="h-safe-bottom bg-white" />
							</motion.div>
						)}
					</>
				)}
			</AnimatePresence>

			{/* Custom Scrollbar Styles */}
			<style jsx global>{`
				.custom-scrollbar {
					overflow-y: auto;
					overflow-x: hidden;
				}

				.custom-scrollbar::-webkit-scrollbar {
					width: 6px;
				}

				.custom-scrollbar::-webkit-scrollbar-track {
					background: transparent;
					border-radius: 10px;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb {
					background: rgb(167, 243, 208);
					border-radius: 10px;
					transition: background 0.2s;
				}

				.custom-scrollbar::-webkit-scrollbar-thumb:hover {
					background: rgb(110, 231, 183);
				}

				/* Mobile scrollbar - thinner and more subtle */
				.mobile-scrollbar::-webkit-scrollbar {
					width: 4px;
				}

				.mobile-scrollbar::-webkit-scrollbar-track {
					background: transparent;
				}

				.mobile-scrollbar::-webkit-scrollbar-thumb {
					background: rgba(167, 243, 208, 0.5);
					border-radius: 10px;
				}

				/* Safe area for iOS */
				.h-safe-bottom {
					height: env(safe-area-inset-bottom);
					min-height: 20px;
				}
			`}</style>
		</div>
	);
}
