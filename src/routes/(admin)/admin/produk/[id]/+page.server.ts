import type { PageServerLoad, Actions } from './$types';
import { getCategories } from '$lib/utils/supabase-queries';
import { error, fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils/format';

export const load: PageServerLoad = async ({ locals: { supabase }, params }) => {
	const [categories, productResult] = await Promise.all([
		getCategories(supabase),
		supabase
			.from('products')
			.select('*, categories(*), variants(*), product_images(*)')
			.eq('id', params.id)
			.single()
	]);

	if (productResult.error || !productResult.data) {
		throw error(404, 'Produk tidak ditemukan');
	}

	return { categories, product: productResult.data as any };
};

export const actions: Actions = {
	default: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const slug = (formData.get('slug') as string) || slugify(name);
		const categoryId = formData.get('category_id') as string;
		const descriptionShort = formData.get('description_short') as string;
		const descriptionLong = formData.get('description_long') as string;
		const status = formData.get('status') as 'active' | 'draft' | 'out_of_stock';
		const variantCount = parseInt(formData.get('variant_count') as string, 10) || 0;

		if (!name || !categoryId) {
			return fail(400, { error: 'Nama dan kategori wajib diisi.' });
		}

		const { error: productError } = await supabase
			.from('products')
			.update({ name, slug, category_id: categoryId, description_short: descriptionShort || null, description_long: descriptionLong || null, status, updated_at: new Date().toISOString() })
			.eq('id', params.id);

		if (productError) return fail(500, { error: productError.message });

		// Delete existing variants and re-insert
		await supabase.from('variants').delete().eq('product_id', params.id);

		const variantRows = [];
		for (let i = 0; i < variantCount; i++) {
			const price = parseFloat(formData.get(`variant_price_${i}`) as string);
			if (!price) continue;
			variantRows.push({
				product_id: params.id,
				flavor: (formData.get(`variant_flavor_${i}`) as string) || null,
				nicotine_mg: parseInt(formData.get(`variant_nicotine_${i}`) as string, 10) || null,
				price,
				stock: parseInt(formData.get(`variant_stock_${i}`) as string, 10) || 0
			});
		}

		if (variantRows.length > 0) {
			const { error: variantError } = await supabase.from('variants').insert(variantRows);
			if (variantError) return fail(500, { error: variantError.message });
		}

		throw redirect(303, '/admin/produk');
	}
};
