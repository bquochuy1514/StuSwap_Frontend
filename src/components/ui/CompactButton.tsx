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
		sm: 'px-4 py-1.5 text-xs min-w-[70px]',
		md: 'px-5 py-2.5 text-sm min-w-[120px]',
		lg: 'px-6 py-3 text-base min-w-[140px]',
	};

	// Icon size theo button size
	const iconSizeClasses = {
		sm: 'w-3 h-3',
		md: 'w-4 h-4',
		lg: 'w-5 h-5',
	};

	const variants = {
		primary: `
			bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600
			text-white 
			shadow-md shadow-emerald-500/20
			hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700
		`,
		secondary: `
			bg-white
			text-emerald-600
			border-2 border-emerald-300
			shadow-md shadow-emerald-500/10
			hover:bg-emerald-50 hover:border-emerald-400
		`,
		outline: `
			bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600
			text-white
			border-2 border-white
			shadow-md shadow-emerald-500/20
			hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-700
			hover:border-white/90
		`,
		ghost: `
			bg-gradient-to-br from-orange-500 via-orange-600 to-red-600
			text-white
			shadow-md shadow-orange-500/20
			hover:from-orange-600 hover:via-orange-700 hover:to-red-700
		`,
	};

	return (
		<button
			disabled={disabled}
			className={cn(
				`font-semibold rounded-xl cursor-pointer
				transition-all duration-200 ease-out
				hover:scale-[1.03] hover:shadow-lg
				active:scale-[0.98]
				focus:outline-none
				disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none`,
				icon ? 'flex items-center justify-center gap-2' : '',
				sizeClasses[size],
				variants[variant],
				variant === 'primary' &&
					'hover:shadow-emerald-500/30 focus:ring-emerald-400/50',
				variant === 'secondary' &&
					'hover:shadow-emerald-500/20 focus:ring-emerald-400/50',
				variant === 'outline' &&
					'hover:shadow-emerald-500/30 focus:ring-emerald-400/50',
				variant === 'ghost' &&
					'hover:shadow-orange-500/30 focus:ring-orange-400/50',
				fullWidth && 'w-full',
				className
			)}
			{...props}
		>
			{/* Icon */}
			{icon && (
				<span className={cn('flex-shrink-0', iconSizeClasses[size])}>
					{icon}
				</span>
			)}

			{/* Text */}
			<span>{children}</span>
		</button>
	);
}
