import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalButton {
	label: string;
	onClick: () => void;
	className?: string;
	variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
}

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string | ReactNode;
	icon?: ReactNode;
	iconBgColor?: string;
	iconColor?: string;
	buttons?: ModalButton[];
	// Preset variants for common use cases
	variant?: 'confirm' | 'delete' | 'warning' | 'info' | 'success' | 'custom';
	// Custom content area (optional)
	children?: ReactNode;
	// Additional options
	closeOnBackdropClick?: boolean;
	showCloseButton?: boolean;
	maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const VARIANT_CONFIGS: Record<
	string,
	{
		iconBgColor: string;
		iconColor: string;
		defaultButtons: Partial<ModalButton>[];
	}
> = {
	confirm: {
		iconBgColor: 'bg-blue-100',
		iconColor: 'text-blue-600',
		defaultButtons: [
			{ label: 'Hủy', variant: 'secondary' as const, onClick: () => {} },
			{
				label: 'Xác nhận',
				variant: 'primary' as const,
				onClick: () => {},
			},
		],
	},
	delete: {
		iconBgColor: 'bg-red-100',
		iconColor: 'text-red-600',
		defaultButtons: [
			{ label: 'Hủy', variant: 'secondary' as const, onClick: () => {} },
			{ label: 'Xóa', variant: 'danger' as const, onClick: () => {} },
		],
	},
	warning: {
		iconBgColor: 'bg-yellow-100',
		iconColor: 'text-yellow-600',
		defaultButtons: [
			{ label: 'Hủy', variant: 'secondary' as const, onClick: () => {} },
			{
				label: 'Tiếp tục',
				variant: 'warning' as const,
				onClick: () => {},
			},
		],
	},
	info: {
		iconBgColor: 'bg-blue-100',
		iconColor: 'text-blue-600',
		defaultButtons: [
			{
				label: 'Đã hiểu',
				variant: 'primary' as const,
				onClick: () => {},
			},
		],
	},
	success: {
		iconBgColor: 'bg-green-100',
		iconColor: 'text-green-600',
		defaultButtons: [
			{ label: 'Đóng', variant: 'success' as const, onClick: () => {} },
		],
	},
	custom: {
		iconBgColor: 'bg-gray-100',
		iconColor: 'text-gray-600',
		defaultButtons: [],
	},
};

const BUTTON_VARIANTS = {
	primary: 'bg-blue-500 text-white hover:bg-blue-600',
	secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
	danger: 'bg-red-500 text-white hover:bg-red-600',
	success: 'bg-green-500 text-white hover:bg-green-600',
	warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
};

const MAX_WIDTH_CLASSES = {
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
};

export default function ConfirmationModal({
	isOpen,
	onClose,
	title,
	description,
	icon,
	iconBgColor,
	iconColor,
	buttons,
	variant = 'confirm',
	children,
	closeOnBackdropClick = true,
	showCloseButton = false,
	maxWidth = 'md',
}: ConfirmationModalProps) {
	const variantConfig = VARIANT_CONFIGS[variant];
	const finalIconBgColor = iconBgColor || variantConfig.iconBgColor;
	const finalIconColor = iconColor || variantConfig.iconColor;

	// Merge default buttons with custom buttons
	// For preset variants, merge with onClose handler if not provided
	const finalButtons: ModalButton[] =
		buttons ||
		variantConfig.defaultButtons.map(
			(btn) =>
				({
					...btn,
					onClick: btn.onClick || onClose,
				} as ModalButton)
		);

	const handleBackdropClick = () => {
		if (closeOnBackdropClick) {
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={handleBackdropClick}
				>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
						className={`bg-white rounded-2xl shadow-2xl ${MAX_WIDTH_CLASSES[maxWidth]} w-full p-6 relative`}
					>
						{/* Close button */}
						{showCloseButton && (
							<button
								onClick={onClose}
								className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						)}

						<div className="text-center mb-6">
							{/* Icon */}
							{icon && (
								<div
									className={`w-16 h-16 ${finalIconBgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
								>
									<div
										className={`text-3xl ${finalIconColor}`}
									>
										{icon}
									</div>
								</div>
							)}

							{/* Title */}
							<h3 className="text-xl font-bold text-gray-800 mb-2">
								{title}
							</h3>

							{/* Description */}
							<div className="text-gray-600">{description}</div>
						</div>

						{/* Custom content area */}
						{children && <div className="mb-6">{children}</div>}

						{/* Buttons */}
						{finalButtons.length > 0 && (
							<div
								className={`flex gap-3 ${
									finalButtons.length === 1
										? 'justify-center'
										: ''
								}`}
							>
								{finalButtons.map((button, index) => {
									const buttonClasses =
										button.className ||
										BUTTON_VARIANTS[
											button.variant || 'secondary'
										];

									return (
										<button
											key={index}
											onClick={button.onClick}
											className={`flex-1 px-4 py-3 rounded-xl transition-colors cursor-pointer font-medium ${buttonClasses}`}
										>
											{button.label}
										</button>
									);
								})}
							</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

// Example usage variants
export const ModalExamples = () => {
	const [showConfirm, setShowConfirm] = React.useState(false);
	const [showDelete, setShowDelete] = React.useState(false);
	const [showWarning, setShowWarning] = React.useState(false);
	const [showInfo, setShowInfo] = React.useState(false);
	const [showCustom, setShowCustom] = React.useState(false);
	const [showForm, setShowForm] = React.useState(false);

	return (
		<div className="p-8 space-y-4">
			<h1 className="text-2xl font-bold mb-6">Modal Examples</h1>

			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				<button
					onClick={() => setShowConfirm(true)}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				>
					Confirm Modal
				</button>

				<button
					onClick={() => setShowDelete(true)}
					className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
				>
					Delete Modal
				</button>

				<button
					onClick={() => setShowWarning(true)}
					className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
				>
					Warning Modal
				</button>

				<button
					onClick={() => setShowInfo(true)}
					className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
				>
					Info Modal
				</button>

				<button
					onClick={() => setShowCustom(true)}
					className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
				>
					Custom Modal
				</button>

				<button
					onClick={() => setShowForm(true)}
					className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
				>
					Form Modal
				</button>
			</div>

			{/* Confirm Modal */}
			<ConfirmationModal
				isOpen={showConfirm}
				onClose={() => setShowConfirm(false)}
				variant="confirm"
				title="Xác nhận hành động"
				description="Bạn có chắc chắn muốn thực hiện hành động này?"
				icon="✓"
				buttons={[
					{
						label: 'Hủy',
						onClick: () => setShowConfirm(false),
						variant: 'secondary',
					},
					{
						label: 'Xác nhận',
						onClick: () => {
							alert('Confirmed!');
							setShowConfirm(false);
						},
						variant: 'primary',
					},
				]}
			/>

			{/* Delete Modal */}
			<ConfirmationModal
				isOpen={showDelete}
				onClose={() => setShowDelete(false)}
				variant="delete"
				title="Xóa sản phẩm"
				description={
					<>
						Bạn có chắc muốn xóa sản phẩm này?{' '}
						<span className="font-semibold text-red-600">
							Hành động này không thể hoàn tác!
						</span>
					</>
				}
				icon="🗑️"
				buttons={[
					{
						label: 'Hủy',
						onClick: () => setShowDelete(false),
						variant: 'secondary',
					},
					{
						label: 'Xóa',
						onClick: () => {
							alert('Deleted!');
							setShowDelete(false);
						},
						variant: 'danger',
					},
				]}
			/>

			{/* Warning Modal */}
			<ConfirmationModal
				isOpen={showWarning}
				onClose={() => setShowWarning(false)}
				variant="warning"
				title="Cảnh báo"
				description="Hành động này có thể ảnh hưởng đến dữ liệu của bạn. Bạn có muốn tiếp tục?"
				icon="⚠️"
				showCloseButton
			/>

			{/* Info Modal */}
			<ConfirmationModal
				isOpen={showInfo}
				onClose={() => setShowInfo(false)}
				variant="info"
				title="Thông tin"
				description="Đây là một thông báo quan trọng mà bạn cần biết."
				icon="ℹ️"
				maxWidth="lg"
			/>

			{/* Custom Modal with Multiple Buttons */}
			<ConfirmationModal
				isOpen={showCustom}
				onClose={() => setShowCustom(false)}
				variant="custom"
				title="Chọn hành động"
				description="Bạn muốn làm gì với sản phẩm này?"
				icon="🎯"
				buttons={[
					{
						label: 'Chỉnh sửa',
						onClick: () => {
							alert('Edit');
							setShowCustom(false);
						},
						className: 'bg-blue-500 text-white hover:bg-blue-600',
					},
					{
						label: 'Ẩn',
						onClick: () => {
							alert('Hide');
							setShowCustom(false);
						},
						className: 'bg-gray-500 text-white hover:bg-gray-600',
					},
					{
						label: 'Xóa',
						onClick: () => {
							alert('Delete');
							setShowCustom(false);
						},
						variant: 'danger',
					},
				]}
				closeOnBackdropClick={false}
				showCloseButton
			/>

			{/* Form Modal with Custom Content */}
			<ConfirmationModal
				isOpen={showForm}
				onClose={() => setShowForm(false)}
				variant="custom"
				title="Nhập lý do"
				description="Vui lòng cho biết lý do từ chối sản phẩm này:"
				icon="📝"
				maxWidth="lg"
				showCloseButton
			>
				<textarea
					className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					rows={4}
					placeholder="Nhập lý do..."
				/>
			</ConfirmationModal>
		</div>
	);
};
