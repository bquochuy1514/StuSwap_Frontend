import {
	ApiError,
	ForgotPasswordRequest,
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
	ResendCodeRequest,
	ResendCodeResponse,
	ResendOtpRequest,
	ResetPasswordRequest,
	VerifyAccountRequest,
	VerifyAccountResponse,
	VerifyOtpRequest,
} from '@/types/auth';
import api from './axiosInstance';
import { AxiosError } from 'axios';

export const loginUser = async (
	userData: LoginRequest
): Promise<LoginResponse> => {
	try {
		const response = await api.post('/api/auth/login', userData);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response.data as ApiError;
		}
		throw error;
	}
};

export const registerUser = async (
	userData: RegisterRequest
): Promise<RegisterResponse> => {
	try {
		const response = await api.post('/api/auth/register', userData);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const logoutUser = async (token: string) => {
	try {
		const response = await api.post(
			'/api/auth/logout',
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response.data as ApiError;
		}
		throw error;
	}
};

export const verifyAccount = async (
	userData: VerifyAccountRequest
): Promise<VerifyAccountResponse> => {
	try {
		const response = await api.post('api/auth/verify-account', userData);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const resendCode = async (
	data: ResendCodeRequest
): Promise<ResendCodeResponse> => {
	try {
		const response = await api.post('api/auth/resend-code', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
	try {
		const response = await api.post('api/auth/forgot-password', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const verifyOTP = async (data: VerifyOtpRequest) => {
	try {
		const response = await api.post('api/auth/verify-otp', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const resendOTP = async (data: ResendOtpRequest) => {
	try {
		const response = await api.post('api/auth/resend-otp', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};

export const resetPassword = async (data: ResetPasswordRequest) => {
	try {
		const response = await api.post('api/auth/reset-password', data);
		return response.data;
	} catch (error) {
		if (error instanceof AxiosError && error.response?.data) {
			throw error.response?.data || error;
		}
		throw error;
	}
};
