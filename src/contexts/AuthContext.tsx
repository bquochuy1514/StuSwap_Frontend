'use client';

import {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/lib/api/axiosInstance';
import { fetchUserProfile } from '@/lib/api/userApi';
import { loginUser, logoutUser } from '@/lib/api/authApi';
import { AuthContextType } from '@/types/context';
import { User, LoginRequest, LoginResponse } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const router = useRouter();
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [refreshToken, setRefreshToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [justLoggedIn, setJustLoggedIn] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// ==========================
	//  Helper Functions
	// ==========================
	const setAuthHeader = (token: string | null) => {
		if (token)
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
		else delete api.defaults.headers.common['Authorization'];
	};

	const saveTokens = (
		access: string,
		refresh: string,
		remember: boolean = false
	) => {
		const storage = remember ? localStorage : sessionStorage;
		if (access) storage.setItem('access_token', access);
		if (refresh) storage.setItem('refresh_token', refresh);
	};

	const clearTokens = () => {
		localStorage.clear();
		sessionStorage.clear();
		delete api.defaults.headers.common['Authorization'];
	};

	const getTokensFromStorage = (): {
		access: string | null;
		refresh: string | null;
	} => {
		const access =
			localStorage.getItem('access_token') ||
			sessionStorage.getItem('access_token');
		const refresh =
			localStorage.getItem('refresh_token') ||
			sessionStorage.getItem('refresh_token');

		return { access, refresh };
	};

	// ==========================
	//  Init Authentication
	// ==========================
	useEffect(() => {
		const initAuth = async () => {
			try {
				const params = new URLSearchParams(window.location.search);
				const accessFromUrl = params.get('access_token');
				const refreshFromUrl = params.get('refresh_token');

				if (accessFromUrl && refreshFromUrl) {
					localStorage.setItem('access_token', accessFromUrl);
					localStorage.setItem('refresh_token', refreshFromUrl);
					setAccessToken(accessFromUrl);
					setRefreshToken(refreshFromUrl);
					setAuthHeader(accessFromUrl);

					try {
						const userData = await fetchUserProfile(accessFromUrl);
						setUser(userData);
						setJustLoggedIn(true);
						setTimeout(() => setJustLoggedIn(false), 2000);
					} catch (err) {
						console.error('Lỗi fetch user sau Google login:', err);
						clearTokens();
					}

					const cleanUrl =
						window.location.origin + window.location.pathname;
					window.history.replaceState({}, document.title, cleanUrl);

					setLoading(false);
					return;
				}

				const { access, refresh } = getTokensFromStorage();
				if (access) {
					setAccessToken(access);
					setRefreshToken(refresh);
					setAuthHeader(access);

					try {
						const userData = await fetchUserProfile(access);
						setUser(userData);
					} catch (err) {
						console.warn(
							'Access token hết hạn hoặc không hợp lệ:',
							err
						);
						clearTokens();
						setAccessToken(null);
						setRefreshToken(null);
						setUser(null);
					}
				} else {
					clearTokens();
				}
			} catch (error) {
				console.error('Lỗi initAuth:', error);
				clearTokens();
			} finally {
				setLoading(false);
			}
		};

		initAuth();
	}, []);

	// ==========================
	//  Login
	// ==========================
	const login = async (
		credentials: LoginRequest,
		rememberMe: boolean = false
	): Promise<LoginResponse> => {
		const result = await loginUser(credentials);
		const { access_token, refresh_token } = result;

		saveTokens(access_token, refresh_token, rememberMe);
		setAccessToken(access_token);
		setRefreshToken(refresh_token);
		setAuthHeader(access_token);

		const userData = await fetchUserProfile(access_token);
		setUser(userData);
		setJustLoggedIn(true);
		setTimeout(() => setJustLoggedIn(false), 2000);

		router.push('/');
		return result;
	};

	// ==========================
	//  Logout
	// ==========================
	const logout = async (): Promise<void> => {
		try {
			setIsLoggingOut(true);
			if (accessToken) {
				const res = await logoutUser(accessToken);
				toast.success(res.message);
			}
		} catch (err) {
			console.warn('Lỗi khi logout:', err);
		} finally {
			setUser(null);
			setAccessToken(null);
			setRefreshToken(null);
			clearTokens();
			router.push('/');
			setTimeout(() => setIsLoggingOut(false), 2000);
		}
	};

	// ==========================
	//  Context Value
	// ==========================
	const value: AuthContextType = {
		user,
		setUser,
		accessToken,
		setAccessToken,
		refreshToken,
		setRefreshToken,
		login,
		logout,
		loading,
		justLoggedIn,
		isLoggingOut,
	};

	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error('useAuth must be used within an AuthProvider');
	return context;
};
