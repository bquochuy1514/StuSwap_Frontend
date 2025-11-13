import { DecodedToken, FailedRequest } from '@/types/api';
import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { jwtDecode } from 'jwt-decode';

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

const refreshApi = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Hàm kiểm tra token có hết hạn không
const isTokenExpired = (token: string | null) => {
	if (!token) return true;
	try {
		const decoded = jwtDecode<DecodedToken>(token);
		// Kiểm tra trước 30 giây để có buffer time
		return decoded.exp * 1000 < Date.now() + 30000;
	} catch {
		return true;
	}
};

// Hàm lấy tokens từ storage (localStorage hoặc sessionStorage)
const getTokensFromStorage = () => {
	const accessToken =
		localStorage.getItem('access_token') ||
		sessionStorage.getItem('access_token');
	const refreshToken =
		localStorage.getItem('refresh_token') ||
		sessionStorage.getItem('refresh_token');

	return { accessToken, refreshToken };
};

// Hàm lưu tokens vào đúng storage (giữ nguyên nơi ban đầu)
const saveTokensToStorage = (accessToken: string, refreshToken: string) => {
	// Kiểm tra xem tokens đang lưu ở đâu
	const isInLocalStorage = localStorage.getItem('access_token') !== null;
	const storage = isInLocalStorage ? localStorage : sessionStorage;

	if (accessToken) storage.setItem('access_token', accessToken);
	if (refreshToken) storage.setItem('refresh_token', refreshToken);
};

// Hàm refresh token
const performRefresh = async () => {
	const { refreshToken } = getTokensFromStorage();

	if (!refreshToken) {
		throw new Error('No refresh token available');
	}

	const res = await refreshApi.post(
		'/api/auth/refresh-token',
		{},
		{
			headers: {
				Authorization: `Bearer ${refreshToken}`,
			},
		}
	);

	const { access_token, refresh_token } = res.data;

	// Lưu tokens vào đúng storage ban đầu
	saveTokensToStorage(access_token, refresh_token);

	return access_token;
};

//  REQUEST INTERCEPTOR - Tự động attach token nếu có
api.interceptors.request.use(
	async (config) => {
		// Lấy token từ storage
		const { accessToken } = getTokensFromStorage();

		// Nếu có token, kiểm tra và attach vào header
		if (accessToken) {
			// Nếu token hết hạn, thử refresh trước
			if (isTokenExpired(accessToken)) {
				try {
					const newAccessToken = await performRefresh();
					config.headers.Authorization = `Bearer ${newAccessToken}`;
				} catch (err) {
					// Nếu refresh fail, vẫn gửi request (để backend trả 401)
					console.error('Token refresh failed:', err);
				}
			} else {
				// Token còn hạn, dùng bình thường
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
		}

		// Nếu không có token, cứ gửi request bình thường
		// Backend sẽ quyết định endpoint nào cần auth, endpoint nào không
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// ✅ RESPONSE INTERCEPTOR - Xử lý khi gặp 401
const refreshAuthLogic = async (failedRequest: FailedRequest) => {
	const { refreshToken } = getTokensFromStorage();
	// ✅ Nếu không có refresh token (chưa đăng nhập, đang ở trang public)
	if (!refreshToken) {
		// Không cần refresh, cứ reject để component tự xử lý
		return Promise.reject(failedRequest);
	}
	try {
		const newAccessToken = await performRefresh();
		failedRequest.response.config.headers = {
			...failedRequest.response.config.headers,
			Authorization: `Bearer ${newAccessToken}`,
		};
		return Promise.resolve();
	} catch (err) {
		console.error('Refresh token failed:', err);

		// Clear tokens khi refresh fail
		localStorage.clear();
		sessionStorage.clear();

		// Không tự động redirect, để component xử lý
		throw err;
	}
};

createAuthRefreshInterceptor(api, refreshAuthLogic, {
	statusCodes: [401], // Chỉ retry khi gặp 401
	pauseInstanceWhileRefreshing: true,
});

export default api;
