import { fetchCategories } from '@/lib/api/categoryApi';
import { handleApiError } from '@/lib/utils';
import { Category } from '@/types/category';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MdCategory } from 'react-icons/md';

const fadeInUp = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6 },
	},
};

const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

export default function CategoriesSection() {
	const router = useRouter();
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		let isMounted = true;

		async function loadCategories() {
			try {
				setLoading(true);
				setError(null);

				const data = await fetchCategories();

				if (isMounted) {
					setCategories(data || []);
				}
			} catch (err) {
				handleApiError(err);
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		loadCategories();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleCategoryClick = (categoryId: number) => {
		router.push(`/products?category=${categoryId}`);
	};

	// Loading state
	if (loading) {
		return (
			<section className="py-6 md:py-10 px-4">
				<div className="max-w-7xl mx-auto">
					{/* Header skeleton - giống FeaturedSection */}
					<div className="mb-6 md:mb-8">
						<div className="h-8 md:h-9 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
						<div className="h-4 md:h-5 w-80 bg-gray-200 rounded animate-pulse"></div>
					</div>

					{/* Grid skeleton */}
					<div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div
								key={i}
								className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md animate-pulse"
							>
								<div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-2 md:mb-2.5 bg-gray-200 rounded-lg md:rounded-xl"></div>
								<div className="h-3 md:h-4 bg-gray-200 rounded mx-auto w-16 md:w-20"></div>
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
					{/* Header - giống FeaturedSection */}
					<div className="mb-6 md:mb-8">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
							<MdCategory className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
							Danh mục phổ biến
						</h2>
					</div>

					{/* Error content */}
					<div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
						<p className="text-red-600 mb-4">⚠️ {error}</p>
						<button
							onClick={() => window.location.reload()}
							className="px-4 py-2 bg-emerald-600 text-white text-sm md:text-base rounded-lg hover:bg-emerald-700 transition-colors"
						>
							Thử lại
						</button>
					</div>
				</div>
			</section>
		);
	}

	// Empty state
	if (categories.length === 0) {
		return (
			<section className="py-6 md:py-10 px-4">
				<div className="max-w-7xl mx-auto">
					{/* Header - giống FeaturedSection */}
					<div className="mb-6 md:mb-8">
						<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
							<MdCategory className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
							Danh mục phổ biến
						</h2>
						<p className="text-sm md:text-base text-gray-600">
							Tìm kiếm đồ cũ theo danh mục yêu thích
						</p>
					</div>

					{/* Empty content */}
					<div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
						<p className="text-gray-500">Chưa có danh mục nào</p>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section className="py-6 md:py-10 px-4">
			<div className="max-w-7xl mx-auto">
				{/* Header - ĐÃ ĐỒNG BỘ với FeaturedSection */}
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={fadeInUp}
					className="mb-6 md:mb-8"
				>
					<h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
						<MdCategory className="w-6 h-6 md:w-7 md:h-7 text-emerald-600" />
						Danh mục phổ biến
					</h2>
					<p className="text-sm md:text-base text-gray-600">
						Tìm kiếm đồ cũ theo danh mục yêu thích
					</p>
				</motion.div>

				{/* Categories Grid */}
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={staggerContainer}
					className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4"
				>
					{categories.map((category, index) => (
						<motion.div
							key={category.id || index}
							variants={fadeInUp}
							whileHover={{ scale: 1.05, y: -5 }}
							whileTap={{ scale: 0.95 }}
							className="group cursor-pointer"
							onClick={() => handleCategoryClick(category.id)}
						>
							<div
								title={category.description}
								className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 h-full flex flex-col items-center"
							>
								{/* Icon Container - Tăng size và giảm khoảng cách */}
								<div className="w-14 h-14 md:w-16 md:h-16 rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0 mb-2 md:mb-2.5">
									<img
										src={category.icon_url}
										alt={category.name}
										className="w-9 h-9 md:w-11 md:h-11 object-contain group-hover:scale-110 transition-transform"
									/>
								</div>

								{/* Text - Chiều cao cố định để đồng bộ */}
								<h3 className="text-center text-xs md:text-sm font-semibold text-gray-900 line-clamp-2 h-[2.25rem] md:h-[2.5rem] flex items-center justify-center leading-tight px-1">
									{category.name}
								</h3>
							</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
