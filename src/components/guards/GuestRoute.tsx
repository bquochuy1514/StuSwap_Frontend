'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import RedirectLoading from '../shared/PageTransition';

export default function GuestRoute({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user, loading, justLoggedIn } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && user) {
			router.push('/');
		}
	}, [user, loading, router]);

	// Đang check auth ban đầu
	if (loading) {
		return <RedirectLoading message="Đang kiểm tra..." />;
	}

	// Nếu có user và KHÔNG phải vừa đăng nhập -> hiện message "đã đăng nhập"
	if (user) {
		if (!justLoggedIn) {
			return <RedirectLoading message="Bạn đã đăng nhập rồi..." />;
		}
		return <RedirectLoading message="Đăng nhập thành công!" />;
	}

	return children;
}
