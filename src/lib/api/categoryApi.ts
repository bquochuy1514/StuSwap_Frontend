import { AxiosError } from 'axios';
import api from './axiosInstance';

export const fetchCategories = async () => {
	try {
		const response = await api.get('/api/categories');
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			console.error('Lỗi khi fetch categories:', error);
			throw error.response?.data || error;
		}
		throw error;
	}
};
