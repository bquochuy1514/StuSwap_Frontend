// src/app/(main)/(public)/products/components/ProductsGrid.tsx
'use client';
import React from 'react';
import Dropdown, { DropdownItem } from '@/components/ui/DropDown';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types/product';

interface ProductsGridProps {
	products: Product[];
	loading: boolean;
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
	sortBy: string;
	sortItems: DropdownItem<string>[]; // ✅ Khai báo type rõ ràng
	likedProducts: string[];
	onSortChange: (value: string) => void;
	onPageChange: (page: number) => void;
	onLike: (id: string) => void;
	onProductClick: (id: string) => void;
	onClearFilters: () => void;
}

export default function ProductsGrid({
	products,
	loading,
	meta,
	sortBy,
	sortItems,
	likedProducts,
	onSortChange,
	onPageChange,
	onLike,
	onProductClick,
	onClearFilters,
}: ProductsGridProps) {
	return (
		<div className="flex-1">
			{/* Results Header */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
				<p className="text-sm text-gray-600">
					Hiển thị{' '}
					<span className="font-semibold text-gray-900">
						{(meta.page - 1) * meta.limit + 1}-
						{Math.min(meta.page * meta.limit, meta.total)}
					</span>{' '}
					trong{' '}
					<span className="font-semibold text-gray-900">
						{meta.total}
					</span>{' '}
					sản phẩm
				</p>

				{/* Sort Dropdown */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-600 hidden sm:inline">
						Sắp xếp:
					</span>
					<Dropdown<string>
						items={sortItems}
						value={sortBy}
						onChange={onSortChange}
						placeholder="Sắp xếp"
						variant="minimal"
						size="md"
					/>
				</div>
			</div>

			{/* Products Grid */}
			{loading ? (
				// Loading skeleton
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
						<div
							key={i}
							className="bg-white rounded-xl shadow-md p-4 animate-pulse"
						>
							<div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
							<div className="h-4 bg-gray-200 rounded mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
							<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						</div>
					))}
				</div>
			) : products.length > 0 ? (
				<>
					{/* Products list with ProductCard */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
								onLike={onLike}
								onClick={onProductClick}
							/>
						))}
					</div>

					{/* Pagination */}
					{!loading && products.length > 0 && (
						<div className="mt-8 flex justify-center">
							<div className="flex items-center gap-2">
								<button
									disabled={!meta.hasPrevPage}
									onClick={() => onPageChange(meta.page - 1)}
									className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
								>
									Trước
								</button>

								{Array.from(
									{ length: meta.totalPages },
									(_, i) => i + 1
								)
									.filter(
										(p) =>
											p === 1 ||
											p === meta.totalPages ||
											Math.abs(p - meta.page) <= 1
									)
									.map((p, idx, arr) => (
										<React.Fragment key={p}>
											{idx > 0 &&
												arr[idx - 1] !== p - 1 && (
													<span className="px-2 text-gray-500">
														...
													</span>
												)}
											<button
												onClick={() => onPageChange(p)}
												className={`px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
													p === meta.page
														? 'bg-emerald-600 text-white'
														: 'border border-gray-300 hover:bg-gray-50'
												}`}
											>
												{p}
											</button>
										</React.Fragment>
									))}

								<button
									disabled={!meta.hasNextPage}
									onClick={() => onPageChange(meta.page + 1)}
									className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
								>
									Sau
								</button>
							</div>
						</div>
					)}
				</>
			) : (
				// No results
				<div className="text-center py-16">
					<h3 className="text-xl font-semibold text-gray-900 mb-2">
						Không tìm thấy sản phẩm nào
					</h3>
					<p className="text-gray-600 mb-4">
						Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
					</p>
					<button
						onClick={onClearFilters}
						className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
					>
						Xóa bộ lọc
					</button>
				</div>
			)}
		</div>
	);
}
