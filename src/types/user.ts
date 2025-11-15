import { AddressData } from './auth';

export type UpdateUserProfilePayload = {
	fullName?: string;
	phone?: string | null;
	bio?: string;
	university?: string;
	address?: AddressData;
};

export type ChangeUserPasswordPayload = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};
