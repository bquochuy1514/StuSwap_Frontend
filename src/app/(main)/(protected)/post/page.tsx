'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiPackage,
	FiDollarSign,
	FiMapPin,
	FiAlertCircle,
	FiCheck,
	FiFileText,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import Input from '@/components/ui/Input';
import LocationSelector from '@/components/ui/LocationSelector';
import Dropdown, { DropdownItem } from '@/components/ui/DropDown';
import { ProductCondition, ProductFormData } from '@/types/product';
import PageHeader from '@/components/ui/PageHeader';
import { createProduct } from '@/lib/api/productApi';
import { handleApiError } from '@/lib/utils';
import { Category } from '@/types/category';
import { fetchCategories } from '@/lib/api/categoryApi';
import GradientButton from '@/components/ui/GradientButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ImageUpload from '@/components/features/products/post/ImageUpload';

const CONDITION_OPTIONS = [
	{ value: ProductCondition.NEW, label: 'Mới 100%', icon: '✨' },
	{ value: ProductCondition.LIKE_NEW, label: 'Như mới', icon: '⭐' },
	{ value: ProductCondition.GOOD, label: 'Còn tốt', icon: '👍' },
	{ value: ProductCondition.FAIR, label: 'Khá ổn', icon: '👌' },
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
		},
	},
};

export default function PostProductPage() {
	const [formData, setFormData] = useState<ProductFormData>({
		title: '',
		description: '',
		price: '',
		condition: ProductCondition.GOOD,
		category_id: '',
		address: {
			specificAddress: '',
			ward: '',
			district: '',
			province: '',
		},
		images: [],
	});

	const [categoryItems, setCategoryItems] = useState<DropdownItem[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [errors, setErrors] = useState<Record<string, string[]>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const getCategories = async () => {
			const response = await fetchCategories();
			const data: Category[] = response;

			const transformedData: DropdownItem[] = data.map((category) => ({
				id: category.id,
				label: category.name,
				value: category.id,
			}));

			setCategoryItems(transformedData);
		};

		getCategories();
	}, []);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		// Xóa lỗi của field đang thay đổi
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handlePriceChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		// Lấy giá trị và loại bỏ tất cả dấu chấm
		const rawValue = e.target.value.replace(/\./g, '');

		// Chỉ cho phép số
		if (rawValue === '' || /^\d+$/.test(rawValue)) {
			setFormData((prev) => ({ ...prev, price: rawValue }));

			// Xóa lỗi của field price
			if (errors.price) {
				setErrors((prev) => {
					const newErrors = { ...prev };
					delete newErrors.price;
					return newErrors;
				});
			}
		}
	};

	const formatPrice = (value: string) => {
		if (!value) return '';
		return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear errors trước khi submit
		setErrors({});
		setIsSubmitting(true);

		try {
			const formDataToSend = new FormData();
			formDataToSend.append('title', formData.title);
			formDataToSend.append('description', formData.description);
			formDataToSend.append('price', formData.price);
			formDataToSend.append('condition', formData.condition);
			formDataToSend.append('category_id', formData.category_id);

			// Kiểm tra address có đầy đủ thông tin không
			const hasValidAddress =
				formData.address?.specificAddress?.trim() &&
				formData.address?.ward?.trim() &&
				formData.address?.district?.trim() &&
				formData.address?.province?.trim();

			// Chỉ append address nếu có đầy đủ thông tin
			if (hasValidAddress) {
				formDataToSend.append(
					'address[specificAddress]',
					formData.address!.specificAddress!.trim()
				);
				formDataToSend.append(
					'address[ward]',
					formData.address!.ward!.trim()
				);
				formDataToSend.append(
					'address[district]',
					formData.address!.district!.trim()
				);
				formDataToSend.append(
					'address[province]',
					formData.address!.province!.trim()
				);
			}

			// Append images
			formData.images.forEach((image) => {
				formDataToSend.append('images', image);
			});

			// Debug log
			console.log('=== FormData to send ===');
			for (const [key, value] of formDataToSend.entries()) {
				console.log(key, value);
			}

			await createProduct(formDataToSend);

			toast.success('Đăng sản phẩm thành công!');
			console.log('Form data:', formData);
		} catch (error) {
			const fieldErrors = handleApiError(error);
			if (fieldErrors) {
				setErrors(fieldErrors);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen py-8 px-4">
			<div className="max-w-5xl mx-auto">
				{/* Header */}
				<PageHeader
					icon={<FiPackage />}
					title="Đăng sản phẩm mới"
					description="Điền thông tin để bán sản phẩm của bạn"
				/>

				{/* Form */}
				<motion.form
					variants={containerVariants}
					initial="hidden"
					animate="visible"
					onSubmit={handleSubmit}
					className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-6"
				>
					{/* Title */}
					<motion.div variants={itemVariants}>
						<Input
							label="Tiêu đề tin đăng"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
							placeholder="VD: iPhone 13 Pro Max 256GB"
							type="text"
							icon={<FiPackage />}
							error={errors.title?.[0]}
							theme="light"
							size="sm"
						/>
					</motion.div>

					{/* Description */}
					<Input
						label="Mô tả sản phẩm"
						name="description"
						as="textarea"
						rows={5}
						icon={<FiFileText />}
						value={formData.description}
						onChange={handleInputChange}
						placeholder="Mô tả chi tiết về sản phẩm: tình trạng, xuất xứ, thời gian sử dụng..."
						error={errors.description?.[0]}
						theme="light"
						size="sm"
					/>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Price */}
						<motion.div variants={itemVariants}>
							<Input
								label="Giá bán (VNĐ)"
								name="price"
								value={formatPrice(formData.price)}
								onChange={handlePriceChange}
								placeholder="VD: 15.000.000"
								type="text"
								icon={<FiDollarSign />}
								error={errors.price?.[0]}
								theme="light"
								size="sm"
							/>
						</motion.div>

						{/* Category */}
						<motion.div variants={itemVariants}>
							<Dropdown
								label="Chọn danh mục"
								items={categoryItems}
								value={formData.category_id}
								onChange={(value) => {
									setFormData((prev) => ({
										...prev,
										category_id: String(value),
									}));
									if (errors.category_id) {
										setErrors((prev) => {
											const newErrors = { ...prev };
											delete newErrors.category_id;
											return newErrors;
										});
									}
								}}
								placeholder="Chọn danh mục"
								icon={<FiFileText />}
								fullWidth
								searchable
								size="md"
							/>
							<AnimatePresence>
								{errors.category_id && (
									<motion.div
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 mt-2"
									>
										<FiAlertCircle className="flex-shrink-0 mt-0.5 text-xs" />
										<span className="leading-relaxed">
											{errors.category_id[0]}
										</span>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</div>

					{/* Condition */}
					<motion.div variants={itemVariants}>
						<label className="block text-sm font-semibold text-gray-700 mb-3">
							Tình trạng sản phẩm
						</label>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{CONDITION_OPTIONS.map((option, index) => (
								<motion.button
									key={option.value}
									type="button"
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: index * 0.1 }}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={() =>
										setFormData((prev) => ({
											...prev,
											condition: option.value,
										}))
									}
									className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
										formData.condition === option.value
											? 'border-emerald-500 bg-emerald-50 shadow-md'
											: 'border-gray-200 bg-white hover:border-emerald-300'
									}`}
								>
									<motion.div
										animate={{
											scale:
												formData.condition ===
												option.value
													? [1, 1.2, 1]
													: 1,
										}}
										transition={{ duration: 0.3 }}
										className="text-2xl mb-1"
									>
										{option.icon}
									</motion.div>
									<div className="text-sm font-semibold text-gray-800">
										{option.label}
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>

					{/* Address */}
					<motion.div variants={itemVariants}>
						<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
							<FiMapPin className="w-4 h-4 text-emerald-600" />
							Vị trí sản phẩm
						</label>
						<div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
							<LocationSelector
								addressData={formData.address}
								onChange={(value) => {
									setFormData((prev) => ({
										...prev,
										address: value,
									}));
									console.log(value);
								}}
								isEditing={true}
								showLabel={true}
							/>
						</div>
						<AnimatePresence>
							{errors.address && (
								<motion.div
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg p-2.5 mt-2"
								>
									<FiAlertCircle className="flex-shrink-0 mt-0.5 text-xs" />
									<span className="leading-relaxed">
										{errors.address[0]}
									</span>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Images Upload */}
					<motion.div variants={itemVariants}>
						<ImageUpload
							images={formData.images}
							onChange={(newImages) => {
								setFormData((prev) => ({
									...prev,
									images: newImages,
								}));
								// Xóa lỗi images nếu có
								if (errors.images) {
									setErrors((prev) => {
										const newErrors = { ...prev };
										delete newErrors.images;
										return newErrors;
									});
								}
							}}
							error={errors.images?.[0]}
							maxImages={5}
							maxSizeInMB={10}
						/>
					</motion.div>

					{/* Submit Button */}

					<GradientButton
						type="submit"
						isLoading={isSubmitting}
						loadingText="Đang đăng..."
						size="sm"
						variant="primary"
						icon={
							isSubmitting ? (
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										duration: 1,
										repeat: Infinity,
										ease: 'linear',
									}}
									className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
								/>
							) : (
								<FiCheck />
							)
						}
					>
						Đăng sản phẩm
					</GradientButton>
				</motion.form>

				{/* Success Animation Area */}
				<LoadingOverlay
					isVisible={isSubmitting}
					message="Đang tải..."
				/>
			</div>
		</div>
	);
}
