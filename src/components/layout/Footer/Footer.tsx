// components/layout/Footer/Footer.tsx
'use client';

import Link from 'next/link';
import {
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaGithub,
} from 'react-icons/fa';
import {
	MdEmail,
	MdPhone,
	MdLocationOn,
	MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { HiOutlineShieldCheck } from 'react-icons/hi';
import { BiSupport } from 'react-icons/bi';
import Logo from '@/components/ui/Logo';
import { useEffect, useState } from 'react';
import api from '@/lib/api/axiosInstance';
import { Category } from '@/types/category';
import CompactButton from '@/components/ui/CompactButton';
import { fetchCategories } from '@/lib/api/categoryApi';

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			const response = await fetchCategories();
			const data: Category[] = response;
			setCategories(data);
		};

		getCategories();
	}, []);

	const quickLinks = [
		{ label: 'Về chúng tôi', href: '/about' },
		{ label: 'Liên hệ', href: '/contact' },
		{ label: 'FAQ', href: '/faq' }, // Các câu hỏi thường gặp
	];

	const support = [
		{ label: 'Hướng dẫn đăng tin', href: '/guide/post' },
		{ label: 'Điều khoản sử dụng', href: '/terms' },
		{ label: 'Báo lỗi / Feedback', href: '/feedback' },
		{ label: 'Bảng giá dịch vụ', href: '/pricing' },
	];

	const socialLinks = [
		{
			icon: FaFacebookF,
			href: 'https://www.facebook.com/bquochuy1514',
			label: 'Facebook',
			color: 'hover:bg-blue-600',
		},
		{
			icon: FaInstagram,
			href: 'https://www.instagram.com/bquochuy1514/',
			label: 'Instagram',
			color: 'hover:bg-pink-600',
		},
		{
			icon: FaLinkedinIn,
			href: 'https://www.linkedin.com/in/huy-bui-quoc-a47a33389/',
			label: 'LinkedIn',
			color: 'hover:bg-blue-700',
		},
		{
			icon: FaGithub,
			href: 'https://github.com/bquochuy1514',
			label: 'GitHub',
			color: 'hover:bg-gray-900',
		},
	];

	return (
		<footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pb-16 lg:pb-0">
			{/* Decorative top border */}
			<div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>

			{/* Main Footer Content */}
			<div className="container mx-auto px-4 pt-12 pb-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
					{/* Company Info */}
					<div className="lg:col-span-2">
						<div className="inline-block mb-4">
							<Logo height={180} width={150} />
						</div>
						<p className="text-gray-400 mb-4 leading-relaxed">
							StudentSwap là một dự án cá nhân được phát triển bởi
							sinh viên với mục tiêu tạo ra nền tảng trao đổi –
							mua bán đồ dùng sinh viên một cách nhanh chóng, tiện
							lợi và an toàn.
						</p>

						{/* Contact Info */}
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<MdLocationOn className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
								<p className="text-sm">
									Địa chỉ: Đại học Công nghệ Thông tin – ĐHQG
									TP.HCM
									<br />
									Khu phố 6, phường Linh Trung, TP. Thủ Đức,
									TP. Hồ Chí Minh
								</p>
							</div>
							<div className="flex items-center gap-3">
								<MdPhone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
								<a
									href="tel:0342637682"
									className="text-sm hover:text-emerald-400 transition-colors"
								>
									+84342637682
								</a>
							</div>
							<div className="flex items-center gap-3">
								<MdEmail className="w-5 h-5 text-emerald-500 flex-shrink-0" />
								<a
									href="mailto:bquochuy260405@gmail.com"
									className="text-sm hover:text-emerald-400 transition-colors"
								>
									bquochuy260405@gmail.com
								</a>
							</div>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg">
							Về StudentSwap
						</h3>
						<ul className="space-y-2">
							{quickLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="flex items-center gap-1 text-sm hover:text-emerald-400 transition-colors group"
									>
										<MdOutlineKeyboardArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Categories */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg">
							Danh mục
						</h3>
						<ul className="space-y-2">
							{categories.map((category) => (
								<li key={category.id}>
									<Link
										href={`/category/${category.slug}`}
										className="text-sm hover:text-emerald-400 transition-colors"
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div>
						<h3 className="text-white font-semibold mb-4 text-lg">
							Hỗ trợ
						</h3>
						<ul className="space-y-2 mb-6">
							{support.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										className="flex items-center gap-1 text-sm hover:text-emerald-400 transition-colors group"
									>
										<MdOutlineKeyboardArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
										{item.label}
									</Link>
								</li>
							))}
						</ul>

						{/* Trust Badges */}
						<div className="space-y-2">
							<div className="flex items-center gap-2 text-sm">
								<HiOutlineShieldCheck className="w-5 h-5 text-emerald-500" />
								<span>Thanh toán an toàn</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<BiSupport className="w-5 h-5 text-emerald-500" />
								<span>Hỗ trợ 24/7</span>
							</div>
						</div>
					</div>
				</div>

				{/* Social Links & Newsletter */}
				<div className="mt-12 pt-8 border-t border-gray-700">
					<div className="flex flex-col md:flex-row justify-between items-center gap-6">
						{/* Social Media */}
						<div>
							<h4 className="text-white font-semibold mb-4 text-center md:text-left">
								Kết nối với chúng tôi
							</h4>
							<div className="flex gap-3">
								{socialLinks.map((social) => (
									<a
										key={social.label}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:scale-110 transition-all duration-300 ${social.color}`}
										aria-label={social.label}
									>
										<social.icon className="w-5 h-5 text-white" />
									</a>
								))}
							</div>
						</div>

						{/* Newsletter */}
						<div className="flex-1 max-w-md">
							<h4 className="text-white font-semibold mb-3 text-center md:text-left">
								Đăng ký nhận tin
							</h4>
							<div className="flex gap-2">
								<input
									type="email"
									placeholder="Nhập email của bạn"
									className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-emerald-500 focus:outline-none text-white placeholder-gray-400 text-sm"
								/>
								<CompactButton variant="primary" size="md">
									Đăng ký
								</CompactButton>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-8 pt-6 border-t border-gray-700">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
						<p>
							© {currentYear} StudentSwap. Dự án cá nhân phục vụ
							mục đích học tập và phát triển.
						</p>
						<div className="flex gap-6">
							<Link
								href="/terms"
								className="hover:text-emerald-400 transition-colors"
							>
								Điều khoản
							</Link>
							<Link
								href="/privacy"
								className="hover:text-emerald-400 transition-colors"
							>
								Bảo mật
							</Link>
							<Link
								href="/cookies"
								className="hover:text-emerald-400 transition-colors"
							>
								Cookies
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
