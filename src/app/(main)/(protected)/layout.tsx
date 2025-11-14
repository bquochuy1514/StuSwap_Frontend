// src/app/(main)/(protected)/layout.jsx
'use client';

import ProtectedRoute from '@/components/guards/ProtectedRoute';

export default function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <ProtectedRoute>{children}</ProtectedRoute>;
}
