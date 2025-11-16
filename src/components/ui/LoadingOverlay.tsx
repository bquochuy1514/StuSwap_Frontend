import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
	isVisible: boolean;
	message?: string;
}

export default function LoadingOverlay({
	isVisible,
	message = 'Đang xử lý...',
}: LoadingOverlayProps) {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
				>
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						className="bg-white rounded-2xl p-8 shadow-2xl"
					>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{
								duration: 1,
								repeat: Infinity,
								ease: 'linear',
							}}
							className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"
						/>
						<p className="text-gray-700 font-semibold text-center">
							{message}
						</p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
