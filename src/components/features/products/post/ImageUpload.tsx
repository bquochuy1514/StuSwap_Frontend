import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiUpload, FiX, FiAlertCircle } from 'react-icons/fi';
import { MdDragIndicator } from 'react-icons/md';
import { toast } from 'react-toastify';

interface ImageUploadProps {
	images: File[];
	onChange: (images: File[]) => void;
	maxImages?: number;
	maxSizeInMB?: number;
	acceptedFormats?: string[];
	error?: string;
	label?: string;
	showLabel?: boolean;
}

interface PreviewItem {
	id: string;
	file: File;
	url: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	images,
	onChange,
	maxImages = 5,
	maxSizeInMB = 10,
	acceptedFormats = ['jpg', 'jpeg', 'png', 'webp'],
	error,
	label = 'Hình ảnh sản phẩm',
	showLabel = true,
}) => {
	const [previews, setPreviews] = useState<PreviewItem[]>([]);
	const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []);

		if (images.length + files.length > maxImages) {
			toast.error(`Chỉ được tải lên tối đa ${maxImages} ảnh`);
			e.target.value = '';
			return;
		}

		const validFiles: File[] = [];
		const formatRegex = new RegExp(`\\/(${acceptedFormats.join('|')})$`);

		for (const file of files) {
			if (!file.type.match(formatRegex)) {
				toast.error(
					`${file.name}: Chỉ cho phép ${acceptedFormats
						.join(', ')
						.toUpperCase()}`
				);
				continue;
			}
			if (file.size > maxSizeInMB * 1024 * 1024) {
				toast.error(`${file.name}: Tối đa ${maxSizeInMB}MB`);
				continue;
			}
			validFiles.push(file);
		}

		if (validFiles.length === 0) {
			e.target.value = '';
			return;
		}

		const newPreviews: PreviewItem[] = [];
		for (const file of validFiles) {
			const url = URL.createObjectURL(file);
			newPreviews.push({
				id: `${Date.now()}-${Math.random()}`,
				file,
				url,
			});
		}

		setPreviews((prev) => [...prev, ...newPreviews]);
		onChange([...images, ...validFiles]);
		e.target.value = '';
	};

	const handleRemove = (index: number) => {
		URL.revokeObjectURL(previews[index].url);

		const newPreviews = previews.filter((_, i) => i !== index);
		const newFiles = images.filter((_, i) => i !== index);

		setPreviews(newPreviews);
		onChange(newFiles);
	};

	const handleDragStart = (e: React.DragEvent, index: number) => {
		setDraggedIndex(index);
		e.dataTransfer.effectAllowed = 'move';
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';

		if (draggedIndex === null || draggedIndex === index) return;

		// Reorder immediately for smooth experience
		const newPreviews = [...previews];
		const draggedItem = newPreviews[draggedIndex];

		newPreviews.splice(draggedIndex, 1);
		newPreviews.splice(index, 0, draggedItem);

		setPreviews(newPreviews);

		const newFiles = newPreviews.map((p) => p.file);
		onChange(newFiles);

		setDraggedIndex(index);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setDraggedIndex(null);
	};

	const handleDragEnd = () => {
		setDraggedIndex(null);
	};

	const isMaxReached = images.length >= maxImages;
	const acceptString = acceptedFormats.map((fmt) => `image/${fmt}`).join(',');

	return (
		<div>
			{/* Label */}
			{showLabel && (
				<label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
					<FiImage className="w-4 h-4 text-emerald-600" />
					{label} (Tối đa {maxImages} ảnh)
				</label>
			)}

			{/* Upload Zone */}
			<motion.div
				whileHover={!isMaxReached ? { scale: 1.01 } : {}}
				className="relative"
			>
				<input
					type="file"
					id="image-upload-input"
					multiple
					accept={acceptString}
					onChange={handleFileChange}
					className="hidden"
					disabled={isMaxReached}
				/>
				<label
					htmlFor="image-upload-input"
					className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all ${
						isMaxReached
							? 'border-gray-300 bg-gray-100 cursor-not-allowed'
							: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100 cursor-pointer'
					}`}
				>
					<motion.div
						animate={!isMaxReached ? { y: [0, -8, 0] } : {}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut',
						}}
					>
						<FiUpload className="w-10 h-10 text-emerald-600 mb-2" />
					</motion.div>
					<p className="text-sm font-semibold text-gray-700">
						{isMaxReached
							? `Đã đủ ${maxImages} ảnh`
							: 'Nhấn để tải ảnh'}
					</p>
					<p className="text-xs text-gray-500 mt-1">
						{acceptedFormats.map((f) => f.toUpperCase()).join(', ')}{' '}
						• Tối đa {maxSizeInMB}MB
					</p>
				</label>
			</motion.div>

			{/* Error */}
			<AnimatePresence>
				{error && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3 mt-3"
					>
						<FiAlertCircle className="flex-shrink-0 mt-0.5" />
						<span>{error}</span>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Preview Grid */}
			{previews.length > 0 && (
				<div className="mt-6 space-y-4">
					{/* Header */}
					<div className="flex items-center justify-between">
						<p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
							<FiImage className="w-4 h-4 text-emerald-600" />
							Đã chọn {previews.length} ảnh
						</p>
						{previews.length > 1 && (
							<p className="text-xs text-gray-500 flex items-center gap-1">
								<MdDragIndicator className="w-4 h-4" />
								Kéo để sắp xếp
							</p>
						)}
					</div>

					{/* Grid */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
						{previews.map((item, index) => (
							<div
								key={item.id}
								draggable
								onDragStart={(e) => handleDragStart(e, index)}
								onDragOver={(e) => handleDragOver(e, index)}
								onDrop={handleDrop}
								onDragEnd={handleDragEnd}
								className={`relative group cursor-move transition-all duration-200 aspect-square ${
									draggedIndex === index
										? 'opacity-50 scale-95'
										: 'opacity-100'
								}`}
							>
								{/* Image Container */}
								<div className="relative w-full h-full overflow-hidden rounded-2xl border-2 bg-white border-gray-200 group-hover:border-emerald-400 shadow-md group-hover:shadow-lg transition-all duration-200">
									<img
										src={item.url}
										alt={`Preview ${index + 1}`}
										className="w-full h-full object-cover pointer-events-none select-none"
										draggable={false}
									/>

									{/* Overlay */}
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

									{/* Image number */}
									<div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
										#{index + 1}
									</div>

									{/* Drag Handle */}
									<div className="absolute top-2 right-2 bg-gray-800/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing">
										<MdDragIndicator className="w-4 h-4" />
									</div>
								</div>

								{/* Main Badge */}
								{index === 0 && (
									<div className="absolute -top-2 -left-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-md z-10 flex items-center gap-1">
										<FiImage className="w-3 h-3" />
										Ảnh chính
									</div>
								)}

								{/* Remove Button */}
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										handleRemove(index);
									}}
									className="absolute -top-2 -right-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-110 z-10"
								>
									<FiX className="w-4 h-4" />
								</button>
							</div>
						))}
					</div>

					{/* Tip */}
					{previews.length > 1 && (
						<div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
							<svg
								className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clipRule="evenodd"
								/>
							</svg>
							<p className="text-xs text-blue-700 leading-relaxed">
								💡 <span className="font-semibold">Mẹo:</span>{' '}
								Ảnh đầu tiên sẽ là ảnh đại diện. Kéo thả ảnh để
								thay đổi thứ tự.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default ImageUpload;
