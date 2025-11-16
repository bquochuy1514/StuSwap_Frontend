import { AddressData } from '@/types/auth';

export enum ProductCondition {
	NEW = 'new',
	LIKE_NEW = 'used_like_new',
	GOOD = 'used_good',
	FAIR = 'used_fair',
}

export type ProductFormData = {
	title: string;
	description: string;
	price: string;
	condition: ProductCondition;
	category_id: string;
	address: AddressData;
	images: File[];
};
