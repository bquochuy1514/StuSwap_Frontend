'use client';

import React, { useState } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import ShowPasswordButton from '../shared/ShowPassButton';

interface InputProps {
	label: string;
	name: string;
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	placeholder?: string;
	type?: string;
	icon?: React.ReactElement;
	disabled?: boolean;
	error?: string;
	theme?: 'light' | 'dark';
	showPasswordToggle?: boolean;
	showPassword?: boolean;
	onTogglePassword?: () => void;
	size?: 'sm' | 'md' | 'lg';
	as?: 'input' | 'textarea';
	rows?: number;
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
	size = 'md',
	as = 'input',
	rows = 4,
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
			input: 'py-2.5 text-sm',
			textarea: 'py-2.5 text-sm',
			label: 'text-sm',
			icon: 'text-base',
			paddingLeft: 'pl-10',
			paddingRight: 'pr-10',
			iconLeft: 'pl-3',
			iconRight: 'right-1.5',
			iconTop: 'top-3',
			error: 'text-xs p-2.5',
			errorIcon: 'text-sm',
		},
		md: {
			input: 'py-3 text-base',
			textarea: 'py-3 text-base',
			label: 'text-sm',
			icon: 'text-lg',
			paddingLeft: 'pl-12',
			paddingRight: 'pr-12',
			iconLeft: 'pl-4',
			iconRight: 'right-2',
			iconTop: 'top-3.5',
			error: 'text-sm p-3',
			errorIcon: 'text-base',
		},
		lg: {
			input: 'py-4 text-lg',
			textarea: 'py-4 text-lg',
			label: 'text-base',
			icon: 'text-xl',
			paddingLeft: 'pl-14',
			paddingRight: 'pr-14',
			iconLeft: 'pl-5',
			iconRight: 'right-3',
			iconTop: 'top-4',
			error: 'text-base p-3.5',
			errorIcon: 'text-lg',
		},
	};

	const current = colors[theme];
	const currentSize = sizeClasses[size];

	const baseInputClasses = `w-full ${current.bg} ${
		current.text
	} border rounded-xl ${
		icon && as === 'input' ? currentSize.paddingLeft : 'pl-4'
	} ${
		showPasswordToggle ? currentSize.paddingRight : 'pr-4'
	} focus:outline-none focus:ring-2 transition-all duration-300 hover:border-gray-400 ${
		error
			? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
			: `${current.border} ${current.focusRing}`
	} ${current.placeholder} ${disabled ? 'cursor-not-allowed' : ''} ${
		as === 'textarea' ? 'block align-top' : ''
	}`;

	return (
		<div className="group relative">
			<label
				htmlFor={name}
				className={`block font-semibold mb-2 transition-colors group-focus-within:text-emerald-600 ${current.label} ${currentSize.label}`}
			>
				{label}
			</label>

			<div className="relative">
				{/* Left Icon - Only for input */}
				{icon && as === 'input' && (
					<div
						className={`absolute inset-y-0 left-0 ${currentSize.iconLeft} flex items-center pointer-events-none z-10`}
					>
						{React.cloneElement(
							icon as React.ReactElement<{ className?: string }>,
							{
								className: `transition-all duration-300 ${
									currentSize.icon
								} ${
									focused
										? 'text-emerald-600 scale-110'
										: error
										? 'text-red-500'
										: current.icon
								}`,
							}
						)}
					</div>
				)}

				{/* Top Icon - For textarea */}
				{icon && as === 'textarea' && (
					<div
						className={`absolute ${currentSize.iconTop} left-0 ${currentSize.iconLeft} flex items-start pointer-events-none z-10`}
					>
						{React.cloneElement(
							icon as React.ReactElement<{ className?: string }>,
							{
								className: `transition-all duration-300 ${
									currentSize.icon
								} ${
									focused
										? 'text-emerald-600 scale-110'
										: error
										? 'text-red-500'
										: current.icon
								}`,
							}
						)}
					</div>
				)}

				{/* Input or Textarea */}
				{as === 'input' ? (
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
						className={`${baseInputClasses} ${currentSize.input}`}
					/>
				) : (
					<textarea
						id={name}
						name={name}
						disabled={disabled}
						value={value}
						onChange={onChange}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						placeholder={placeholder}
						rows={rows}
						className={`${baseInputClasses} ${
							currentSize.textarea
						} ${icon ? currentSize.paddingLeft : ''} resize-none`}
					/>
				)}

				{/* Show/Hide Password - Only for input */}
				{as === 'input' && showPasswordToggle && onTogglePassword && (
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
				<div
					className={`flex items-start gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg animate-shake mt-2 ${currentSize.error}`}
				>
					<FiAlertCircle
						className={`flex-shrink-0 mt-0.5 ${currentSize.errorIcon}`}
					/>
					<span className="leading-relaxed">{error}</span>
				</div>
			)}
		</div>
	);
}
