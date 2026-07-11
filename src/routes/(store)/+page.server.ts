import type { PageServerLoad } from './$types';
import { getProducts, getCategories } from '$lib/utils/supabase-queries';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const [products, categories] = await Promise.all([
		getProducts(supabase, { limit: 8 }),
		getCategories(supabase)
	]);

	return { products, categories };
};
