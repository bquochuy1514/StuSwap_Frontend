/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ui/SearchBar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { IoLocationOutline } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import Dropdown, { DropdownItem } from '@/components/ui/DropDown';
import SearchInput from '@/components/ui/SearchInput';
import { fetchCategories } from '@/lib/api/categoryApi';
import { Category } from '@/types/category';

interface Province {
	code: number;
	name: string;
	codename: string;
	division_type: string;
	phone_code: number;
}

export default function SearchBar({ className }: { className?: string }) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');
	const [categoryItems, setCategoryItems] = useState<DropdownItem[]>([]);
	const [locationItems, setLocationItems] = useState<DropdownItem[]>([]);

	useEffect(() => {
		const getCategories = async () => {
			const response = await fetchCategories();
			const data: Category[] = response;

			const transformedData: DropdownItem[] = data.map((category) => ({
				id: category.id,
				label: category.name,
				value: category.id,
			}));

			setCategoryItems(transformedData);
		};

		getCategories();
	}, []);

	useEffect(() => {
		const fetchLocations = async () => {
			try {
				const response = await fetch(
					'https://api.vnappmob.com/api/v2/province/'
				);
				const data = await response.json();

				// API mới có wrapper "results"
				const transformed: DropdownItem[] = data.results.map(
					(prov: any) => ({
						id: prov.province_id, // Đổi từ code → province_id
						label: prov.province_name, // Đổi từ name → province_name
						value: prov.province_id, // Dùng province_id (đã là string rồi)
					})
				);

				setLocationItems(transformed);
			} catch (error) {
				console.error('Error fetching locations:', error);
			}
		};

		fetchLocations();
	}, []);

	const handleSearch = () => {
		const params = new URLSearchParams();

		if (searchQuery.trim()) {
			params.set('q', searchQuery.trim());
		}

		if (selectedCategory) {
			params.set('category', selectedCategory);
		}

		if (selectedLocation) {
			params.set('location', selectedLocation);
		}

		console.log('Search: ', {
			searchQuery,
			selectedCategory,
			selectedLocation,
		});
	};

	return (
		<div
			className={cn(
				'relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300',
				className
			)}
		>
			{/* Desktop Layout - Single Row */}
			<div className="hidden lg:flex items-stretch">
				{/* Category Dropdown */}
				<Dropdown
					items={categoryItems}
					value={selectedCategory}
					onChange={(value) => setSelectedCategory(String(value))}
					placeholder="Danh mục"
					icon={<HiOutlineViewGrid className="w-4 h-4" />}
					variant="default"
					size="md"
					defaultItem={{ id: 'all', label: 'Tất cả' }}
				/>

				{/* Search Input */}
				<SearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					onSearch={handleSearch}
					placeholder="Tìm kiếm đồ cũ..."
					showIcon={true}
					size="md"
				/>

				{/* Location Dropdown */}
				<Dropdown
					items={locationItems}
					value={selectedLocation}
					onChange={(value) => setSelectedLocation(String(value))}
					placeholder="Vị trí"
					icon={<IoLocationOutline className="w-4 h-4" />}
					variant="default"
					size="md"
					defaultItem={{ id: 'all', label: 'Toàn quốc' }}
					searchable
				/>

				{/* Search Button */}
				<button
					onClick={handleSearch}
					className="flex items-center gap-2 cursor-pointer flex-shrink-0 
						px-5 h-11 text-white text-sm font-medium 
						rounded-r-xl transition-all duration-300 ease-out bg-gradient-to-r from-emerald-500 to-teal-600
						shadow-md shadow-emerald-500/20
						hover:from-emerald-600 hover:to-teal-700
						hover:shadow-lg hover:shadow-emerald-500/30
						hover:scale-[1.02]
						active:scale-[0.98]
						focus:outline-none focus:ring-2 focus:ring-emerald-400/50 group"
				>
					<FaSearch className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
					<span>Tìm kiếm</span>
				</button>
			</div>

			{/* Mobile/Tablet Layout - Single Row */}
			<div className="lg:hidden flex items-stretch">
				{/* Category Dropdown */}
				<Dropdown
					items={categoryItems}
					value={selectedCategory}
					onChange={(value) => setSelectedCategory(String(value))}
					placeholder="Danh mục"
					icon={<HiOutlineViewGrid className="w-4 h-4" />}
					variant="compact"
					size="md"
					hideIconOnMobile
					defaultItem={{ id: 'all', label: 'Tất cả' }}
				/>

				{/* Search Input */}
				<SearchInput
					value={searchQuery}
					onChange={setSearchQuery}
					onSearch={handleSearch}
					placeholder="Tìm kiếm đồ cũ..."
					showIcon={false}
					expandable={true}
					size="md"
				/>

				{/* Location Dropdown */}
				<Dropdown
					items={locationItems}
					value={selectedLocation}
					onChange={(value) => setSelectedLocation(String(value))}
					placeholder="Vị trí"
					icon={<IoLocationOutline className="w-4 h-4" />}
					variant="compact"
					size="md"
					defaultItem={{ id: 'all', label: 'Toàn quốc' }}
					hideIconOnMobile
					searchable
				/>

				{/* Search Button */}
				<button
					onClick={handleSearch}
					className="flex items-center justify-center gap-2 cursor-pointer flex-shrink-0 px-4 sm:px-5 h-11 
					bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 
					text-white font-medium text-sm rounded-r-xl transition-all duration-200 shadow-md hover:shadow-lg group"
				>
					<FaSearch className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
					<span className="hidden sm:inline">Tìm kiếm</span>
				</button>
			</div>
		</div>
	);
}
