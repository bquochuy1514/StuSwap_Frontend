import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify'; // hoặc thư viện toast bạn đang dùng
import { ApiError, FieldError } from '@/types/auth';

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
	onSpecialCase?: (message: string) => boolean // return true nếu đã xử lý
): T | undefined => {
	const apiError = error as ApiError;

	if (!apiError.message) {
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
		console.log('Lỗi từ handleApiError: ', errorObj);
		return errorObj;
	}

	// Case 2: Lỗi dạng string (general error)
	// Kiểm tra special case trước
	if (onSpecialCase && onSpecialCase(apiError.message)) {
		return undefined; // Special case đã được xử lý
	}

	// Hiển thị toast cho general error
	toast.error(apiError.message);
	return undefined;
};
