// components/ui/SearchInput.tsx
'use client';

import { useState, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoLocationOutline } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SearchInputProps {
	onSearch?: (query: string, category?: string, location?: string) => void;
	className?: string;
}

export default function SearchInput({ onSearch, className }: SearchInputProps) {
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('Tất cả');
	const [selectedLocation, setSelectedLocation] = useState('Toàn quốc');
	const [openCategoryMenu, setOpenCategoryMenu] = useState(false);
	const categoryRef = useRef<HTMLDivElement>(null);

	const categories = [
		'Tất cả',
		'Điện thoại',
		'Laptop',
		'Máy tính bảng',
		'Đồ gia dụng',
		'Thời trang',
		'Đồ chơi',
		'Sách',
		'Xe cộ',
	];

	const locations = [
		'Toàn quốc',
		'Hà Nội',
		'TP. Hồ Chí Minh',
		'Đà Nẵng',
		'Cần Thơ',
		'Hải Phòng',
	];

	const handleSearch = () => {
		if (onSearch) {
			onSearch(searchQuery, selectedCategory, selectedLocation);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearch();
		}
	};

	return (
		<div
			className={cn('relative bg-white rounded-2xl shadow-lg', className)}
		>
			<div className="flex items-stretch">
				{/* Category Dropdown */}
				<div className="relative flex-shrink-0" ref={categoryRef}>
					<button
						onClick={() => setOpenCategoryMenu(!openCategoryMenu)}
						className="h-full flex items-center gap-2 px-5 py-3.5 text-gray-700 font-medium hover:bg-gray-50 rounded-l-2xl transition-all border-r border-gray-200"
					>
						<HiOutlineViewGrid className="w-5 h-5 text-gray-600" />
						<span className="hidden sm:inline text-sm whitespace-nowrap">
							{selectedCategory}
						</span>
						<FiChevronDown
							className={`w-4 h-4 text-gray-600 transition-transform ${
								openCategoryMenu ? 'rotate-180' : ''
							}`}
						/>
					</button>

					{/* Category Menu */}
					{openCategoryMenu && (
						<div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 animate-fadeIn z-50">
							<div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
								Danh mục
							</div>
							{categories.map((category) => (
								<button
									key={category}
									onClick={() => {
										setSelectedCategory(category);
										setOpenCategoryMenu(false);
									}}
									className={`w-full text-left px-4 py-2 text-sm transition-colors ${
										selectedCategory === category
											? 'bg-emerald-50 text-emerald-700 font-semibold'
											: 'text-gray-700 hover:bg-gray-50'
									}`}
								>
									{category}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Search Input */}
				<div className="relative flex-1">
					<FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder="Tìm sản phẩm..."
						className="w-full h-full pl-12 pr-4 py-3.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
					/>
				</div>

				{/* Location Select */}
				<div className="relative flex-shrink-0 border-l border-gray-200 hidden sm:block">
					<IoLocationOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
					<select
						value={selectedLocation}
						onChange={(e) => setSelectedLocation(e.target.value)}
						className="h-full pl-11 pr-10 py-3.5 text-sm text-gray-700 font-medium cursor-pointer appearance-none bg-transparent focus:outline-none hover:bg-gray-50 transition-colors"
					>
						{locations.map((location) => (
							<option key={location} value={location}>
								{location}
							</option>
						))}
					</select>
					<FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
				</div>

				{/* Search Button */}
				<button
					onClick={handleSearch}
					className="flex-shrink-0 px-8 py-3.5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-r-2xl transition-colors shadow-sm"
				>
					<span className="hidden md:inline">Tìm kiếm</span>
					<FaSearch className="md:hidden w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
