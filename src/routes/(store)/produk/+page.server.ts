import type { PageServerLoad } from './$types';
import { getProducts, getCategories } from '$lib/utils/supabase-queries';

export const load: PageServerLoad = async ({ locals: { supabase }, url }) => {
	const category = url.searchParams.get('kategori') ?? undefined;
	const page = parseInt(url.searchParams.get('page') ?? '1', 10);
	const limit = 24;
	const offset = (page - 1) * limit;

	const [products, categories] = await Promise.all([
		getProducts(supabase, { categorySlug: category, limit, offset }),
		getCategories(supabase)
	]);

	return { products, categories, currentCategory: category, page };
};
