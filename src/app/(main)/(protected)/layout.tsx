// src/app/(main)/(protected)/layout.jsx
'use client';

import ProtectedRoute from '@/components/guards/ProtectedRoute';

export default function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-linear-to-br from-gray-50 via-emerald-50/30 to-teal-50/40 relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
					<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/8 rounded-full blur-3xl"></div>
					<div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-400/6 rounded-full blur-3xl"></div>
				</div>

				{children}
			</div>
		</ProtectedRoute>
	);
}
