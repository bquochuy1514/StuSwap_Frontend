'use client';

import React, { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import ShowPasswordButton from '../shared/ShowPassButton';
import { AuthInputProps } from '@/types/auth';

interface InputProps extends AuthInputProps {
	size?: 'sm' | 'md' | 'lg';
}

export default function Input({
	label,
	name,
	value,
	onChange,
	placeholder,
	type,
	icon,
	disabled,
	error,
	theme = 'light',
	showPasswordToggle = false,
	showPassword = false,
	onTogglePassword,
	size = 'md', // default size
}: InputProps) {
	const [focused, setFocused] = useState(false);

	const colors = {
		light: {
			text: 'text-gray-800',
			bg: 'bg-white',
			border: 'border-gray-300',
			focusRing: 'focus:ring-emerald-500/30 focus:border-emerald-500',
			placeholder: 'placeholder:text-gray-400',
			label: 'text-gray-700',
			icon: 'text-gray-400',
		},
		dark: {
			text: 'text-gray-200',
			bg: 'bg-gray-800',
			border: 'border-gray-600',
			focusRing: 'focus:ring-teal-500/30 focus:border-teal-500',
			placeholder: 'placeholder:text-gray-400/70',
			label: 'text-gray-200',
			icon: 'text-gray-400',
		},
	};

	const sizeClasses = {
		sm: {
			input: 'py-2 text-sm',
			label: 'text-xs',
			icon: 'text-base',
			paddingLeft: 'pl-10',
			paddingRight: 'pr-10',
			iconLeft: 'pl-3',
			iconRight: 'right-1.5',
		},
		md: {
			input: 'py-3 text-base',
			label: 'text-sm',
			icon: 'text-lg',
			paddingLeft: 'pl-12',
			paddingRight: 'pr-12',
			iconLeft: 'pl-4',
			iconRight: 'right-2',
		},
		lg: {
			input: 'py-4 text-lg',
			label: 'text-base',
			icon: 'text-xl',
			paddingLeft: 'pl-14',
			paddingRight: 'pr-14',
			iconLeft: 'pl-5',
			iconRight: 'right-3',
		},
	};

	const current = colors[theme];
	const currentSize = sizeClasses[size];

	return (
		<div className="group space-y-2 relative">
			<label
				htmlFor={name}
				className={`block font-semibold mb-2 transition-colors group-focus-within:text-emerald-600 ${current.label} ${currentSize.label}`}
			>
				{label}
			</label>

			<div className="relative">
				{/* Left Icon */}
				{icon && (
					<div
						className={`absolute inset-y-0 left-0 ${currentSize.iconLeft} flex items-center pointer-events-none z-10`}
					>
						{React.cloneElement(icon, {
							className: `transition-all duration-300 ${
								currentSize.icon
							} ${
								focused
									? 'text-emerald-600 scale-110'
									: error
									? 'text-red-500'
									: current.icon
							}`,
						})}
					</div>
				)}

				{/* Input */}
				<input
					id={name}
					name={name}
					type={type}
					disabled={disabled}
					value={value}
					onChange={onChange}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					placeholder={placeholder}
					className={`w-full ${current.bg} ${
						current.text
					} border rounded-xl ${
						icon ? currentSize.paddingLeft : 'pl-4'
					} ${
						showPasswordToggle ? currentSize.paddingRight : 'pr-4'
					} ${
						currentSize.input
					} focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-400 ${
						error
							? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
							: `${current.border} ${current.focusRing}`
					} ${current.placeholder} ${
						disabled ? 'cursor-not-allowed' : ''
					}`}
				/>

				{/* Show/Hide Password */}
				{showPasswordToggle && onTogglePassword && (
					<div
						className={`absolute inset-y-0 ${currentSize.iconRight} flex items-center`}
					>
						<ShowPasswordButton
							show={showPassword}
							onClick={onTogglePassword}
							size={size}
						/>
					</div>
				)}
			</div>

			{/* Error */}
			{error && (
				<div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 animate-shake">
					<FiAlertCircle className="flex-shrink-0 mt-0.5 text-base" />
					<span className="leading-relaxed">{error}</span>
				</div>
			)}
		</div>
	);
}
