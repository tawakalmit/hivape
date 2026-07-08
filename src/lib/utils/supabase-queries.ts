import type { SupabaseClient } from '@supabase/supabase-js';
import type { ProductWithRelations, ProductCard, Category } from '$lib/types';

// Use a generic SupabaseClient without strict Database typing to avoid 'never' issues
// when the Database type doesn't exactly match Supabase's generated types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabase = SupabaseClient<any>;

export async function getProducts(
	supabase: AnySupabase,
	opts: {
		categorySlug?: string;
		status?: string;
		limit?: number;
		offset?: number;
	} = {}
): Promise<ProductCard[]> {
	let query = supabase
		.from('products')
		.select(
			`id, name, slug, status,
			categories!inner(name, slug),
			variants(price),
			product_images(url, is_primary, sort_order)`
		)
		.eq('status', opts.status ?? 'active')
		.order('created_at', { ascending: false });

	if (opts.categorySlug) {
		query = query.eq('categories.slug', opts.categorySlug);
	}
	if (opts.limit) {
		const from = opts.offset ?? 0;
		query = query.range(from, from + opts.limit - 1);
	}

	const { data, error } = await query;
	if (error) throw error;

	return (data ?? []).map((p: any) => {
		const prices: number[] = p.variants?.map((v: any) => Number(v.price)) ?? [];
		const sorted = (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
		const primaryImage = sorted.find((img: any) => img.is_primary) ?? sorted[0];

		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			category: p.categories?.name ?? '',
			price_min: prices.length ? Math.min(...prices) : 0,
			price_max: prices.length ? Math.max(...prices) : 0,
			image_url: primaryImage?.url ?? null,
			status: p.status,
			variants_count: p.variants?.length ?? 0
		} satisfies ProductCard;
	});
}

export async function getProductBySlug(
	supabase: AnySupabase,
	slug: string
): Promise<ProductWithRelations | null> {
	const { data, error } = await supabase
		.from('products')
		.select('*, categories(*), variants(*), product_images(*)')
		.eq('slug', slug)
		.single();

	if (error) return null;
	return data as unknown as ProductWithRelations;
}

export async function getCategories(supabase: AnySupabase): Promise<Category[]> {
	const { data, error } = await supabase
		.from('categories')
		.select('*')
		.order('name', { ascending: true });
	if (error) throw error;
	return (data ?? []) as Category[];
}

export async function getAllProducts(supabase: AnySupabase): Promise<any[]> {
	const { data, error } = await supabase
		.from('products')
		.select(
			`id, name, slug, status, updated_at,
			categories(name),
			variants(price, stock),
			product_images(url, is_primary)`
		)
		.order('created_at', { ascending: false });
	if (error) throw error;
	return data ?? [];
}
