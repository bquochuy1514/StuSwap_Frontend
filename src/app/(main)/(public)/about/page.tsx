// src/app/(main)/(public)/about/page.tsx
import Link from 'next/link';
import React from 'react';
import {
	MdSchool,
	MdRecycling,
	MdSavings,
	MdSpeed,
	MdVerifiedUser,
	MdPerson,
	MdCode,
} from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { FaLightbulb, FaHandshake } from 'react-icons/fa';
import PageHeader from '@/components/ui/PageHeader';

export default function AboutPage() {
	const values = [
		{
			icon: MdSpeed,
			title: 'Tiện lợi',
			description:
				'Mua bán nhanh chóng trong cùng cộng đồng sinh viên, không cần qua nhiều bước trung gian phức tạp.',
			bgColor: 'from-blue-100 to-blue-200',
		},
		{
			icon: MdSavings,
			title: 'Tiết kiệm',
			description:
				'Tối ưu chi phí khi mua đồ học tập, sách vở và đồ dùng cá nhân với giá sinh viên.',
			bgColor: 'from-emerald-100 to-emerald-200',
		},
		{
			icon: MdRecycling,
			title: 'Tái sử dụng',
			description:
				'Giảm rác thải, phát triển thói quen dùng lại đồ cũ, góp phần bảo vệ môi trường.',
			bgColor: 'from-green-100 to-green-200',
		},
		{
			icon: MdVerifiedUser,
			title: 'An toàn',
			description:
				'Xác minh email và đăng nhập giúp hạn chế tài khoản spam, tạo môi trường giao dịch đáng tin cậy.',
			bgColor: 'from-purple-100 to-purple-200',
		},
	];

	const techStack = [
		{ name: 'Next.js', category: 'Frontend' },
		{ name: 'Nest.js', category: 'Backend' },
		{ name: 'MySQL', category: 'Database' },
		{ name: 'TypeScript', category: 'Language' },
		{ name: 'TailwindCSS', category: 'Styling' },
		{ name: 'Node.js', category: 'Runtime' },
	];

	return (
		<div className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
			{/* Hero Section */}
			<PageHeader
				icon={<MdSchool />}
				title="Giới thiệu về StudentSwap"
				description="Một dự án cá nhân giúp sinh viên trao đổi đồ cũ nhanh chóng
					& tiện lợi"
			/>

			{/* Story Section */}
			<div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200 mb-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
						<FaLightbulb className="w-5 h-5 text-amber-600" />
					</div>
					<h2 className="text-2xl font-semibold text-gray-900">
						Câu chuyện dự án
					</h2>
				</div>
				<div className="space-y-4 text-gray-700 leading-relaxed">
					<p>
						Là một sinh viên, mình nhận thấy rằng nhiều bạn sinh
						viên thường gặp khó khăn trong việc tìm kiếm và mua sắm
						đồ dùng học tập với giá cả phải chăng. Trong khi đó,
						không ít bạn có những món đồ còn tốt nhưng không còn sử
						dụng nữa và không biết phải làm gì với chúng.
					</p>
					<p>
						Mình cũng để ý thấy rằng các nền tảng mua bán trực tuyến
						hiện tại thường quá rộng và không tập trung vào nhu cầu
						đặc thù của sinh viên. Việc tìm kiếm đồ phù hợp trong
						cộng đồng sinh viên trở nên khó khăn và mất thời gian.
					</p>
					<p>
						Từ những quan sát đó, StudentSwap ra đời với mong muốn
						tạo ra một không gian riêng biệt cho sinh viên - nơi các
						bạn có thể dễ dàng mua bán, trao đổi đồ cũ với nhau một
						cách nhanh chóng, tiện lợi và đáng tin cậy. Đây không
						chỉ là giải pháp giúp tiết kiệm chi phí mà còn góp phần
						xây dựng thói quen tiêu dùng bền vững trong cộng đồng
						sinh viên.
					</p>
					<p className="text-emerald-700 font-medium italic">
						StudentSwap được xây dựng bởi sinh viên, dành cho sinh
						viên - một nền tảng đơn giản nhưng hữu ích cho cuộc sống
						sinh viên.
					</p>
					<p className="text-emerald-700 font-medium italic">
						Để duy trì hoạt động của nền tảng và chi phí vận hành,
						StudentSwap có cung cấp một số dịch vụ tùy chọn như tin
						đẩy hoặc tài khoản Premium. Các dịch vụ này chỉ giúp
						tăng khả năng hiển thị của bài đăng và hoàn toàn không
						ảnh hưởng đến tính minh bạch hay kết quả giao dịch giữa
						sinh viên với nhau.
					</p>
				</div>
			</div>

			{/* Values Section */}
			<div className="mb-8">
				<div className="text-center mb-8">
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						Giá trị & Mục tiêu
					</h2>
					<p className="text-gray-600">
						Những giá trị cốt lõi mà StudentSwap hướng tới
					</p>
				</div>
				<div className="grid md:grid-cols-2 gap-6">
					{values.map((value, index) => (
						<div
							key={index}
							className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
						>
							<div className="flex items-start gap-4">
								<div
									className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${value.bgColor} rounded-xl flex items-center justify-center`}
								>
									<value.icon
										className={`w-6 h-6 bg-gradient-to-br`}
									/>
								</div>
								<div className="flex-1">
									<h3 className="font-semibold text-gray-900 mb-2">
										{value.title}
									</h3>
									<p className="text-sm text-gray-600 leading-relaxed">
										{value.description}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Tech Stack */}
			<div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-200 mb-8">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
						<MdCode className="w-5 h-5 text-slate-600" />
					</div>
					<h2 className="text-2xl font-semibold text-gray-900">
						Công nghệ sử dụng
					</h2>
				</div>
				<p className="text-gray-600 mb-6 leading-relaxed">
					StudentSwap được xây dựng với các công nghệ web hiện đại,
					đảm bảo hiệu suất tốt và trải nghiệm người dùng mượt mà.
				</p>
				<div className="flex flex-wrap gap-3">
					{techStack.map((tech, index) => (
						<div
							key={index}
							className="group bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300"
						>
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-gray-900">
									{tech.name}
								</span>
								<span className="text-xs text-gray-500">
									{tech.category}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-6 mb-8">
				{/* About Developer */}
				<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
							<MdPerson className="w-5 h-5 text-indigo-600" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900">
							Về mình
						</h2>
					</div>
					<div className="space-y-3 text-gray-700">
						<div className="flex items-start gap-2">
							<span className="font-semibold min-w-[80px]">
								Tên:
							</span>
							<span>Bùi Quốc Huy</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="font-semibold min-w-[80px]">
								Trường:
							</span>
							<span>
								Đại học Công nghệ Thông tin - ĐHQG TP.HCM
							</span>
						</div>
						<div className="flex items-start gap-2">
							<span className="font-semibold min-w-[80px]">
								Ngành:
							</span>
							<span>Thương Mại Điện Tử</span>
						</div>
						<div className="pt-4 border-t border-gray-200">
							<p className="text-sm leading-relaxed">
								Mình tạo ra StudentSwap với mong muốn áp dụng
								kiến thức đã học vào thực tế và tạo ra một sản
								phẩm hữu ích cho cộng đồng sinh viên. Đây là dự
								án cá nhân phục vụ mục đích học tập và hoàn toàn
								phi thương mại.
							</p>
						</div>
					</div>
				</div>

				{/* Disclaimer */}
				<div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
					<div className="flex items-center gap-3 mb-4">
						<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
							<FaHandshake className="w-5 h-5 text-amber-600" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900">
							Tuyên bố minh bạch
						</h2>
					</div>
					<div className="space-y-3 text-sm text-gray-700 leading-relaxed">
						<p className="font-medium text-amber-900">
							StudentSwap là dự án cá nhân được phát triển bởi
							sinh viên và không phải nền tảng thương mại điện tử
							chính thức.
						</p>
						<p>
							Mọi giao dịch mua bán diễn ra hoàn toàn giữa người
							mua và người bán. Mình chỉ đóng vai trò cung cấp nền
							tảng để kết nối các bạn sinh viên với nhau.
						</p>
						<p>
							Dự án này được xây dựng như một nền tảng học tập và
							hỗ trợ cộng đồng sinh viên. Một số tính năng nâng
							cao có thể yêu cầu phí duy trì hệ thống, nhưng mình
							không vận hành như một sàn thương mại điện tử doanh
							nghiệp.
						</p>
						<div className="pt-3 border-t border-amber-200">
							<p className="text-amber-800 font-medium">
								💡 Mình khuyến khích các bạn giao dịch cẩn thận,
								kiểm tra kỹ sản phẩm và gặp gỡ trực tiếp khi có
								thể.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Section */}
			<div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-center shadow-lg">
				<h2 className="text-2xl font-bold text-white mb-3">
					Bạn có thắc mắc hoặc góp ý?
				</h2>
				<p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
					Mình rất mong nhận được phản hồi từ bạn để cải thiện
					StudentSwap ngày càng tốt hơn. Đừng ngại liên hệ nhé!
				</p>
				<div className="flex flex-wrap gap-4 justify-center">
					<Link
						href="/contact"
						className="inline-flex items-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-300 hover:scale-105 shadow-md"
					>
						<BiMessageDetail className="w-5 h-5" />
						Liên hệ với mình
					</Link>
					<Link
						href="/feedback"
						className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-all duration-300 hover:scale-105 border-2 border-white/20"
					>
						Gửi góp ý
					</Link>
				</div>
			</div>

			{/* Note */}
			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
				<p className="text-sm text-blue-800 flex items-start gap-2">
					<span className="text-lg">ℹ️</span>
					<span>
						<strong>Lưu ý:</strong> StudentSwap là dự án học tập và
						đang trong giai đoạn phát triển. Nếu bạn gặp bất kỳ lỗi
						nào hoặc có ý tưởng cải thiện, hãy cho mình biết qua
						trang liên hệ. Mình rất trân trọng mọi đóng góp!
					</span>
				</p>
			</div>
		</div>
	);
}
