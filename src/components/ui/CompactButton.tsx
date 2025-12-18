// components/ui/CompactButton.tsx
'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CompactButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
	icon?: ReactNode;
}

export default function CompactButton({
	children,
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	icon,
	className,
	disabled,
	...props
}: CompactButtonProps) {
	const sizeClasses = {
		sm: 'px-3 py-2 text-xs min-w-[70px]',
		md: 'px-4 py-2 text-sm min-w-[120px]',
		lg: 'px-6 py-2.5 text-base min-w-[140px]',
	};

	// Icon size theo button size
	const iconSizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-5 h-5',
		lg: 'w-5 h-5',
	};

	const variants = {
		primary: `
			bg-gradient-to-r from-emerald-500 to-teal-600
			text-white 
			shadow-md shadow-emerald-500/20
			hover:from-emerald-600 hover:to-teal-700
			hover:shadow-lg hover:shadow-emerald-500/30
		`,
		secondary: `
			bg-white
			text-emerald-600
			shadow-md shadow-emerald-500/10
			hover:bg-emerald-50
			hover:shadow-lg hover:shadow-emerald-500/20
		`,
		outline: `
			bg-gray-800/50
			text-emerald-400
			border border-gray-700
			shadow-sm shadow-gray-900/20
			hover:bg-gray-700/60
			hover:border-gray-600
			hover:text-emerald-300
			hover:shadow-md hover:shadow-emerald-500/10
		`,
		ghost: `
			bg-gray-800/80
			text-gray-200
			shadow-sm shadow-gray-900/20
			hover:bg-gray-700/80
			hover:text-white
			hover:shadow-md hover:shadow-gray-900/30
		`,
	};

	return (
		<button
			disabled={disabled}
			className={cn(
				`font-medium rounded-lg cursor-pointer
				transition-all duration-300 ease-out
				hover:scale-[1.02]
				active:scale-[0.98]
				focus:outline-none focus:ring-2 focus:ring-offset-2
				disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none`,
				icon ? 'flex items-center justify-center gap-2' : '',
				sizeClasses[size],
				variants[variant],
				variant === 'primary' && 'focus:ring-emerald-400/50',
				variant === 'secondary' && 'focus:ring-emerald-400/50',
				variant === 'outline' && 'focus:ring-emerald-400/50',
				variant === 'ghost' && 'focus:ring-gray-500/50',
				fullWidth && 'w-full',
				className
			)}
			{...props}
		>
			{/* Icon */}
			{icon && (
				<span
					className={cn(
						'flex items-center justify-center flex-shrink-0',
						iconSizeClasses[size]
					)}
				>
					{icon}
				</span>
			)}

			{/* Text */}
			<span className="whitespace-nowrap">{children}</span>
		</button>
	);
}
