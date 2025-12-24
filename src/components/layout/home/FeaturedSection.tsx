import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ui/ProductCard';
import CompactButton from '@/components/ui/CompactButton';
import { Product } from '@/types/product';
import api from '@/lib/api/axiosInstance';
import { handleApiError } from '@/lib/utils';
import { MdArrowForward } from 'react-icons/md';

interface FeaturedSectionProps {
	title: string;
	description?: string;
	icon?: React.ReactNode;
	query: {
		sortBy?: 'newest' | 'priority' | 'price_asc' | 'price_desc';
		limit?: number;
		province?: string;
		categoryId?: number;
	};
	viewAllLink?: string;
	emptyMessage?: string;
}

export default function FeaturedSection({
	title,
	description,
	icon,
	query,
	viewAllLink,
	emptyMessage = 'Chưa có sản phẩm nào',
}: FeaturedSectionProps) {
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [likedProducts, setLikedProducts] = useState<string[]>([]);

	useEffect(() => {
		let isMounted = true;

		async function fetchProducts() {
			try {
				setLoading(true);
				setError(null);

				// Build query params
				const params = new URLSearchParams();
				if (query.sortBy) params.append('sortBy', query.sortBy);
				if (query.limit) params.append('limit', query.limit.toString());
				if (query.province) params.append('province', query.province);
				if (query.categoryId)
					params.append('categoryId', query.categoryId.toString());

				const response = await api.get(
					`/api/products/search?${params.toString()}`
				);

				if (isMounted) {
					setProducts(response.data.data || []);
				}
			} catch (err) {
				if (isMounted) {
					// Fix: handleApiError có thể return undefined
					const errorResult = handleApiError(err);
					// Nếu có lỗi general (string), set vào state
					if (typeof errorResult === 'string') {
						setError(errorResult);
					} else {
						// Fallback nếu không có message cụ thể
						setError('Không thể tải sản phẩm');
					}
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		fetchProducts();

		return () => {
			isMounted = false;
		};
	}, [query]);

	const handleLike = (id: string) => {
		setLikedProducts((prev) =>
			prev.includes(id)
				? prev.filter((productId) => productId !== id)
				: [...prev, id]
		);
	};

	const handleProductClick = (id: string) => {
		router.push(`/products/${id}`);
	};

	const handleViewAll = () => {
		if (viewAllLink) {
			router.push(viewAllLink);
		} else {
			// Default: navigate to products page with same filters
			const params = new URLSearchParams();
			if (query.sortBy) params.append('sortBy', query.sortBy);
			if (query.province) params.append('province', query.province);
			if (query.categoryId)
				params.append('categoryId', query.categoryId.toString());
			router.push(`/products?${params.toString()}`);
		}
	};

	// Loading state
	if (loading) {
		return (
			<section className="py-6 md:py-10 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-6 md:mb-8">
						<div>
							<div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
							<div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
						</div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="bg-white rounded-2xl p-4 shadow-md animate-pulse"
							>
								<div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
								<div className="h-4 bg-gray-200 rounded mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-2/3"></div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	// Error state
	if (error) {
		return (
			<section className="py-6 md:py-10 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-6 md:mb-8">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
								{icon}
								{title}
							</h2>
						</div>
					</div>
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<p className="text-red-600 mb-4">⚠️ {error}</p>
						<CompactButton
							onClick={() => window.location.reload()}
							variant="primary"
						>
							Thử lại
						</CompactButton>
					</div>
				</div>
			</section>
		);
	}

	// Empty state
	if (products.length === 0) {
		return (
			<section className="py-6 md:py-10 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-between mb-6 md:mb-8">
						<div>
							<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
								{icon}
								{title}
							</h2>
							{description && (
								<p className="text-sm md:text-base text-gray-600 mt-2">
									{description}
								</p>
							)}
						</div>
					</div>
					<div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
						<p className="text-gray-500">{emptyMessage}</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6 md:py-10 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6 md:mb-8">
					<div>
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
							{icon}
							{title}
						</h2>
						{description && (
							<p className="text-sm md:text-base text-gray-600">
								{description}
							</p>
						)}
					</div>
					<CompactButton
						onClick={handleViewAll}
						variant="primary"
						icon={<MdArrowForward className="w-4 h-4" />}
						className="hidden md:flex"
					>
						Xem tất cả
					</CompactButton>
				</div>

				{/* Products Grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{products.map((product) => (
						<div key={product.id}>
							<ProductCard
								id={product.id}
								title={product.title}
								price={product.price}
								condition={product.condition}
								image_urls={product.image_urls}
								category={product.category.name}
								address={product.address}
								created_at={product.created_at}
								isLiked={likedProducts.includes(product.id)}
								onLike={handleLike}
								onClick={handleProductClick}
							/>
						</div>
					))}
				</div>

				{/* View All Button - Mobile */}
				<div className="mt-6 text-center md:hidden">
					<CompactButton
						onClick={handleViewAll}
						variant="primary"
						icon={<MdArrowForward className="w-4 h-4" />}
						className="w-full"
					>
						Xem tất cả {title.toLowerCase()}
					</CompactButton>
				</div>
			</div>
		</section>
	);
}
