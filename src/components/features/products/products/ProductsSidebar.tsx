// src/app/(main)/(public)/products/components/ProductsSidebar.tsx
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiFilter } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { HiOutlineViewGrid } from 'react-icons/hi';
import Dropdown, { DropdownItem } from '@/components/ui/DropDown';
import CompactButton from '@/components/ui/CompactButton';

interface ProductsSidebarProps {
	categoryItems: DropdownItem[];
	locationItems: DropdownItem[];
	selectedCategory: string;
	selectedLocation: string;
	selectedConditions: string[];
	minPrice: string;
	maxPrice: string;
	onCategoryChange: (value: string) => void;
	onLocationChange: (value: string) => void;
	onConditionsChange: (value: string[]) => void;
	onMinPriceChange: (value: string) => void;
	onMaxPriceChange: (value: string) => void;
	onApplyFilters: () => void;
	onClearAll: () => void;
	hasFilterChanges: boolean;
}

const conditionItems: DropdownItem[] = [
	{ id: 'NEW', label: 'Mới 100%', value: 'new' },
	{ id: 'LIKE_NEW', label: 'Như mới', value: 'used_like_new' },
	{ id: 'GOOD', label: 'Còn tốt', value: 'used_good' },
	{ id: 'FAIR', label: 'Khá', value: 'used_fair' },
];

export default function ProductsSidebar({
	categoryItems,
	locationItems,
	selectedCategory,
	selectedLocation,
	selectedConditions,
	minPrice,
	maxPrice,
	onCategoryChange,
	onLocationChange,
	onConditionsChange,
	onMinPriceChange,
	onMaxPriceChange,
	onApplyFilters,
	onClearAll,
	hasFilterChanges,
}: ProductsSidebarProps) {
	const handleConditionToggle = (condValue: string, checked: boolean) => {
		if (checked) {
			onConditionsChange([...selectedConditions, condValue]);
		} else {
			onConditionsChange(
				selectedConditions.filter((c) => c !== condValue)
			);
		}
	};

	return (
		<motion.aside
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			className="w-full md:w-64 flex-shrink-0"
		>
			<div className="bg-white rounded-xl shadow-md p-4 md:sticky md:top-20">
				<h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-between">
					<span className="flex items-center gap-2">
						<FiFilter className="w-5 h-5 text-emerald-600" />
						Bộ lọc
					</span>
					<button
						className="text-sm text-emerald-600 hover:text-emerald-700 font-normal cursor-pointer"
						onClick={onClearAll}
					>
						Xóa tất cả
					</button>
				</h3>

				{/* Filter Sections */}
				<div className="space-y-6">
					{/* 1. LOCATION FILTER */}
					<div>
						<h4 className="font-medium text-gray-900 mb-3 text-sm flex items-center gap-1">
							<MdLocationOn className="w-4 h-4 text-emerald-600" />
							Địa điểm
						</h4>
						<Dropdown
							items={locationItems}
							value={selectedLocation}
							onChange={(value) =>
								onLocationChange(String(value))
							}
							placeholder="Tất cả địa điểm"
							icon={<IoLocationOutline className="w-4 h-4" />}
							variant="default"
							size="md"
							fullWidth
							defaultItem={{
								id: 'all',
								label: 'Toàn quốc',
							}}
							searchable
						/>
					</div>

					<hr className="border-gray-200" />

					{/* 2. CATEGORY FILTER */}
					<div>
						<h4 className="font-medium text-gray-900 mb-3 text-sm">
							Danh mục
						</h4>
						<Dropdown
							items={categoryItems}
							value={selectedCategory}
							onChange={(value) =>
								onCategoryChange(String(value))
							}
							placeholder="Tất cả danh mục"
							icon={<HiOutlineViewGrid className="w-4 h-4" />}
							variant="default"
							size="md"
							fullWidth
							defaultItem={{
								id: 'all',
								label: 'Tất cả danh mục',
							}}
						/>
					</div>

					<hr className="border-gray-200" />

					{/* 3. PRICE FILTER */}
					<div>
						<h4 className="font-medium text-gray-900 mb-3 text-sm">
							Khoảng giá (VNĐ)
						</h4>
						<div className="flex gap-2 items-center">
							<input
								type="number"
								min="0"
								placeholder="Từ"
								value={minPrice}
								onChange={(e) =>
									onMinPriceChange(e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
							/>
							<span className="text-gray-500">-</span>
							<input
								type="number"
								min="0"
								placeholder="Đến"
								value={maxPrice}
								onChange={(e) =>
									onMaxPriceChange(e.target.value)
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
							/>
						</div>
					</div>

					<hr className="border-gray-200" />

					{/* 4. CONDITION FILTER */}
					<div>
						<h4 className="font-medium text-gray-900 mb-3 text-sm">
							Tình trạng
						</h4>
						<div className="space-y-2">
							{conditionItems.map((cond) => (
								<label
									key={cond.id}
									className="flex items-center gap-2 cursor-pointer group"
								>
									<input
										type="checkbox"
										checked={selectedConditions.includes(
											String(cond.value)
										)}
										onChange={(e) =>
											handleConditionToggle(
												String(cond.value),
												e.target.checked
											)
										}
										className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
									/>
									<span className="text-sm text-gray-700 group-hover:text-emerald-600">
										{cond.label}
									</span>
								</label>
							))}
						</div>
					</div>

					{/* APPLY FILTERS BUTTON */}
					<CompactButton
						onClick={onApplyFilters}
						disabled={!hasFilterChanges}
						variant="primary"
						size="md"
						fullWidth
					>
						{hasFilterChanges
							? 'Áp dụng bộ lọc'
							: 'Không có thay đổi'}
					</CompactButton>
				</div>
			</div>
		</motion.aside>
	);
}
