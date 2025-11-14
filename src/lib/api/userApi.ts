import { AxiosError } from 'axios';
import api from './axiosInstance';
import { UpdateUserProfilePayload } from '@/types/user';

export const fetchUserProfile = async (token: string) => {
	const response = await api.get('/api/users/profile', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const updateUserProfile = async (formData: UpdateUserProfilePayload) => {
	try {
		const response = await api.put(`api/users/profile`, formData);

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};
