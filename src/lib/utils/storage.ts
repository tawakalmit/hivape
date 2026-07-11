import type { SupabaseClient } from '@supabase/supabase-js';

export const BUCKET = 'product-images';

/**
 * Upload a single file to Supabase Storage.
 * Returns the public URL.
 */
export async function uploadImage(
	supabase: SupabaseClient,
	file: File,
	productId: string
): Promise<string> {
	const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
	const filename = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

	const { error } = await supabase.storage.from(BUCKET).upload(filename, file, {
		cacheControl: '3600',
		upsert: false,
		contentType: file.type
	});

	if (error) throw new Error(`Upload gagal: ${error.message}`);

	const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
	return data.publicUrl;
}

/**
 * Delete an image from Supabase Storage given its public URL.
 */
export async function deleteImage(supabase: SupabaseClient, publicUrl: string): Promise<void> {
	// Extract path after /object/public/product-images/
	const marker = `/object/public/${BUCKET}/`;
	const idx = publicUrl.indexOf(marker);
	if (idx === -1) return;
	const path = publicUrl.slice(idx + marker.length);
	await supabase.storage.from(BUCKET).remove([path]);
}
