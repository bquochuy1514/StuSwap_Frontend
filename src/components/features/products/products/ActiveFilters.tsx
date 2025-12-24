// src/app/(main)/(public)/products/components/ActiveFilters.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { DropdownItem } from '@/components/ui/DropDown';

interface ActiveFiltersProps {
	appliedFilters: {
		searchQuery: string;
		selectedCategory: string;
		selectedConditions: string[];
		minPrice: string;
		maxPrice: string;
		selectedLocation: string;
	};
	conditionItems: DropdownItem[];
	onRemoveSearchQuery: () => void;
	onRemoveCategory: () => void;
	onRemoveLocation: () => void;
	onRemovePrice: () => void;
	onRemoveCondition: (condition: string) => void;
	getCategoryName: (categoryId: string) => string;
	formatPrice: (value: string | number) => string;
}

export default function ActiveFilters({
	appliedFilters,
	conditionItems,
	onRemoveSearchQuery,
	onRemoveCategory,
	onRemoveLocation,
	onRemovePrice,
	onRemoveCondition,
	getCategoryName,
	formatPrice,
}: ActiveFiltersProps) {
	const hasActiveFilters =
		appliedFilters.selectedCategory ||
		appliedFilters.selectedConditions.length > 0 ||
		appliedFilters.minPrice ||
		appliedFilters.maxPrice ||
		appliedFilters.selectedLocation ||
		appliedFilters.searchQuery;

	if (!hasActiveFilters) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="mb-4 flex flex-wrap gap-2 items-center"
		>
			<span className="text-sm text-gray-600 font-medium">Đang lọc:</span>

			{appliedFilters.searchQuery && (
				<span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
					Từ khóa: {appliedFilters.searchQuery}
					<MdClose
						className="w-4 h-4 cursor-pointer hover:text-emerald-900"
						onClick={onRemoveSearchQuery}
					/>
				</span>
			)}

			{appliedFilters.selectedCategory && (
				<span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
					{getCategoryName(appliedFilters.selectedCategory)}
					<MdClose
						className="w-4 h-4 cursor-pointer hover:text-blue-900"
						onClick={onRemoveCategory}
					/>
				</span>
			)}

			{appliedFilters.selectedLocation && (
				<span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
					{appliedFilters.selectedLocation}
					<MdClose
						className="w-4 h-4 cursor-pointer hover:text-purple-900"
						onClick={onRemoveLocation}
					/>
				</span>
			)}

			{(appliedFilters.minPrice || appliedFilters.maxPrice) && (
				<span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
					{formatPrice(appliedFilters.minPrice || '0')} -{' '}
					{appliedFilters.maxPrice
						? formatPrice(appliedFilters.maxPrice)
						: '∞'}
					<MdClose
						className="w-4 h-4 cursor-pointer hover:text-orange-900"
						onClick={onRemovePrice}
					/>
				</span>
			)}

			{appliedFilters.selectedConditions.map((cond) => (
				<span
					key={cond}
					className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
				>
					{conditionItems.find((c) => c.value === cond)?.label ||
						cond}
					<MdClose
						className="w-4 h-4 cursor-pointer hover:text-teal-900"
						onClick={() => onRemoveCondition(cond)}
					/>
				</span>
			))}
		</motion.div>
	);
}
