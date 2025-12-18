import { AddressData } from '@/types/auth';
import { Category } from './category';

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

export type Product = {
	id: string;
	title: string;
	description: string;
	price: string;
	condition: string;
	image_urls: string;
	is_sold: boolean;
	is_premium: boolean;
	priority_level: number;
	status: 'pending' | 'approved' | 'rejected';
	reject_reason: string | null;
	is_expired: boolean;
	expire_at: string;
	promotion_type: string;
	promotion_expire_at: Date | null;
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
	category: Category;
	address: AddressData;
};
