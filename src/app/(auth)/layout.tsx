// src/app/(auth)/layout.tsx

import GuestRoute from '@/components/guards/GuestRoute';

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <GuestRoute>{children}</GuestRoute>;
}
