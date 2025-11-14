'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	isLoading?: boolean;
	loadingText?: string;
	size?: 'sm' | 'md' | 'lg';
	variant?: 'primary' | 'secondary';
	fullWidth?: boolean;
}

export default function GradientButton({
	children,
	isLoading = false,
	loadingText = 'Đang xử lý...',
	size = 'md',
	variant = 'primary',
	fullWidth = true,
	className,
	disabled,
	...props
}: GradientButtonProps) {
	const sizeClasses = {
		sm: 'py-2.5 px-4 text-sm',
		md: 'py-3.5 px-4 text-base',
		lg: 'py-4 px-6 text-lg',
	};

	const variantClasses = {
		primary: `
			bg-gradient-to-r from-emerald-500 to-teal-600 
			text-white 
			hover:shadow-emerald-500/30
			focus:ring-emerald-500/50
		`,
		secondary: `
			bg-gradient-to-r from-slate-100 to-gray-100
			text-gray-700
			hover:shadow-gray-400/30
			focus:ring-gray-400/50
			border border-gray-200
		`,
	};

	const primaryOverlay = variant === 'primary' && (
		<>
			<div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
			</div>
		</>
	);

	const secondaryOverlay = variant === 'secondary' && (
		<>
			<div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
			<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
			</div>
		</>
	);

	return (
		<button
			disabled={disabled || isLoading}
			className={cn(
				`relative group overflow-hidden cursor-pointer  
				font-bold rounded-xl transition-all duration-300  
				transform hover:scale-[1.02] hover:shadow-xl  
				focus:outline-none active:scale-[0.98] disabled:opacity-70  
				disabled:cursor-not-allowed disabled:transform-none`,
				fullWidth ? 'w-full mt-3' : '',
				sizeClasses[size],
				variantClasses[variant],
				className
			)}
			{...props}
		>
			{primaryOverlay}
			{secondaryOverlay}

			<span className="relative z-10">
				{isLoading ? (
					<div className="flex items-center justify-center gap-2">
						<svg
							className="animate-spin h-5 w-5"
							viewBox="0 0 24 24"
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
								fill="none"
							></circle>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							></path>
						</svg>
						{loadingText}
					</div>
				) : (
					children
				)}
			</span>
		</button>
	);
}
