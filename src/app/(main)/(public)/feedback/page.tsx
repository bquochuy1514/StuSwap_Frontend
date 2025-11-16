// src/app/(main)/(public)/feedback/page.tsx
'use client';

import GradientButton from '@/components/ui/GradientButton';
import PageHeader from '@/components/ui/PageHeader';
import React, { useState } from 'react';
import {
	MdFeedback,
	MdBugReport,
	MdLightbulb,
	MdMessage,
	MdEmail,
	MdTitle,
	MdDescription,
	MdSend,
	MdCheckCircle,
} from 'react-icons/md';

type FeedbackType = 'bug' | 'feature' | 'general';

interface FeedbackForm {
	type: FeedbackType;
	title: string;
	content: string;
	email: string;
}

export default function FeedbackPage() {
	const [formData, setFormData] = useState<FeedbackForm>({
		type: 'general',
		title: '',
		content: '',
		email: '',
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setError] = useState('');

	const feedbackTypes = [
		{
			value: 'bug' as FeedbackType,
			label: 'Báo lỗi (Bug Report)',
			icon: MdBugReport,
			color: 'text-red-600',
			bgColor: 'bg-red-100',
		},
		{
			value: 'feature' as FeedbackType,
			label: 'Góp ý cải thiện (Feature Suggestion)',
			icon: MdLightbulb,
			color: 'text-amber-600',
			bgColor: 'bg-amber-100',
		},
		{
			value: 'general' as FeedbackType,
			label: 'Phản hồi chung (General Feedback)',
			icon: MdMessage,
			color: 'text-blue-600',
			bgColor: 'bg-blue-100',
		},
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validation
		if (!formData.content.trim()) {
			setError('Vui lòng nhập nội dung phản hồi');
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				throw new Error('Có lỗi xảy ra khi gửi phản hồi');
			}

			setIsSuccess(true);
			setFormData({
				type: 'general',
				title: '',
				content: '',
				email: '',
			});

			// Reset success message after 5 seconds
			setTimeout(() => {
				setIsSuccess(false);
			}, 5000);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Có lỗi xảy ra, vui lòng thử lại sau'
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (isSuccess) {
		return (
			<div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
				<div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm border border-gray-200 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mb-6 shadow-lg">
						<MdCheckCircle className="w-10 h-10 text-white" />
					</div>
					<h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
						Cảm ơn bạn!
					</h2>
					<p className="text-gray-600 mb-6 leading-relaxed">
						Phản hồi của bạn đã được gửi thành công. Mình sẽ xem xét
						và phản hồi sớm nhất có thể.
					</p>
					<div className="space-y-3">
						<button
							onClick={() => setIsSuccess(false)}
							className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 hover:scale-105 shadow-md"
						>
							Gửi phản hồi khác
						</button>
						<p className="text-sm text-gray-500">
							Hoặc quay lại trang chủ để tiếp tục mua sắm
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
			{/* Header */}
			<PageHeader
				icon={<MdFeedback />}
				title="Gửi phản hồi"
				description="Ý kiến của bạn rất quan trọng để giúp StudentSwap ngày càng
					tốt hơn. Hãy chia sẻ suy nghĩ của bạn với mình nhé!"
			/>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-200"
			>
				{/* Feedback Type */}
				<div className="mb-6">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
						<MdFeedback className="w-4 h-4 text-emerald-600" />
						Loại phản hồi
						<span className="text-red-500">*</span>
					</label>
					<select
						name="type"
						value={formData.type}
						onChange={handleChange}
						required
						className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white"
					>
						{feedbackTypes.map((type) => (
							<option key={type.value} value={type.value}>
								{type.label}
							</option>
						))}
					</select>
					<div className="mt-3 flex flex-wrap gap-2">
						{feedbackTypes.map((type) => {
							const Icon = type.icon;
							return (
								<div
									key={type.value}
									className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
										formData.type === type.value
											? `${type.bgColor} border-2 border-current ${type.color}`
											: 'bg-gray-50 text-gray-500'
									} transition-all duration-200`}
								>
									<Icon className="w-4 h-4" />
									<span className="text-xs font-medium">
										{type.label.split('(')[0].trim()}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* Title */}
				<div className="mb-6">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
						<MdTitle className="w-4 h-4 text-emerald-600" />
						Tiêu đề phản hồi
					</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="VD: Không thể đăng nhập vào tài khoản"
						className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
					/>
					<p className="mt-2 text-xs text-gray-500">
						Tiêu đề ngắn gọn giúp mình hiểu vấn đề nhanh hơn
					</p>
				</div>

				{/* Content */}
				<div className="mb-6">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
						<MdDescription className="w-4 h-4 text-emerald-600" />
						Nội dung phản hồi
						<span className="text-red-500">*</span>
					</label>
					<textarea
						name="content"
						value={formData.content}
						onChange={handleChange}
						required
						rows={6}
						placeholder="Mô tả chi tiết vấn đề bạn gặp phải hoặc ý tưởng cải thiện..."
						className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 resize-none"
					/>
					<p className="mt-2 text-xs text-gray-500">
						Càng chi tiết càng giúp mình xử lý tốt hơn
					</p>
				</div>

				{/* Email */}
				<div className="mb-6">
					<label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
						<MdEmail className="w-4 h-4 text-emerald-600" />
						Email của bạn
						<span className="text-gray-400 text-xs font-normal">
							(Không bắt buộc)
						</span>
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="your.email@example.com"
						className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
					/>
					<p className="mt-2 text-xs text-gray-500">
						Để lại email nếu bạn muốn mình liên hệ lại
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
						<p className="text-sm text-red-600 flex items-center gap-2">
							<span className="text-lg">⚠️</span>
							{error}
						</p>
					</div>
				)}

				{/* Submit Button */}
				<GradientButton
					type="submit"
					isLoading={isSubmitting}
					loadingText="Đang gửi..."
					variant="primary"
				>
					Gửi phản hồi
				</GradientButton>
			</form>

			{/* Info Box */}
			<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
				<p className="text-sm text-blue-800 flex items-start gap-2">
					<span className="text-lg">💡</span>
					<span>
						<strong>Lưu ý:</strong> Mình sẽ cố gắng phản hồi trong
						vòng 24-48 giờ. Nếu bạn để lại email, mình sẽ liên hệ
						trực tiếp. Cảm ơn bạn đã giúp StudentSwap ngày càng tốt
						hơn!
					</span>
				</p>
			</div>
		</div>
	);
}
