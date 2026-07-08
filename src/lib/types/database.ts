export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			categories: {
				Row: Category;
				Insert: Omit<Category, 'id' | 'created_at'>;
				Update: Partial<Omit<Category, 'id' | 'created_at'>>;
			};
			products: {
				Row: Product;
				Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
				Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
			};
			variants: {
				Row: Variant;
				Insert: Omit<Variant, 'id' | 'created_at'>;
				Update: Partial<Omit<Variant, 'id' | 'created_at'>>;
			};
			product_images: {
				Row: ProductImage;
				Insert: Omit<ProductImage, 'id' | 'created_at'>;
				Update: Partial<Omit<ProductImage, 'id' | 'created_at'>>;
			};
		};
	};
}

export interface Category {
	id: string;
	name: string;
	slug: string;
	cover_image_url: string | null;
	created_at: string;
}

export interface Product {
	id: string;
	name: string;
	slug: string;
	category_id: string;
	description_short: string | null;
	description_long: string | null;
	status: 'active' | 'draft' | 'out_of_stock';
	created_at: string;
	updated_at: string;
}

export interface Variant {
	id: string;
	product_id: string;
	flavor: string | null;
	nicotine_mg: number | null;
	price: number;
	stock: number;
	created_at: string;
}

export interface ProductImage {
	id: string;
	product_id: string;
	url: string;
	is_primary: boolean;
	sort_order: number;
	created_at: string;
}

// Extended types with relations
export interface ProductWithRelations extends Product {
	categories: Category;
	variants: Variant[];
	product_images: ProductImage[];
}

export interface ProductCard {
	id: string;
	name: string;
	slug: string;
	category: string;
	price_min: number;
	price_max: number;
	image_url: string | null;
	status: Product['status'];
	variants_count: number;
}
