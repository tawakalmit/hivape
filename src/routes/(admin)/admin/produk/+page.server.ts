import type { PageServerLoad, Actions } from './$types';
import { getAllProducts } from '$lib/utils/supabase-queries';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const products = await getAllProducts(supabase);
	return { products };
};

export const actions: Actions = {
	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) return fail(400, { error: 'ID produk tidak valid.' });

		const { error } = await supabase.from('products').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });

		return { success: true };
	},

	toggleStatus: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const status = formData.get('status') as string;

		const newStatus = status === 'active' ? 'draft' : 'active';
		const { error } = await supabase.from('products').update({ status: newStatus }).eq('id', id);
		if (error) return fail(500, { error: error.message });

		return { success: true };
	}
};
