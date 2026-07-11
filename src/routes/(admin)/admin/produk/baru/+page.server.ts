import type { PageServerLoad, Actions } from './$types';
import { getCategories } from '$lib/utils/supabase-queries';
import { fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils/format';

const BUCKET = 'product-images';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const categories = await getCategories(supabase);
	return { categories };
};

export const actions: Actions = {
	simpan: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = ((formData.get('slug') as string)?.trim()) || slugify(name);
		const categoryId = (formData.get('category_id') as string)?.trim();
		const descriptionShort = (formData.get('description_short') as string)?.trim();
		const descriptionLong = (formData.get('description_long') as string)?.trim();
		const status = ((formData.get('status') as string)?.trim() || 'draft') as 'active' | 'draft' | 'out_of_stock';
		const variantCount = parseInt(formData.get('variant_count') as string, 10) || 0;

		if (!name) return fail(400, { error: 'Nama produk wajib diisi.' });
		if (!categoryId) return fail(400, { error: 'Kategori wajib dipilih.' });

		// 1. Insert product
		const { data: product, error: productError } = await supabase
			.from('products')
			.insert({ name, slug, category_id: categoryId, description_short: descriptionShort || null, description_long: descriptionLong || null, status })
			.select()
			.single();

		if (productError) return fail(500, { error: `Gagal simpan produk: ${productError.message}` });

		// 2. Insert variants
		const variantRows = [];
		for (let i = 0; i < variantCount; i++) {
			const price = parseFloat(formData.get(`variant_price_${i}`) as string);
			if (!price || price <= 0) continue;
			variantRows.push({
				product_id: product.id,
				flavor: (formData.get(`variant_flavor_${i}`) as string) || null,
				nicotine_mg: parseInt(formData.get(`variant_nicotine_${i}`) as string, 10) || null,
				price,
				stock: parseInt(formData.get(`variant_stock_${i}`) as string, 10) || 0
			});
		}
		if (variantRows.length > 0) {
			const { error: variantError } = await supabase.from('variants').insert(variantRows);
			if (variantError) {
				await supabase.from('products').delete().eq('id', product.id);
				return fail(500, { error: `Gagal simpan varian: ${variantError.message}` });
			}
		}

		// 3. Upload images (jika ada)
		const imageFiles = formData.getAll('images') as File[];
		const validImages = imageFiles.filter(f => f instanceof File && f.size > 0 && f.type.startsWith('image/'));

		if (validImages.length > 0) {
			for (let i = 0; i < validImages.length; i++) {
				const file = validImages[i];
				if (file.size > 5 * 1024 * 1024) continue; // skip if > 5MB

				const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
				const filename = `${product.id}/${Date.now()}-${i}.${ext}`;
				const buffer = new Uint8Array(await file.arrayBuffer());

				const { error: uploadError } = await supabase.storage
					.from(BUCKET)
					.upload(filename, buffer, { contentType: file.type, cacheControl: '3600', upsert: false });

				if (uploadError) continue; // skip failed uploads silently

				const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

				await supabase.from('product_images').insert({
					product_id: product.id,
					url: publicUrl,
					is_primary: i === 0,
					sort_order: i
				});
			}
		}

		// Redirect ke edit page agar bisa tambah/kelola foto lebih lanjut
		throw redirect(303, `/admin/produk/${product.id}`);
	}
};
