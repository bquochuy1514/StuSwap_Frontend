import Link from 'next/link';

export default function Logo({
	width = 300,
	height = 300,
	canClick = true,
	theme = 'light',
}) {
	return canClick ? (
		<Link
			href="/"
			className="flex-shrink-0 hover:opacity-80 transition-opacity"
		>
			<div className="flex items-center justify-center h-full w-full">
				<img
					src={
						theme === 'light'
							? '/student_swap_logo.png'
							: '/student_swap_logo_2.png'
					}
					alt="Student Swap Logo"
					width={width}
					height={height}
					className="cursor-pointer"
				/>
			</div>
		</Link>
	) : (
		<div className="flex items-center justify-center h-full w-full">
			<img
				src={
					theme === 'light'
						? '/student_swap_logo.png'
						: '/student_swap_logo_2.png'
				}
				alt="Student Swap Logo"
				width={width}
				height={height}
			/>
		</div>
	);
}
