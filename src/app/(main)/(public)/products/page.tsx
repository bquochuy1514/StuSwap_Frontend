/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(main)/(public)/products/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import api from '@/lib/api/axiosInstance';
import { DropdownItem } from '@/components/ui/DropDown';
import { Product } from '@/types/product';
import ProductsSidebar from '@/components/features/products/products/ProductsSidebar';
import ActiveFilters from '@/components/features/products/products/ActiveFilters';
import ProductsGrid from '@/components/features/products/products/ProductsGrid';

interface ProductsResponse {
	data: Product[];
	meta: {
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNextPage: boolean;
		hasPrevPage: boolean;
	};
}

interface Category {
	id: number;
	name: string;
	slug: string;
}

interface Province {
	province_id: string;
	province_name: string;
}

export default function ProductsPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const queryFromUrl = searchParams.get('q') || '';
	const categoryFromUrl = searchParams.get('category') || '';
	const locationFromUrl = searchParams.get('province') || '';
	const sortByFromUrl = searchParams.get('sortBy') || 'newest';

	// ============================================
	// STATE
	// ============================================
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [meta, setMeta] = useState({
		total: 0,
		page: 1,
		limit: 15,
		totalPages: 0,
		hasNextPage: false,
		hasPrevPage: false,
	});

	const [appliedFilters, setAppliedFilters] = useState({
		searchQuery: queryFromUrl,
		selectedCategory: categoryFromUrl,
		selectedConditions: [] as string[],
		minPrice: '',
		maxPrice: '',
		selectedLocation: locationFromUrl,
		sortBy: sortByFromUrl,
		page: 1,
	});

	const [searchQuery, setSearchQuery] = useState(queryFromUrl);
	const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
	const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');
	const [selectedLocation, setSelectedLocation] = useState(locationFromUrl);
	const [sortBy, setSortBy] = useState(sortByFromUrl);
	const [page, setPage] = useState(1);
	const [likedProducts, setLikedProducts] = useState<string[]>([]);

	const [categoryItems, setCategoryItems] = useState<DropdownItem[]>([]);
	const [locationItems, setLocationItems] = useState<DropdownItem[]>([]);

	const conditionItems: DropdownItem[] = [
		{ id: 'NEW', label: 'Mới 100%', value: 'new' },
		{ id: 'LIKE_NEW', label: 'Như mới', value: 'used_like_new' },
		{ id: 'GOOD', label: 'Còn tốt', value: 'used_good' },
		{ id: 'FAIR', label: 'Khá', value: 'used_fair' },
	];

	const sortItems: DropdownItem<string>[] = [
		{ id: 'newest', label: 'Mới nhất', value: 'newest' },
		{ id: 'price_asc', label: 'Giá thấp đến cao', value: 'price_asc' },
		{ id: 'price_desc', label: 'Giá cao đến thấp', value: 'price_desc' },
	];

	// ============================================
	// HELPERS
	// ============================================
	const formatPrice = (value: string | number) => {
		if (!value || value === '0' || value === 0) return '0';
		const numValue = typeof value === 'string' ? parseFloat(value) : value;
		return `${numValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')} ₫`;
	};

	const getCategoryName = (categoryId: string) => {
		const category = categoryItems.find((c) => String(c.id) === categoryId);
		return category?.label || 'Danh mục';
	};

	const hasFilterChanges =
		searchQuery !== appliedFilters.searchQuery ||
		selectedCategory !== appliedFilters.selectedCategory ||
		JSON.stringify(selectedConditions) !==
			JSON.stringify(appliedFilters.selectedConditions) ||
		minPrice !== appliedFilters.minPrice ||
		maxPrice !== appliedFilters.maxPrice ||
		selectedLocation !== appliedFilters.selectedLocation;

	const isSearchMode = !!appliedFilters.searchQuery;

	// ============================================
	// FETCH DATA
	// ============================================
	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const response = await api.get('/api/categories');
				const data: Category[] = response.data;
				const transformedData: DropdownItem[] = data.map(
					(category) => ({
						id: category.id,
						label: category.name,
						value: category.id,
					})
				);
				setCategoryItems(transformedData);
			} catch (error) {
				console.error('Error fetching categories:', error);
			}
		};
		fetchCategories();
	}, []);

	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				const response = await fetch(
					'https://api.vnappmob.com/api/v2/province/'
				);
				const data = await response.json();
				const transformed: DropdownItem[] = data.results.map(
					(prov: Province) => ({
						id: prov.province_id,
						label: prov.province_name,
						value: prov.province_name,
					})
				);
				setLocationItems(transformed);
			} catch (error) {
				console.error('Error fetching provinces:', error);
			}
		};
		fetchProvinces();
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [appliedFilters]);

	const fetchProducts = async () => {
		try {
			setLoading(true);
			const params: any = {
				page: appliedFilters.page,
				limit: 20,
				sortBy: appliedFilters.sortBy,
			};

			if (appliedFilters.searchQuery)
				params.q = appliedFilters.searchQuery;
			if (appliedFilters.selectedCategory)
				params.categoryId = appliedFilters.selectedCategory;
			if (appliedFilters.selectedConditions.length > 0)
				params.condition = appliedFilters.selectedConditions;
			if (appliedFilters.minPrice)
				params.minPrice = Number(appliedFilters.minPrice);
			if (appliedFilters.maxPrice)
				params.maxPrice = Number(appliedFilters.maxPrice);
			if (appliedFilters.selectedLocation)
				params.province = appliedFilters.selectedLocation;

			const response = await api.get<ProductsResponse>(
				'/api/products/search',
				{ params }
			);
			setProducts(response.data.data);
			setMeta(response.data.meta);
		} catch (error) {
			console.error('Error fetching products:', error);
		} finally {
			setLoading(false);
		}
	};

	// ============================================
	// HANDLERS
	// ============================================
	const applyFilters = () => {
		setAppliedFilters({
			searchQuery,
			selectedCategory,
			selectedConditions,
			minPrice,
			maxPrice,
			selectedLocation,
			sortBy,
			page: 1,
		});
		setPage(1);
	};

	const clearAllFilters = () => {
		setSearchQuery('');
		setSelectedCategory('');
		setSelectedConditions([]);
		setMinPrice('');
		setMaxPrice('');
		setSelectedLocation('');
		setSortBy('newest');
		setPage(1);
		setAppliedFilters({
			searchQuery: '',
			selectedCategory: '',
			selectedConditions: [],
			minPrice: '',
			maxPrice: '',
			selectedLocation: '',
			sortBy: 'newest',
			page: 1,
		});
		router.push('/products');
	};

	const handleSortChange = (value: string) => {
		setSortBy(value);
		setAppliedFilters((prev) => ({ ...prev, sortBy: value, page: 1 }));
		setPage(1);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		setAppliedFilters((prev) => ({ ...prev, page: newPage }));
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

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

	// Remove individual filters
	const handleRemoveSearchQuery = () => {
		setSearchQuery('');
		setAppliedFilters((prev) => ({ ...prev, searchQuery: '', page: 1 }));
	};

	const handleRemoveCategory = () => {
		setSelectedCategory('');
		setAppliedFilters((prev) => ({
			...prev,
			selectedCategory: '',
			page: 1,
		}));
	};

	const handleRemoveLocation = () => {
		setSelectedLocation('');
		setAppliedFilters((prev) => ({
			...prev,
			selectedLocation: '',
			page: 1,
		}));
	};

	const handleRemovePrice = () => {
		setMinPrice('');
		setMaxPrice('');
		setAppliedFilters((prev) => ({
			...prev,
			minPrice: '',
			maxPrice: '',
			page: 1,
		}));
	};

	const handleRemoveCondition = (cond: string) => {
		const newConditions = appliedFilters.selectedConditions.filter(
			(c) => c !== cond
		);
		setSelectedConditions(newConditions);
		setAppliedFilters((prev) => ({
			...prev,
			selectedConditions: newConditions,
			page: 1,
		}));
	};

	// ============================================
	// URL SYNC - CHỈ UPDATE KHI CÓ SỰ THAY ĐỔI TỪ USER
	// ============================================
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		// Skip URL update on initial load
		if (isInitialLoad) {
			setIsInitialLoad(false);
			return;
		}

		const params = new URLSearchParams();
		if (appliedFilters.searchQuery)
			params.set('q', appliedFilters.searchQuery);
		if (appliedFilters.selectedCategory)
			params.set('category', appliedFilters.selectedCategory);
		if (appliedFilters.selectedLocation)
			params.set('location', appliedFilters.selectedLocation);

		const queryString = params.toString();
		const newUrl = queryString ? `/products?${queryString}` : '/products';
		router.push(newUrl, { scroll: false });
	}, [
		appliedFilters.searchQuery,
		appliedFilters.selectedCategory,
		appliedFilters.selectedLocation,
	]);

	useEffect(() => {
		setSearchQuery(queryFromUrl);
		setSelectedCategory(categoryFromUrl);
		setSelectedLocation(locationFromUrl);
		setSortBy(sortByFromUrl);
		setAppliedFilters((prev) => ({
			...prev,
			searchQuery: queryFromUrl,
			selectedCategory: categoryFromUrl,
			selectedLocation: locationFromUrl,
			sortBy: sortByFromUrl,
		}));
	}, [queryFromUrl, categoryFromUrl, locationFromUrl, sortByFromUrl]);

	// ============================================
	// RENDER
	// ============================================
	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-6 md:mb-8"
				>
					<div className="text-sm text-gray-600 mb-3">
						<span className="hover:text-emerald-600 cursor-pointer">
							Trang chủ
						</span>
						<span className="mx-2">&gt;</span>
						<span className="font-medium text-gray-900">
							{isSearchMode
								? `Kết quả tìm kiếm "${appliedFilters.searchQuery}"`
								: 'Tất cả sản phẩm'}
						</span>
					</div>
				</motion.div>

				{/* Active Filters */}
				<ActiveFilters
					appliedFilters={appliedFilters}
					conditionItems={conditionItems}
					onRemoveSearchQuery={handleRemoveSearchQuery}
					onRemoveCategory={handleRemoveCategory}
					onRemoveLocation={handleRemoveLocation}
					onRemovePrice={handleRemovePrice}
					onRemoveCondition={handleRemoveCondition}
					getCategoryName={getCategoryName}
					formatPrice={formatPrice}
				/>

				{/* Main Content */}
				<div className="flex flex-col md:flex-row gap-6">
					{/* Sidebar */}
					<ProductsSidebar
						categoryItems={categoryItems}
						locationItems={locationItems}
						selectedCategory={selectedCategory}
						selectedLocation={selectedLocation}
						selectedConditions={selectedConditions}
						minPrice={minPrice}
						maxPrice={maxPrice}
						onCategoryChange={setSelectedCategory}
						onLocationChange={setSelectedLocation}
						onConditionsChange={setSelectedConditions}
						onMinPriceChange={setMinPrice}
						onMaxPriceChange={setMaxPrice}
						onApplyFilters={applyFilters}
						onClearAll={clearAllFilters}
						hasFilterChanges={hasFilterChanges}
					/>

					{/* Products Grid */}
					<ProductsGrid
						products={products}
						loading={loading}
						meta={meta}
						sortBy={sortBy}
						sortItems={sortItems}
						likedProducts={likedProducts}
						onSortChange={handleSortChange}
						onPageChange={handlePageChange}
						onLike={handleLike}
						onProductClick={handleProductClick}
						onClearFilters={clearAllFilters}
					/>
				</div>
			</div>
		</div>
	);
}
