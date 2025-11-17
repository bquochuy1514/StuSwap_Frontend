import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiInfo } from 'react-icons/fi';
import { ImagePreview } from '@/app/(main)/(protected)/post/page';
import { ProductCondition } from '@/types/product';
import { AddressData } from '@/types/auth';
import ProductCard from '@/components/ui/ProductCard';

interface ProductPreviewDemoProps {
	title: string;
	description: string;
	price: string;
	condition: ProductCondition;
	images: ImagePreview[];
	address?: AddressData;
	categoryName?: string;
}

const ProductPreviewDemo: React.FC<ProductPreviewDemoProps> = ({
	title,
	description,
	price,
	condition,
	images,
	address,
	categoryName,
}) => {
	const hasContent = title || description || price || images.length > 0;

	if (!hasContent) {
		return (
			<div className="sticky top-8">
				<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12">
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gray-200 rounded-full mb-4">
							<FiPackage className="w-8 h-8 text-gray-400" />
						</div>
						<h3 className="text-lg font-semibold text-gray-700 mb-2">
							Xem trước sản phẩm
						</h3>
						<p className="text-sm text-gray-500">
							Điền đầy đủ thông tin để xem preview
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="sticky top-8 space-y-4">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl px-5 py-3 shadow-lg"
			>
				<h3 className="text-white font-bold text-base flex items-center gap-2">
					<FiPackage className="w-5 h-5" />
					Xem trước sản phẩm
				</h3>
			</motion.div>

			{/* Product Card Preview - Centered với max-width */}
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ delay: 0.1 }}
				className="flex justify-center"
			>
				<div className="w-full max-w-xs mx-auto">
					<ProductCard
						title={title}
						price={price}
						image_urls={images.map((img) => img.url)}
						condition={condition}
						address={address}
						created_at={new Date().toISOString()}
						isLiked={false}
						category={categoryName}
						key={images.map((img) => img.id).join('-')}
					/>
				</div>
			</motion.div>
		</div>
	);
};

export default ProductPreviewDemo;
