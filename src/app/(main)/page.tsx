// app/(main)/page.tsx
// Example: ProductsPage.tsx hoặc ProductGrid component
'use client';
import React, { useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { ProductCondition } from '@/types/product';

// Example data structure
interface Product {
	id: string;
	title: string;
	price: string;
	condition: ProductCondition;
	images: string[];
	location: string;
	timeAgo: string;
}

const HomePage = () => {
	const [likedProducts, setLikedProducts] = useState<string[]>([]);

	// Example products data
	const products: Product[] = [
		{
			id: '1',
			title: 'iPhone 13 Pro Max 256GB - Máy đẹp, pin trâu',
			price: '15000000',
			condition: ProductCondition.LIKE_NEW,
			images: [
				'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400',
			],
			location: 'Quận 1, TP. Hồ Chí Minh',
			timeAgo: '2 giờ trước',
		},
		{
			id: '2',
			title: 'MacBook Pro M2 2023 - Fullbox, chưa kích hoạt',
			price: '35000000',
			condition: ProductCondition.NEW,
			images: [
				'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
			],
			location: 'Quận 3, TP. Hồ Chí Minh',
			timeAgo: '5 giờ trước',
		},
		{
			id: '3',
			title: 'Xe đạp thể thao Giant - Nhập khẩu Nhật',
			price: '4500000',
			condition: ProductCondition.GOOD,
			images: [
				'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400',
			],
			location: 'Quận 7, TP. Hồ Chí Minh',
			timeAgo: '1 ngày trước',
		},
		{
			id: '4',
			title: 'Ghế gaming DXRacer - Còn mới 95%',
			price: '2800000',
			condition: ProductCondition.LIKE_NEW,
			images: [
				'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400',
			],
			location: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
			timeAgo: '3 giờ trước',
		},
	];

	const handleLike = (id: string) => {
		setLikedProducts((prev) =>
			prev.includes(id)
				? prev.filter((productId) => productId !== id)
				: [...prev, id]
		);
	};

	const handleProductClick = (id: string) => {
		console.log('Navigate to product:', id);
		// router.push(`/products/${id}`);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Sản phẩm nổi bật
				</h1>
				<p className="text-gray-600">
					Khám phá các sản phẩm chất lượng từ người bán uy tín
				</p>
			</div>

			{/* Product Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{products.map((product) => (
					<ProductCard
						key={product.id}
						id={product.id}
						title={product.title}
						price={product.price}
						condition={product.condition}
						images={product.images}
						location={product.location}
						timeAgo={product.timeAgo}
						isLiked={likedProducts.includes(product.id)}
						onLike={handleLike}
						onClick={handleProductClick}
					/>
				))}
			</div>

			{/* Load More Button */}
			<div className="mt-12 text-center">
				<button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg">
					Xem thêm sản phẩm
				</button>
			</div>
		</div>
	);
};

export default HomePage;
