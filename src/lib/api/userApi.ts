import api from './axiosInstance';

export const fetchUserProfile = async (token: string) => {
	const response = await api.get('/api/users/profile', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
