// src/app/(main)/(public)/contact/page.tsx
import Link from 'next/link';
import React from 'react';
import {
	MdEmail,
	MdPhone,
	MdAccessTime,
	MdLocationOn,
	MdSchool,
} from 'react-icons/md';
import { FaFacebookF, FaGithub } from 'react-icons/fa';
import { BiMessageDetail } from 'react-icons/bi';

export default function ContactPage() {
	const contactInfo = [
		{
			icon: MdEmail,
			title: 'Email',
			content: 'bquochuy260405@gmail.com',
			link: 'mailto:bquochuy260405@gmail.com',
			description: 'Gửi email cho mình nếu bạn cần hỗ trợ',
		},
		{
			icon: FaFacebookF,
			title: 'Facebook',
			content: 'Bùi Quốc Huy',
			link: 'https://www.facebook.com/bquochuy1514',
			description: 'Nhắn tin trực tiếp qua Facebook',
		},
		{
			icon: FaGithub,
			title: 'Github',
			content: 'Bùi Quốc Huy',
			link: 'https://github.com/bquochuy1514',
			description: 'Liên hệ với mình qua Github',
		},
	];

	const workingHours = [
		{ day: 'Thứ 2 - Thứ 6', time: '12:00 - 22:00' },
		{ day: 'Thứ 7', time: '8:00 - 19:00' },
		{ day: 'Chủ nhật', time: 'Nghỉ' },
	];

	return (
		<div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
			{/* Header Section */}
			<div className="text-center mb-10">
				<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
					<BiMessageDetail className="w-8 h-8 text-white" />
				</div>
				<h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
					Liên hệ với mình
				</h1>
				<p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
					Mình là sinh viên và đây là dự án cá nhân về chợ đồ cũ dành
					cho sinh viên. Nếu bạn có thắc mắc, góp ý hoặc cần hỗ trợ,
					đừng ngại liên hệ nhé!
				</p>
			</div>

			<div className="grid lg:grid-cols-3 gap-6 mb-8">
				{/* Contact Cards */}
				{contactInfo.map((item, index) => (
					<Link
						key={index}
						href={item.link}
						target={
							item.link.startsWith('http') ? '_blank' : undefined
						}
						rel={
							item.link.startsWith('http')
								? 'noopener noreferrer'
								: undefined
						}
						className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1"
					>
						<div className="flex items-start gap-4">
							<div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
								<item.icon className="w-6 h-6 text-emerald-600" />
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="font-semibold text-gray-900 mb-1">
									{item.title}
								</h3>
								<p className="text-emerald-600 font-medium mb-1 break-words">
									{item.content}
								</p>
								<p className="text-sm text-gray-500">
									{item.description}
								</p>
							</div>
						</div>
					</Link>
				))}
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Working Hours */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
							<MdAccessTime className="w-5 h-5 text-blue-600" />
						</div>
						<h2 className="text-lg font-semibold text-gray-900">
							Thời gian phản hồi
						</h2>
					</div>
					<div className="space-y-3">
						{workingHours.map((schedule, index) => (
							<div
								key={index}
								className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
							>
								<span className="text-gray-700 font-medium">
									{schedule.day}
								</span>
								<span
									className={`text-sm font-medium ${
										schedule.time === 'Nghỉ'
											? 'text-gray-400'
											: 'text-emerald-600'
									}`}
								>
									{schedule.time}
								</span>
							</div>
						))}
					</div>
					<p className="text-xs text-gray-500 mt-4 italic">
						* Mình sẽ cố gắng phản hồi trong vòng 24h
					</p>
				</div>

				{/* About Project */}
				<div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<MdSchool className="w-5 h-5 text-emerald-600" />
						</div>
						<h2 className="text-lg font-semibold text-gray-900">
							Về dự án này
						</h2>
					</div>
					<div className="space-y-3 text-sm text-gray-700 leading-relaxed">
						<p>
							Đây là dự án cá nhân được phát triển bởi sinh viên
							với mục đích tạo ra một nền tảng mua bán đồ cũ tiện
							lợi cho cộng đồng sinh viên.
						</p>
						<p>
							Dự án này không phải là một doanh nghiệp hay nền
							tảng thương mại điện tử chính thức, mà chỉ là một
							ứng dụng web đơn giản giúp kết nối sinh viên với
							nhau.
						</p>
						<div className="pt-3 border-t border-emerald-200">
							<p className="font-medium text-emerald-700 mb-2">
								Công nghệ sử dụng:
							</p>
							<div className="flex flex-wrap gap-2">
								{[
									'Next.js (Frontend)',
									'Nest.js (Backend)',
									'MySQL (Database)',
									'TypeScript (Language)',
									'Tailwind CSS (Styling)',
									'Node.js (Runtime)',
								].map((tech) => (
									<span
										key={tech}
										className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm"
									>
										{tech}
									</span>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* FAQ Quick Links */}
			<div className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
				<h2 className="text-lg font-semibold text-gray-900 mb-4">
					Câu hỏi thường gặp
				</h2>
				<div className="grid md:grid-cols-2 gap-4">
					<Link
						href="/faq"
						className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
					>
						<div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
							<span className="text-emerald-600 font-bold">
								?
							</span>
						</div>
						<span className="text-gray-700 group-hover:text-emerald-600 transition-colors">
							Hướng dẫn sử dụng
						</span>
					</Link>
					<Link
						href="/terms"
						className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
					>
						<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
							<span className="text-blue-600 font-bold">📋</span>
						</div>
						<span className="text-gray-700 group-hover:text-blue-600 transition-colors">
							Quy định đăng tin
						</span>
					</Link>
				</div>
			</div>

			{/* Note */}
			<div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
				<p className="text-sm text-amber-800 flex items-start gap-2">
					<span className="text-lg">💡</span>
					<span>
						<strong>Lưu ý:</strong> Đây là dự án học tập và không
						mang tính chất thương mại. Mọi giao dịch diễn ra hoàn
						toàn giữa người mua và người bán. Mình chỉ đóng vai trò
						cung cấp nền tảng kết nối.
					</span>
				</p>
			</div>
		</div>
	);
}
