/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ApiError, FieldError } from '@/types/auth';
import { toast } from '@/components/ui/Toast';

/**
 * Gộp classnames Tailwind một cách an toàn.
 * - clsx() xử lý điều kiện, mảng, v.v.
 * - twMerge() loại bỏ xung đột giữa class Tailwind (vd: 'p-2 p-4' -> 'p-4')
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(...inputs));
}

/**
 * Xử lý lỗi từ API và trả về object lỗi cho form
 * @param error - Lỗi từ API
 * @param onSpecialCase - Callback xử lý trường hợp đặc biệt (optional)
 * @returns Object lỗi để set vào state hoặc undefined
 */
export const handleApiError = <T extends Record<string, string[]>>(
	error: unknown,
	onSpecialCase?: (message: string) => boolean
): T | undefined => {
	// ✅ Xử lý cả AxiosError và response.data
	let apiError: ApiError | undefined;

	// Kiểm tra xem có phải AxiosError không
	if (error && typeof error === 'object' && 'response' in error) {
		const axiosError = error as any;
		apiError = axiosError.response?.data;
	} else if (error && typeof error === 'object' && 'message' in error) {
		// Trường hợp đã là ApiError object
		apiError = error as ApiError;
	}

	// Nếu không có message, hiển thị lỗi mặc định
	if (!apiError?.message) {
		console.error('Unknown error format:', error);
		toast.error('Đã có lỗi xảy ra');
		return undefined;
	}

	// Case 1: Lỗi dạng array (field errors)
	if (Array.isArray(apiError.message)) {
		const errorObj = {} as T;
		apiError.message.forEach((item: FieldError) => {
			const field = item.field as keyof T;
			errorObj[field] = item.messages as T[keyof T];
		});
		console.log('Lỗi validation từ API:', errorObj);
		return errorObj;
	}

	// Case 2: Lỗi dạng string (general error)
	const errorMessage = apiError.message as string;

	// Kiểm tra special case
	if (onSpecialCase && onSpecialCase(errorMessage)) {
		return undefined;
	}

	// Hiển thị toast cho general error
	console.log('Lỗi từ API:', {
		message: errorMessage,
		statusCode: apiError.statusCode,
		error: apiError.error,
	});
	toast.error(errorMessage);
	return undefined;
};
