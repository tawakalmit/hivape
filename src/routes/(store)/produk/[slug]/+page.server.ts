import type { PageServerLoad } from './$types';
import { getProductBySlug, getProducts } from '$lib/utils/supabase-queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const product = await getProductBySlug(supabase, params.slug);

	if (!product) {
		throw error(404, 'Produk tidak ditemukan');
	}

	// Related products from same category
	const related = await getProducts(supabase, { limit: 4 });

	return { product, related: related.filter((p) => p.id !== product.id).slice(0, 4) };
};
