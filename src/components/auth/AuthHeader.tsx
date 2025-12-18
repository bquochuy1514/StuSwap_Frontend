export default function AuthHeader({
	title,
	content1,
	content2,
	showStudentSwap = true,
	theme = 'light', // 'light' | 'dark'
}: {
	title: string;
	content1: string;
	content2: string;
	showStudentSwap?: boolean;
	theme: 'light' | 'dark';
}) {
	// Define gradient colors based on theme
	const gradients = {
		light: {
			title: 'from-emerald-600 via-teal-600 to-emerald-700',
			studentSwap: 'from-emerald-600 to-teal-600',
			text: 'text-gray-600',
		},
		dark: {
			title: 'from-gray-100 via-gray-200 to-gray-300',
			studentSwap: 'from-gray-100 to-gray-200',
			text: 'text-gray-300',
		},
	};

	const current = gradients[theme];

	return (
		<div className="text-center mb-6">
			<div className="relative inline-block mb-3">
				<h1
					className={`text-3xl font-bold bg-gradient-to-r ${current.title} bg-clip-text text-transparent mb-2`}
				>
					{title}
				</h1>
				<div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-lg blur-lg opacity-20"></div>
			</div>

			<p className={`text-base font-light tracking-wide ${current.text}`}>
				{content1}{' '}
				{showStudentSwap && (
					<span
						className={`font-semibold text-transparent bg-gradient-to-r ${current.studentSwap} bg-clip-text`}
					>
						StudentSwap {' — '}
					</span>
				)}
				{content2}
			</p>

			<div className="flex justify-center gap-2 mt-5">
				<div
					className={`w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full`}
				></div>
				<div
					className={`w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full`}
				></div>
				<div
					className={`w-16 h-1 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-full`}
				></div>
			</div>
		</div>
	);
}
