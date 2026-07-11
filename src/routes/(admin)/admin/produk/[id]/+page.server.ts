import type { PageServerLoad, Actions } from './$types';
import { getCategories } from '$lib/utils/supabase-queries';
import { error, fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils/format';

const BUCKET = 'product-images';

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
	// ── Save product info + variants ──────────────────────────────────────────
	simpan: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();

		const name = (formData.get('name') as string)?.trim();
		const slug = ((formData.get('slug') as string)?.trim()) || slugify(name);
		const categoryId = formData.get('category_id') as string;
		const descriptionShort = (formData.get('description_short') as string)?.trim();
		const descriptionLong = (formData.get('description_long') as string)?.trim();
		const status = formData.get('status') as 'active' | 'draft' | 'out_of_stock';
		const variantCount = parseInt(formData.get('variant_count') as string, 10) || 0;

		if (!name || !categoryId) return fail(400, { error: 'Nama dan kategori wajib diisi.' });

		const { error: productError } = await supabase
			.from('products')
			.update({
				name, slug, category_id: categoryId,
				description_short: descriptionShort || null,
				description_long: descriptionLong || null,
				status, updated_at: new Date().toISOString()
			})
			.eq('id', params.id);

		if (productError) return fail(500, { error: productError.message });

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

		throw redirect(303, `/admin/produk/${params.id}`);
	},

	// ── Upload images ─────────────────────────────────────────────────────────
	uploadFoto: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const files = formData.getAll('images') as File[];

		const validFiles = files.filter(f => f instanceof File && f.size > 0 && f.type.startsWith('image/'));
		if (validFiles.length === 0) return fail(400, { error: 'Pilih minimal satu foto.' });

		// Get current highest sort_order
		const { data: existing } = await supabase
			.from('product_images')
			.select('sort_order, is_primary')
			.eq('product_id', params.id)
			.order('sort_order', { ascending: false })
			.limit(1);

		let nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;
		const isFirst = !existing || existing.length === 0;

		const errors: string[] = [];

		for (let i = 0; i < validFiles.length; i++) {
			const file = validFiles[i];
			if (file.size > 5 * 1024 * 1024) {
				errors.push(`${file.name}: terlalu besar (maks 5MB)`);
				continue;
			}

			const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
			const filename = `${params.id}/${Date.now()}-${i}.${ext}`;

			const arrayBuffer = await file.arrayBuffer();
			const buffer = new Uint8Array(arrayBuffer);

			const { error: uploadError } = await supabase.storage
				.from(BUCKET)
				.upload(filename, buffer, {
					contentType: file.type,
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				errors.push(`${file.name}: ${uploadError.message}`);
				continue;
			}

			const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filename);

			await supabase.from('product_images').insert({
				product_id: params.id,
				url: publicUrl,
				is_primary: isFirst && i === 0,
				sort_order: nextOrder++
			});
		}

		if (errors.length > 0) return fail(422, { error: errors.join(', ') });

		throw redirect(303, `/admin/produk/${params.id}`);
	},

	// ── Set primary image ─────────────────────────────────────────────────────
	setPrimary: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const imageId = formData.get('image_id') as string;
		if (!imageId) return fail(400, { error: 'image_id wajib.' });

		// Unset all primary for this product
		await supabase.from('product_images').update({ is_primary: false }).eq('product_id', params.id);
		// Set the chosen one
		await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);

		throw redirect(303, `/admin/produk/${params.id}`);
	},

	// ── Delete image ──────────────────────────────────────────────────────────
	deleteImage: async ({ request, locals: { supabase }, params }) => {
		const formData = await request.formData();
		const imageId = formData.get('image_id') as string;
		if (!imageId) return fail(400, { error: 'image_id wajib.' });

		// Get URL to delete from storage
		const { data: img } = await supabase
			.from('product_images')
			.select('url, is_primary')
			.eq('id', imageId)
			.single();

		if (img?.url) {
			const marker = `/object/public/${BUCKET}/`;
			const idx = img.url.indexOf(marker);
			if (idx !== -1) {
				const path = img.url.slice(idx + marker.length);
				await supabase.storage.from(BUCKET).remove([path]);
			}
		}

		await supabase.from('product_images').delete().eq('id', imageId);

		// If deleted was primary, promote first remaining
		if (img?.is_primary) {
			const { data: remaining } = await supabase
				.from('product_images')
				.select('id')
				.eq('product_id', params.id)
				.order('sort_order')
				.limit(1);
			if (remaining?.[0]) {
				await supabase.from('product_images').update({ is_primary: true }).eq('id', remaining[0].id);
			}
		}

		throw redirect(303, `/admin/produk/${params.id}`);
	}
};
