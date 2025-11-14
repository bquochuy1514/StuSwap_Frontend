'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import RedirectLoading from '../shared/PageTransition';

export default function ProtectedRoute({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, loading, isLoggingOut } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Chỉ redirect khi đã load xong và không có user (trừ khi đang logout)
		if (!loading && !user && !isLoggingOut) {
			router.push('/login');
		}
	}, [user, loading, router, isLoggingOut]);

	// Hiển thị loading khi đang check auth hoặc chưa có user
	if (loading || !user) {
		return <RedirectLoading message="Vui lòng đăng nhập để tiếp tục..." />;
	}

	return <>{children}</>;
}
