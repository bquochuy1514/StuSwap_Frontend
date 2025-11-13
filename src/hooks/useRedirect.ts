// src/hooks/useRedirect.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRedirect() {
	const router = useRouter();
	const [isRedirecting, setIsRedirecting] = useState(false);

	const redirectTo = (path: string, delay = 2000) => {
		setIsRedirecting(true);
		setTimeout(() => {
			router.push(path);
		}, delay);
	};

	return { isRedirecting, redirectTo };
}
