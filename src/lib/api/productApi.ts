import { AxiosError } from 'axios';
import api from './axiosInstance';

export const createProduct = async (formData: FormData) => {
	try {
		const response = await api.post(`api/products`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};
