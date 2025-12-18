// app/(main)/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types/product';
import api from '@/lib/api/axiosInstance';

// Example data structure matching ProductCard props
const HomePage = () => {
	const [likedProducts, setLikedProducts] = useState<string[]>([]);
	const [products, setProducts] = useState<Product[]>([]);

	// Example products data
	useEffect(() => {
		const fetchAllProducts = async () => {
			const response = await api.get('/api/products');
			setProducts(response.data);
		};
		fetchAllProducts();
	}, []);

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
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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

				{/* Product Grid - Thay đổi số cột để card nhỏ hơn */}
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
					{products.map((product) => (
						<ProductCard
							key={product.id}
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
					))}
				</div>

				{/* Load More Button */}
				<div className="mt-12 text-center">
					<button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200">
						Xem thêm sản phẩm
					</button>
				</div>
			</div>
		</div>
	);
};
export default HomePage;
