// components/ui/SearchInput.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchInputProps {
	className?: string;
	value: string;
	onChange: (value: string) => void;
	onSearch?: () => void;
	placeholder?: string;
	showIcon?: boolean;
	expandable?: boolean;
	size?: 'sm' | 'md' | 'lg';
}

export default function SearchInput({
	className,
	value,
	onChange,
	onSearch,
	placeholder = 'Tìm kiếm...',
	showIcon = true,
	expandable = false,
	size = 'md',
}: SearchInputProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isMounted, setIsMounted] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	// Size configurations
	const sizeClasses = {
		sm: 'h-9', // 36px
		md: 'h-11', // 44px
		lg: 'h-14', // 56px
	};

	const isMobile = () => {
		return typeof window !== 'undefined' && window.innerWidth < 768;
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onSearch) {
			onSearch();
			if (expandable) {
				setIsExpanded(false);
				inputRef.current?.blur();
			}
		}
		if (e.key === 'Escape' && expandable) {
			setIsExpanded(false);
			inputRef.current?.blur();
		}
	};

	const handleFocus = () => {
		if (expandable && isMobile()) {
			setIsExpanded(true);
		}
	};

	const handleClose = () => {
		setIsExpanded(false);
		inputRef.current?.blur();
	};

	const handleSearchClick = () => {
		if (onSearch) {
			onSearch();
		}
		if (expandable) {
			setIsExpanded(false);
			inputRef.current?.blur();
		}
	};

	const handleOverlayClick = () => {
		// Keep expanded on mobile
	};

	useEffect(() => {
		if (expandable && isExpanded) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [expandable, isExpanded]);

	if (!expandable) {
		return (
			<div
				className={cn(
					'relative flex-1 group',
					sizeClasses[size],
					className
				)}
			>
				{showIcon && (
					<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 group-focus-within:text-emerald-500 transition-colors" />
				)}
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className={cn(
						'w-full h-full pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent',
						showIcon && 'pl-9'
					)}
				/>
			</div>
		);
	}

	return (
		<>
			{/* Overlay backdrop */}
			<AnimatePresence>
				{isExpanded && isMounted && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-40 bg-white md:hidden"
						onClick={handleOverlayClick}
					/>
				)}
			</AnimatePresence>

			{/* Search Input Container */}
			<motion.div
				className={cn(
					'relative flex-1 group',
					!isExpanded && sizeClasses[size],
					className,
					isExpanded &&
						isMounted && [
							'!fixed !top-0 !left-0 !right-0 z-50 bg-white shadow-lg md:!relative md:!top-auto md:!left-auto md:!right-auto md:shadow-none',
							`md:${sizeClasses[size]}`,
						]
				)}
				initial={false}
				animate={
					isExpanded
						? {
								y: 0,
								scale: 1,
						  }
						: {
								y: 0,
								scale: 1,
						  }
				}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
			>
				<div
					className={cn(
						'relative flex items-center',
						isExpanded ? 'h-14 md:h-11' : sizeClasses[size]
					)}
				>
					{/* Back button */}
					<AnimatePresence>
						{isExpanded && isMounted && (
							<motion.button
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -10 }}
								transition={{ duration: 0.2 }}
								onClick={handleClose}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors z-10 md:hidden"
								type="button"
							>
								<FaArrowLeft className="w-4.5 h-4.5" />
							</motion.button>
						)}
					</AnimatePresence>

					{/* Search icon */}
					{showIcon && (!isExpanded || !isMounted) && (
						<FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5 group-focus-within:text-emerald-500 transition-colors z-10" />
					)}

					<input
						ref={inputRef}
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={handleKeyDown}
						onFocus={handleFocus}
						placeholder={placeholder}
						className={cn(
							'w-full h-full text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent',
							!isExpanded && showIcon ? 'pl-9 pr-3' : 'pr-3',
							isExpanded &&
								'pl-12 pr-12 py-3.5 text-base md:pl-9 md:pr-3 md:py-0 md:text-sm'
						)}
					/>

					{/* Search button */}
					<AnimatePresence>
						{isExpanded && isMounted && (
							<motion.button
								initial={{ opacity: 0, x: 10 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 10 }}
								transition={{ duration: 0.2 }}
								onClick={handleSearchClick}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-600 transition-colors z-10 md:hidden"
								type="button"
							>
								<FaSearch className="w-4.5 h-4.5" />
							</motion.button>
						)}
					</AnimatePresence>
				</div>
			</motion.div>
		</>
	);
}
