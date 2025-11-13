import HomeButton from '@/components/ui/HomeButton';
import Logo from '@/components/ui/Logo';
import AuthHeader from '../AuthHeader';
import Divider from '@/components/ui/Divider';
import SocialLogin from '../SocialLogin';
import AuthRedirect from '../AuthRedirect';
import LoginForm from './LoginForm';

export default function LoginPage() {
	return (
		<div className="w-full max-w-md mx-auto py-2">
			<HomeButton />

			<div className="block lg:hidden mb-8">
				<Logo width={180} height={180} canClick={false} theme="dark" />
			</div>

			{/* Header */}
			<AuthHeader
				title="Đăng nhập StudentSwap"
				content1="Kết nối lại với cộng đồng sinh viên"
				content2="Trao đổi, chia sẻ và tìm những món đồ phù hợp cho bạn"
				theme="light"
			/>

			{/* Login Form */}
			<LoginForm />

			{/* Divider */}
			<Divider text="Hoặc đăng nhập với" />

			{/* Social Login */}
			<SocialLogin />

			{/* Login Link */}
			<AuthRedirect
				text="Bạn mới biết đến StuSwap?"
				linkText="Đăng ký ngay"
				href="/register"
			/>
		</div>
	);
}
