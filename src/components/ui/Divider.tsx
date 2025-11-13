export default function Divider({ text }: { text: string }) {
	return (
		<div className="relative my-6 flex items-center">
			{/* Đường gạch - nhẹ, có độ trong */}
			<div className="flex-grow border-t border-gray-300"></div>

			{/* Khoảng cách và chữ ở giữa */}
			<span className="mx-3 px-3 bg-transparent text-gray-500 text-sm font-medium">
				{text}
			</span>

			{/* Đường gạch bên phải */}
			<div className="flex-grow border-t border-gray-300"></div>
		</div>
	);
}
