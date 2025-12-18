'use client';
import { FcGoogle } from 'react-icons/fc';
import { BsGithub } from 'react-icons/bs';
import { toast } from '@/components/ui/Toast';
import { useRedirect } from '@/hooks/useRedirect';
import RedirectLoading from '../shared/PageTransition';

export default function SocialLogin() {
	const { isRedirecting, redirectTo } = useRedirect();

	if (isRedirecting) {
		return <RedirectLoading message="Đang chuyển hướng..." />;
	}

	const handleGoogleLogin = () => {
		redirectTo(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/login`);
	};

	return (
		<div className="space-y-4 mb-8">
			{/* Google Button */}
			<button
				onClick={handleGoogleLogin}
				className="w-full group relative cursor-pointer overflow-hidden flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3.5 px-4 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-100 hover:-translate-y-0.5 active:translate-y-0"
			>
				{/* Background overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

				{/* Shining effect - luồng sáng chạy ngang */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/60 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
				</div>

				<FcGoogle className="text-2xl relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
				<span className="relative z-10">Đăng nhập với Google</span>
			</button>

			{/* GitHub Button */}
			<button
				onClick={() => {
					toast.info('Chức năng này chưa được phát triển');
				}}
				className="w-full group relative cursor-pointer overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 border border-gray-700 hover:border-gray-600 hover:shadow-2xl hover:shadow-gray-900/50 hover:-translate-y-0.5 active:translate-y-0"
			>
				{/* Background overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

				{/* Shining effect - luồng sáng chạy ngang */}
				<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
					<div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
				</div>

				<BsGithub className="text-xl relative z-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
				<span className="relative z-10">Đăng nhập với GitHub</span>
			</button>
		</div>
	);
}
