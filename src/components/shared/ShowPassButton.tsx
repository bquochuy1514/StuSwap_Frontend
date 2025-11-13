'use client';

import { FiEye, FiEyeOff } from 'react-icons/fi';

interface ShowPasswordButtonProps {
	show: boolean;
	onClick: () => void;
	size?: 'sm' | 'md' | 'lg';
}

export default function ShowPasswordButton({
	show,
	onClick,
	size = 'md',
}: ShowPasswordButtonProps) {
	const sizeClasses = {
		sm: 'text-base',
		md: 'text-xl',
		lg: 'text-2xl',
	};

	return (
		<button
			type="button"
			onClick={onClick}
			tabIndex={-1}
			className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none p-1"
			aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
		>
			{show ? (
				<FiEyeOff className={sizeClasses[size]} />
			) : (
				<FiEye className={sizeClasses[size]} />
			)}
		</button>
	);
}
