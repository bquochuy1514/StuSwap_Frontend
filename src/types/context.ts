import { User, LoginRequest, LoginResponse } from './auth';

export interface AuthContextType {
	user: User | null;
	setUser: (user: User | null) => void;

	accessToken: string | null;
	setAccessToken: (token: string | null) => void;

	refreshToken: string | null;
	setRefreshToken: (token: string | null) => void;

	login: (
		credentials: LoginRequest,
		rememberMe?: boolean
	) => Promise<LoginResponse>;

	logout: () => Promise<void>;

	loading: boolean;
	justLoggedIn: boolean;
	isLoggingOut: boolean;
}
