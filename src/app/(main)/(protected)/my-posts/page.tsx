// app/src/(main)/(protected)/my-posts/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiPackage,
	FiEye,
	FiClock,
	FiCheckCircle,
	FiXCircle,
	FiAlertCircle,
	FiEyeOff,
} from 'react-icons/fi';
import { toast } from '@/components/ui/Toast';
import PageHeader from '@/components/ui/PageHeader';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import api from '@/lib/api/axiosInstance';
import { Product } from '@/types/product';
import MyProductCard from '@/components/features/products/my-posts/MyProductCard';
import { useRouter } from 'next/navigation';

// Tab configurations
const TABS = [
	{
		key: 'approved',
		label: 'Đang hiển thị',
		icon: FiCheckCircle,
		color: 'text-green-600',
		gradient: 'from-green-500 to-emerald-600',
	},
	{
		key: 'pending',
		label: 'Chờ duyệt',
		icon: FiClock,
		color: 'text-yellow-600',
		gradient: 'from-yellow-500 to-orange-500',
	},
	{
		key: 'rejected',
		label: 'Bị từ chối',
		icon: FiXCircle,
		color: 'text-red-600',
		gradient: 'from-red-500 to-pink-600',
	},
	{
		key: 'expired',
		label: 'Hết hạn',
		icon: FiAlertCircle,
		color: 'text-orange-600',
		gradient: 'from-orange-500 to-red-500',
	},
	{
		key: 'hidden',
		label: 'Đã ẩn',
		icon: FiEyeOff,
		color: 'text-gray-600',
		gradient: 'from-gray-500 to-slate-600',
	},
] as const;

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

export default function MyProductsPage() {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(
		null
	);
	const [showModal, setShowModal] = useState(false);
	const [activeTab, setActiveTab] = useState<
		'approved' | 'pending' | 'rejected' | 'expired' | 'hidden'
	>('approved');

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

	const handleHide = async (productId: string) => {
		try {
			await api.post(`/api/products/${productId}/hide`);
			toast.success('Ẩn sản phẩm thành công!');
			fetchMyProducts();
			setShowModal(false);
		} catch (error) {
			toast.error('Không thể ẩn sản phẩm');
			console.error(error);
		}
	};

	const handleUnhide = async (productId: string) => {
		try {
			await api.post(`/api/products/${productId}/unhide`);
			toast.success('Hiện tin đăng thành công!');
			fetchMyProducts();
			setShowModal(false);
		} catch (error) {
			toast.error('Không thể hiện tin đăng');
			console.error(error);
		}
	};

	const handleBoost = (product: Product) => {
		router.push(`/services/boost?productId=${product.id}`);
	};

	const handleExtend = (product: Product) => {
		router.push(`/services/renew?productId=${product.id}`);
	};

	// Filter products based on active tab
	// Priority: expired > rejected > pending > approved > hidden
	const filteredProducts = products.filter((product) => {
		// Hết hạn có độ ưu tiên cao nhất (bất kể deleted_at)
		if (activeTab === 'expired') {
			return product.is_expired;
		}

		// Các trạng thái khác chỉ xét khi CHƯA hết hạn
		if (product.is_expired) {
			return false;
		}

		switch (activeTab) {
			case 'approved':
				return (
					product.status === 'approved' && product.deleted_at === null
				);
			case 'pending':
				return (
					product.status === 'pending' && product.deleted_at === null
				);
			case 'rejected':
				return (
					product.status === 'rejected' && product.deleted_at === null
				);
			case 'hidden':
				return product.deleted_at !== null;
			default:
				return true;
		}
	});

	// Calculate count for each tab with corrected logic
	const getTabCount = (tabKey: string) => {
		switch (tabKey) {
			case 'expired':
				// Hết hạn: tất cả sản phẩm có is_expired = true
				return products.filter((p) => p.is_expired).length;
			case 'approved':
				// Đang hiển thị: approved + chưa hết hạn + chưa bị ẩn
				return products.filter(
					(p) =>
						p.status === 'approved' &&
						!p.is_expired &&
						p.deleted_at === null
				).length;
			case 'pending':
				// Chờ duyệt: pending + chưa hết hạn + chưa bị ẩn
				return products.filter(
					(p) =>
						p.status === 'pending' &&
						!p.is_expired &&
						p.deleted_at === null
				).length;
			case 'rejected':
				// Bị từ chối: rejected + chưa hết hạn + chưa bị ẩn
				return products.filter(
					(p) =>
						p.status === 'rejected' &&
						!p.is_expired &&
						p.deleted_at === null
				).length;
			case 'hidden':
				// Đã ẩn: có deleted_at + chưa hết hạn
				return products.filter(
					(p) => p.deleted_at !== null && !p.is_expired
				).length;
			default:
				return 0;
		}
	};

	if (isLoading) {
		return <LoadingOverlay isVisible={true} message="Đang tải..." />;
	}

	return (
		<div className="min-h-screen py-4 sm:py-6 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="mb-4 sm:mb-6">
					<PageHeader
						icon={<FiPackage />}
						title="Quản lý tin đăng"
						description="Theo dõi và quản lý tất cả tin đăng của bạn"
					/>
				</div>

				{/* Tabs - Scrollable on Mobile, Grid on Desktop */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 sm:p-1.5 mb-4 sm:mb-6">
					{/* Mobile: Scrollable Tabs */}
					<div className="sm:hidden overflow-x-auto scrollbar-hide -mx-1 px-1">
						<div className="flex gap-1.5 min-w-max pb-1">
							{TABS.map((tab) => {
								const Icon = tab.icon;
								const count = getTabCount(tab.key);
								const isActive = activeTab === tab.key;

								return (
									<motion.button
										key={tab.key}
										onClick={() => setActiveTab(tab.key)}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 font-medium whitespace-nowrap relative overflow-hidden flex-shrink-0 ${
											isActive
												? 'text-white shadow-md'
												: 'text-gray-600 hover:bg-gray-50'
										}`}
									>
										{isActive && (
											<motion.div
												layoutId="activeTabMobile"
												className={`absolute inset-0 bg-gradient-to-r ${tab.gradient}`}
												transition={{
													type: 'spring',
													bounce: 0.2,
													duration: 0.6,
												}}
											/>
										)}
										<Icon className="w-3.5 h-3.5 flex-shrink-0 relative z-10" />
										<span className="text-xs relative z-10">
											{tab.label}
										</span>
										<span
											className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold min-w-[18px] text-center relative z-10 ${
												isActive
													? 'bg-white/25 text-white'
													: 'bg-gray-100 text-gray-700'
											}`}
										>
											{count}
										</span>
									</motion.button>
								);
							})}
						</div>
					</div>

					{/* Desktop: Grid Layout */}
					<div className="hidden sm:grid sm:grid-cols-5 gap-1">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const count = getTabCount(tab.key);
							const isActive = activeTab === tab.key;

							return (
								<motion.button
									key={tab.key}
									onClick={() => setActiveTab(tab.key)}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className={`flex items-center justify-center cursor-pointer gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 font-medium whitespace-nowrap relative overflow-hidden ${
										isActive
											? 'text-white shadow-md'
											: 'text-gray-600 hover:bg-gray-50'
									}`}
								>
									{isActive && (
										<motion.div
											layoutId="activeTabDesktop"
											className={`absolute inset-0 bg-gradient-to-r ${tab.gradient}`}
											transition={{
												type: 'spring',
												bounce: 0.2,
												duration: 0.6,
											}}
										/>
									)}
									<Icon className="w-3.5 h-3.5 flex-shrink-0 relative z-10" />
									<span className="text-sm relative z-10">
										{tab.label}
									</span>
									<span
										className={`px-1.5 py-0.5 rounded-full text-xs font-bold min-w-[18px] text-center relative z-10 ${
											isActive
												? 'bg-white/25 text-white'
												: 'bg-gray-100 text-gray-700'
										}`}
									>
										{count}
									</span>
								</motion.button>
							);
						})}
					</div>
				</div>

				{/* Products List */}
				<AnimatePresence mode="wait">
					{filteredProducts.length === 0 ? (
						<motion.div
							key="empty"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center"
						>
							<FiPackage className="text-5xl sm:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
							<h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
								Không có tin đăng nào
							</h3>
							<p className="text-sm sm:text-base text-gray-600">
								{activeTab === 'approved' &&
									'Chưa có tin đăng nào đang hiển thị'}
								{activeTab === 'pending' &&
									'Chưa có tin đăng nào chờ duyệt'}
								{activeTab === 'rejected' &&
									'Chưa có tin đăng nào bị từ chối'}
								{activeTab === 'expired' &&
									'Chưa có tin đăng nào hết hạn'}
								{activeTab === 'hidden' &&
									'Chưa có tin đăng nào đã ẩn'}
							</p>
						</motion.div>
					) : (
						<motion.div
							key={activeTab}
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="space-y-3"
						>
							{filteredProducts.map((product) => (
								<MyProductCard
									key={product.id}
									product={product}
									onView={(p) => {
										// TODO: Navigate to product detail
										console.log('View product:', p.id);
									}}
									onEdit={(p) => {
										// TODO: Navigate to edit page
										console.log('Edit product:', p.id);
									}}
									onHide={(p) => {
										setSelectedProduct(p);
										setShowModal(true);
									}}
									onUnhide={(p) => {
										setSelectedProduct(p);
										setShowModal(true);
									}}
									onRenew={handleExtend}
									onBoost={handleBoost}
								/>
							))}
						</motion.div>
					)}
				</AnimatePresence>

				{/* Hide/Unhide Confirmation Modal */}
				{selectedProduct && (
					<ConfirmationModal
						isOpen={showModal}
						onClose={() => setShowModal(false)}
						variant="custom"
						showCloseButton
						title={
							selectedProduct.deleted_at !== null
								? 'Xác nhận hiện tin'
								: 'Xác nhận ẩn tin'
						}
						description={
							selectedProduct.deleted_at !== null ? (
								<>
									Bạn có chắc muốn hiện lại sản phẩm{' '}
									<span className="font-semibold">
										{selectedProduct.title}
									</span>
									? Tin đăng sẽ hiển thị lại với người dùng
									khác.
								</>
							) : (
								<>
									Bạn có chắc muốn ẩn sản phẩm{' '}
									<span className="font-semibold">
										{selectedProduct.title}
									</span>
									? Tin đăng sẽ không còn hiển thị với người
									dùng khác.
								</>
							)
						}
						icon={
							selectedProduct.deleted_at !== null ? (
								<FiEye />
							) : (
								<FiEyeOff />
							)
						}
						iconBgColor={
							selectedProduct.deleted_at !== null
								? 'bg-green-100'
								: 'bg-gray-100'
						}
						iconColor={
							selectedProduct.deleted_at !== null
								? 'text-green-600'
								: 'text-gray-600'
						}
						buttons={[
							{
								label: 'Hủy',
								onClick: () => setShowModal(false),
								variant: 'secondary',
							},
							{
								label:
									selectedProduct.deleted_at !== null
										? 'Hiện tin'
										: 'Ẩn tin',
								onClick: () =>
									selectedProduct.deleted_at !== null
										? handleUnhide(selectedProduct.id)
										: handleHide(selectedProduct.id),
								className:
									selectedProduct.deleted_at !== null
										? 'bg-green-500 text-white hover:bg-green-600'
										: 'bg-gray-500 text-white hover:bg-gray-600',
							},
						]}
					/>
				)}
			</div>
		</div>
	);
}
