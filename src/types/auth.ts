import { ChangeEvent, ReactElement } from 'react';
import { AxiosRequestConfig } from 'axios';
import { JwtPayload } from 'jwt-decode';

export type AuthInputProps = {
	label: string;
	name: string;
	value: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type?: string;
	icon?: ReactElement<{ className?: string }>;
	disabled?: boolean;
	error?: string;
	theme?: 'light' | 'dark';
	showPasswordToggle?: boolean;
	showPassword?: boolean;
	onTogglePassword?: () => void;
};

export type FieldError = {
	field: string;
	messages: string[];
};

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

// ------------------ Register & login types --------------------

export type LoginError = {
	email?: string[];
	password?: string[];
};

export type RegisterError = {
	email?: string[];
	password?: string[];
	confirmPassword?: string[];
	fullName?: string[];
};

export type LoginRequest = {
	email: string;
	password: string;
};

export type RegisterRequest = {
	email: string;
	password: string;
	confirmPassword: string;
	fullName: string;
};

export type LogoutResponse = {
	message: string;
};

export type LoginResponse = {
	access_token: string;
	refresh_token: string;
	user: {
		id: number;
		fullName: string;
		email: string;
		role: string;
		phone: string;
		avatar: string;
		bio: string;
		university: string;
		isActive: boolean;
		createdAt: Date;
		updatedAt: Date;
		address: object;
	};
};

export type RegisterResponse = {
	message: string;
	user: {
		id: number;
		email: string;
	};
};

export type ApiError = {
	statusCode?: number;
	message: string | Array<{ field: string; messages: string[] }>;
	error?: string;
};

export type AddressData = {
	specificAddress: string | null;
	ward: string | null;
	district: string | null;
	province: string | null;
};

export type User = {
	id: string;
	email: string;
	fullName: string;
	phone: string | null;
	avatar: string;
	address: AddressData;
	role: string;
	bio: string | null;
	university: string | null;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
};

// -------------------- Verify account & Resend code types --------------------
export type VerifyAccountRequest = {
	email: string;
	codeId: string;
};

export type VerifyAccountResponse = {
	message: string;
};

export type ResendCodeResponse = {
	message: string;
};

export type ResendCodeRequest = {
	email: string;
};

export type VerifyAccountErrors = {
	codeId?: string | undefined;
};

// -------------------- Forgot Password & Verify OTP & Resend OTP Code types --------------------
export type ForgotPasswordRequest = {
	email: string;
};

export type ForgotPasswordError = {
	email?: string[];
};

export type VerifyOtpRequest = {
	email: string;
	otpCode: string;
};

export type ResendOtpRequest = {
	email: string;
};

export type VerifyOtpError = {
	email?: string[];
	otpCode?: string[];
};

// -------------------- Reset Password types --------------------
export type ResetPasswordRequest = {
	email: string;
	password: string;
	confirmPassword: string;
};

export type ResetPasswordError = {
	email?: string[];
	password?: string[];
	confirmPassword?: string[];
};
