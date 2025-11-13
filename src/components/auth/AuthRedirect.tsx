import Link from 'next/link';

export default function AuthRedirect({
	text,
	linkText,
	href,
}: {
	text: string;
	linkText: string;
	href: string;
}) {
	return (
		<div className="mt-6 text-center">
			<p className="text-gray-600 dark:text-gray-400">
				{text}{' '}
				<Link
					href={href}
					className="text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium underline underline-offset-2 transition-colors duration-200"
				>
					{linkText}
				</Link>
			</p>
		</div>
	);
}
