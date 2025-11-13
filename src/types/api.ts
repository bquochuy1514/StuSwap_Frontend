import { AxiosRequestConfig } from 'axios';
import { JwtPayload } from 'jwt-decode';

// Kiểu mở rộng cho JWT Payload
export interface DecodedToken extends JwtPayload {
	exp: number; // thời gian hết hạn (epoch)
	iat?: number; // thời gian issued at
	id?: string; // user id (nếu backend có)
	email?: string;
	role?: string;
}

// Cặp token đang được lưu trữ
export interface StoredTokens {
	accessToken: string | null;
	refreshToken: string | null;
}

export interface FailedRequest {
	response: {
		config: AxiosRequestConfig;
		status: number;
		data?: unknown;
	};
}
