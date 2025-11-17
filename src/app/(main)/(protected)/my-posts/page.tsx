'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiPackage,
	FiEdit2,
	FiTrash2,
	FiEye,
	FiClock,
	FiCheckCircle,
	FiXCircle,
	FiAlertCircle,
	FiDollarSign,
	FiMapPin,
	FiTag,
	FiImage,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import PageHeader from '@/components/ui/PageHeader';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import api from '@/lib/api/axiosInstance';

// Types
interface Category {
	id: number;
	name: string;
	slug: string;
	description: string;
	is_active: boolean;
	icon_url: string;
	created_at: string;
	updated_at: string;
}

interface Address {
	id: string;
	specificAddress: string;
	ward: string;
	district: string;
	province: string;
	createdAt: string;
	updatedAt: string;
}

interface Product {
	id: string;
	title: string;
	description: string;
	price: string;
	condition: string;
	image_urls: string;
	is_sold: boolean;
	is_premium: boolean;
	priority_level: number;
	status: 'pending' | 'approved' | 'rejected';
	reject_reason: string | null;
	is_expired: boolean;
	expire_at: string;
	promotion_type: string;
	promotion_expire_at: string | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	category: Category;
	address: Address;
}

// Condition labels
const CONDITION_LABELS: Record<string, { label: string; icon: string }> = {
	new: { label: 'Mới 100%', icon: '✨' },
	used_like_new: { label: 'Như mới', icon: '⭐' },
	used_good: { label: 'Còn tốt', icon: '👍' },
	used_fair: { label: 'Khá ổn', icon: '👌' },
};

// Status badges
const STATUS_CONFIG = {
	pending: {
		label: 'Chờ duyệt',
		color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		icon: FiClock,
	},
	approved: {
		label: 'Đã duyệt',
		color: 'bg-green-100 text-green-800 border-green-200',
		icon: FiCheckCircle,
	},
	rejected: {
		label: 'Bị từ chối',
		color: 'bg-red-100 text-red-800 border-red-200',
		icon: FiXCircle,
	},
};

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

export default function MyProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(
		null
	);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		fetchMyProducts();
	}, []);

	const fetchMyProducts = async () => {
		try {
			setIsLoading(true);
			const response = await api.get('/api/products/my');

			setProducts(response.data);
		} catch (error) {
			toast.error('Không thể tải danh sách sản phẩm');
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async (productId: string) => {
		try {
			const response = await fetch(
				`http://localhost:8080/api/products/${productId}`,
				{
					method: 'DELETE',
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							'token'
						)}`,
					},
				}
			);

			if (!response.ok) throw new Error('Failed to delete product');

			toast.success('Xóa sản phẩm thành công!');
			setProducts(products.filter((p) => p.id !== productId));
			setShowDeleteModal(false);
		} catch (error) {
			toast.error('Không thể xóa sản phẩm');
			console.error(error);
		}
	};

	const formatPrice = (price: string) => {
		return new Intl.NumberFormat('vi-VN', {
			style: 'currency',
			currency: 'VND',
		}).format(parseFloat(price));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	const getImageUrls = (imageUrlsString: string): string[] => {
		try {
			return JSON.parse(imageUrlsString);
		} catch {
			return [];
		}
	};

	if (isLoading) {
		return <LoadingOverlay isVisible={true} message="Đang tải..." />;
	}

	return (
		<div className="min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<PageHeader
						icon={<FiPackage />}
						title="Quản lý tin đăng"
						description="Danh sách các sản phẩm bạn đã đăng"
					/>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">
									Tổng tin đăng
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{products.length}
								</p>
							</div>
							<FiPackage className="text-3xl text-blue-500" />
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">
									Chờ duyệt
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{
										products.filter(
											(p) => p.status === 'pending'
										).length
									}
								</p>
							</div>
							<FiClock className="text-3xl text-yellow-500" />
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">
									Đã duyệt
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{
										products.filter(
											(p) => p.status === 'approved'
										).length
									}
								</p>
							</div>
							<FiCheckCircle className="text-3xl text-green-500" />
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500"
					>
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-gray-600 mb-1">
									Bị từ chối
								</p>
								<p className="text-2xl font-bold text-gray-800">
									{
										products.filter(
											(p) => p.status === 'rejected'
										).length
									}
								</p>
							</div>
							<FiXCircle className="text-3xl text-red-500" />
						</div>
					</motion.div>
				</div>

				{/* Products List */}
				{products.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="bg-white rounded-2xl shadow-xl p-12 text-center"
					>
						<FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-800 mb-2">
							Chưa có tin đăng nào
						</h3>
						<p className="text-gray-600">
							Hãy đăng sản phẩm đầu tiên của bạn!
						</p>
					</motion.div>
				) : (
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
						className="space-y-4"
					>
						{products.map((product) => {
							const StatusIcon =
								STATUS_CONFIG[product.status].icon;
							const images = getImageUrls(product.image_urls);
							const conditionInfo =
								CONDITION_LABELS[product.condition];

							return (
								<motion.div
									key={product.id}
									variants={itemVariants}
									className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
								>
									<div className="flex flex-col md:flex-row">
										{/* Image */}
										<div className="md:w-48 h-48 md:h-auto relative bg-gray-100 flex-shrink-0">
											{images.length > 0 ? (
												<img
													src={images[0]}
													alt={product.title}
													className="w-full h-full object-cover"
												/>
											) : (
												<div className="w-full h-full flex items-center justify-center">
													<FiImage className="text-4xl text-gray-300" />
												</div>
											)}
											{images.length > 1 && (
												<div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
													+{images.length - 1}
												</div>
											)}
										</div>

										{/* Content */}
										<div className="flex-1 p-6">
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1">
													<h3 className="text-xl font-bold text-gray-800 mb-2">
														{product.title}
													</h3>
													<div className="flex flex-wrap gap-2 mb-3">
														<span
															className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
																STATUS_CONFIG[
																	product
																		.status
																].color
															}`}
														>
															<StatusIcon className="w-3 h-3" />
															{
																STATUS_CONFIG[
																	product
																		.status
																].label
															}
														</span>
														{product.is_sold && (
															<span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
																Đã bán
															</span>
														)}
														{product.is_expired && (
															<span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
																Hết hạn
															</span>
														)}
													</div>
												</div>
											</div>

											<p className="text-gray-600 text-sm mb-4 line-clamp-2">
												{product.description}
											</p>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
												<div className="flex items-center gap-2 text-sm">
													<FiDollarSign className="text-emerald-600 flex-shrink-0" />
													<span className="font-bold text-emerald-600 text-lg">
														{formatPrice(
															product.price
														)}
													</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-gray-600">
													<FiTag className="flex-shrink-0" />
													<span>
														{conditionInfo?.icon}{' '}
														{conditionInfo?.label}
													</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-gray-600">
													<FiPackage className="flex-shrink-0" />
													<span>
														{product.category.name}
													</span>
												</div>

												<div className="flex items-center gap-2 text-sm text-gray-600">
													<FiMapPin className="flex-shrink-0" />
													<span className="truncate">
														{
															product.address
																.district
														}
														,{' '}
														{
															product.address
																.province
														}
													</span>
												</div>
											</div>

											<div className="flex items-center justify-between pt-4 border-t">
												<div className="text-xs text-gray-500">
													Đăng ngày:{' '}
													{formatDate(
														product.created_at
													)}
												</div>

												<div className="flex items-center gap-2">
													<motion.button
														whileHover={{
															scale: 1.05,
														}}
														whileTap={{
															scale: 0.95,
														}}
														className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
													>
														<FiEye className="w-4 h-4" />
														Xem
													</motion.button>

													<motion.button
														whileHover={{
															scale: 1.05,
														}}
														whileTap={{
															scale: 0.95,
														}}
														className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
													>
														<FiEdit2 className="w-4 h-4" />
														Sửa
													</motion.button>

													<motion.button
														whileHover={{
															scale: 1.05,
														}}
														whileTap={{
															scale: 0.95,
														}}
														onClick={() => {
															setSelectedProduct(
																product
															);
															setShowDeleteModal(
																true
															);
														}}
														className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
													>
														<FiTrash2 className="w-4 h-4" />
														Xóa
													</motion.button>
												</div>
											</div>

											{/* Reject Reason */}
											{product.status === 'rejected' &&
												product.reject_reason && (
													<motion.div
														initial={{
															opacity: 0,
															height: 0,
														}}
														animate={{
															opacity: 1,
															height: 'auto',
														}}
														className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
													>
														<div className="flex items-start gap-2">
															<FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" />
															<div>
																<p className="text-sm font-semibold text-red-800 mb-1">
																	Lý do từ
																	chối:
																</p>
																<p className="text-sm text-red-700">
																	{
																		product.reject_reason
																	}
																</p>
															</div>
														</div>
													</motion.div>
												)}
										</div>
									</div>
								</motion.div>
							);
						})}
					</motion.div>
				)}

				{/* Delete Confirmation Modal */}
				<AnimatePresence>
					{showDeleteModal && selectedProduct && (
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
							onClick={() => setShowDeleteModal(false)}
						>
							<motion.div
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								onClick={(e) => e.stopPropagation()}
								className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
							>
								<div className="text-center mb-6">
									<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
										<FiTrash2 className="text-3xl text-red-600" />
									</div>
									<h3 className="text-xl font-bold text-gray-800 mb-2">
										Xác nhận xóa
									</h3>
									<p className="text-gray-600">
										Bạn có chắc muốn xóa sản phẩm
										<span className="font-semibold">
											{selectedProduct.title}
										</span>
										? Hành động này không thể hoàn tác.
									</p>
								</div>

								<div className="flex gap-3">
									<button
										onClick={() =>
											setShowDeleteModal(false)
										}
										className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
									>
										Hủy
									</button>
									<button
										onClick={() =>
											handleDelete(selectedProduct.id)
										}
										className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
									>
										Xóa
									</button>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
