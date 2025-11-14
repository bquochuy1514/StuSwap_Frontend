'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	icon?: ReactNode;
	isActive?: boolean;
	gradientFrom?: string;
	gradientTo?: string;
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
}

export default function ActiveButton({
	children,
	icon,
	isActive = false,
	gradientFrom = 'from-emerald-500',
	gradientTo = 'to-teal-600',
	size = 'md',
	fullWidth = true,
	className,
	disabled,
	...props
}: IconButtonProps) {
	const sizeClasses = {
		sm: 'py-2.5 px-4 text-sm gap-2',
		md: 'py-3 px-4 text-base gap-3',
		lg: 'py-3.5 px-5 text-lg gap-3',
	};

	const iconSizeClasses = {
		sm: 'w-4 h-5',
		md: 'w-5 h-5',
		lg: 'w-6 h-6',
	};

	return (
		<button
			disabled={disabled}
			className={cn(
				`w-full flex items-center bg-gradient-to-br cursor-pointer font-medium rounded-xl transition-all duration-300`,
				sizeClasses[size],
				isActive
					? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white shadow-lg transform scale-[1.01]`
					: 'text-gray-700 hover:bg-gray-50 hover:shadow-md',
				disabled && 'opacity-50 cursor-not-allowed',
				className
			)}
			{...props}
		>
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
			<span className="flex-1 text-left">{children}</span>
		</button>
	);
}
