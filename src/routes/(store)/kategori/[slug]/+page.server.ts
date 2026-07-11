import type { PageServerLoad } from './$types';
import { getProducts, getCategories } from '$lib/utils/supabase-queries';
import { error } from '@sveltejs/kit';
import type { Category } from '$lib/types';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const categories = await getCategories(supabase) as Category[];
	const category = categories.find((c) => c.slug === params.slug);

	if (!category) {
		throw error(404, 'Kategori tidak ditemukan');
	}

	const products = await getProducts(supabase, { categorySlug: params.slug });

	return { category, categories, products };
};
