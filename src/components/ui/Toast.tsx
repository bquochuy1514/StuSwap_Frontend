'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
	FiCheckCircle,
	FiXCircle,
	FiAlertCircle,
	FiInfo,
	FiX,
} from 'react-icons/fi';

// Toast types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
}

// TOAST MANAGER - Có thể gọi từ bất cứ đâu
class ToastManager {
	private listeners: Array<(toasts: Toast[]) => void> = [];
	private toasts: Toast[] = [];

	subscribe(listener: (toasts: Toast[]) => void) {
		this.listeners.push(listener);
		return () => {
			this.listeners = this.listeners.filter((l) => l !== listener);
		};
	}

	private notify() {
		this.listeners.forEach((listener) => listener(this.toasts));
	}

	show(type: ToastType, message: string, duration: number = 3000) {
		const id = Math.random().toString(36).substring(2, 9);
		const newToast: Toast = { id, type, message, duration };

		this.toasts = [...this.toasts, newToast];
		this.notify();

		if (duration > 0) {
			setTimeout(() => {
				this.remove(id);
			}, duration);
		}
	}

	remove(id: string) {
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
		this.notify();
	}

	success(message: string, duration?: number) {
		this.show('success', message, duration);
	}

	error(message: string, duration?: number) {
		this.show('error', message, duration);
	}

	warning(message: string, duration?: number) {
		this.show('warning', message, duration);
	}

	info(message: string, duration?: number) {
		this.show('info', message, duration);
	}
}

// Export singleton instance - Dùng được ở mọi nơi
export const toast = new ToastManager();

// Toast configuration
const TOAST_CONFIG = {
	success: {
		icon: FiCheckCircle,
		bgColor: 'bg-green-500',
		textColor: 'text-white',
		iconColor: 'text-white',
	},
	error: {
		icon: FiXCircle,
		bgColor: 'bg-red-500',
		textColor: 'text-white',
		iconColor: 'text-white',
	},
	warning: {
		icon: FiAlertCircle,
		bgColor: 'bg-yellow-500',
		textColor: 'text-white',
		iconColor: 'text-white',
	},
	info: {
		icon: FiInfo,
		bgColor: 'bg-blue-500',
		textColor: 'text-white',
		iconColor: 'text-white',
	},
};

// Toast Item Component
function ToastItem({
	toast: toastItem,
	onClose,
}: {
	toast: Toast;
	onClose: () => void;
}) {
	const config = TOAST_CONFIG[toastItem.type];
	const Icon = config.icon;

	return (
		<motion.div
			initial={{ opacity: 0, y: 50, scale: 0.3 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
			className={`${config.bgColor} ${config.textColor} rounded-lg shadow-2xl px-4 py-3 flex items-center gap-3 min-w-[320px] max-w-md`}
		>
			<Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
			<p className="flex-1 text-sm font-medium">{toastItem.message}</p>
			<button
				onClick={onClose}
				className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
			>
				<FiX className="w-4 h-4" />
			</button>
		</motion.div>
	);
}

// Toast Container - Component đơn giản subscribe vào ToastManager
export function ToastContainer() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	useEffect(() => {
		const unsubscribe = toast.subscribe(setToasts);
		return unsubscribe;
	}, []);

	return (
		<div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none">
			<div className="flex flex-col gap-2 items-center pointer-events-auto">
				<AnimatePresence mode="popLayout">
					{toasts.map((t) => (
						<ToastItem
							key={t.id}
							toast={t}
							onClose={() => toast.remove(t.id)}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
}
