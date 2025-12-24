// app/(main)/page.tsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import HeroSection from '@/components/layout/home/HeroSection';
import CategoriesSection from '@/components/layout/home/CategoriesSection';
import FeaturedSection from '@/components/layout/home/FeaturedSection';
import { IoLocationOutline, IoSparkles } from 'react-icons/io5';
import { useAuth } from '@/contexts/AuthContext';
import CompactButton from '@/components/ui/CompactButton';

// Example data structure matching ProductCard props
const HomePage = () => {
	const router = useRouter();
	const { user } = useAuth();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 py-8">
				{/* 1. Hero Section */}
				<HeroSection />

				{/* 2. Categories Grid */}
				<CategoriesSection />

				{/* 3. Sản phẩm nổi bật */}
				<FeaturedSection
					title="Sản phẩm nổi bật"
					description="Các sản phẩm được ưu tiên hiển thị"
					icon={
						<IoSparkles className="w-6 h-6 md:w-7 md:h-7 text-yellow-500" />
					}
					query={{
						sortBy: 'newest',
						limit: 12,
					}}
					viewAllLink="/products?sortBy=newest"
					emptyMessage="Chưa có sản phẩm nổi bật nào"
				/>

				{/* 4. Sản phẩm gần bạn (conditional) */}
				{user?.address?.province && (
					<FeaturedSection
						title="Sản phẩm gần bạn"
						description={`Sản phẩm tại ${user?.address?.province}`}
						icon={
							<IoLocationOutline className="w-6 h-6 md:w-7 md:h-7 text-blue-600" />
						}
						query={{
							sortBy: 'newest',
							province: user?.address?.province,
							limit: 12,
						}}
						viewAllLink={`/products?province=${user?.address?.province}`}
						emptyMessage={`Chưa có sản phẩm nào tại ${user?.address?.province}`}
					/>
				)}

				{/* 7. CTA Section - Đăng tin */}
				<section className="py-6 md:py-10 px-4">
					<div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
						<h2 className="text-2xl md:text-3xl font-bold mb-4">
							Bạn có đồ cần bán?
						</h2>
						<p className="text-base md:text-lg mb-6 opacity-90">
							Đăng tin miễn phí, bán đồ nhanh chóng, kiếm thêm thu
							nhập ngay hôm nay!
						</p>
						<CompactButton
							onClick={() => {
								router.push('/post');
							}}
							variant="secondary"
							size="lg"
						>
							Đăng tin ngay - Miễn phí 100%
						</CompactButton>
					</div>
				</section>
			</div>
		</div>
	);
};
export default HomePage;
