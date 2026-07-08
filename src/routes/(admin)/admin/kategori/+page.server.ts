import type { PageServerLoad, Actions } from './$types';
import { getCategories } from '$lib/utils/supabase-queries';
import { fail } from '@sveltejs/kit';
import { slugify } from '$lib/utils/format';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const categories = await getCategories(supabase);
	return { categories };
};

export const actions: Actions = {
	create: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = (formData.get('slug') as string) || slugify(name);

		if (!name) return fail(400, { error: 'Nama kategori wajib diisi.' });

		const { error } = await supabase.from('categories').insert({ name, slug });
		if (error) return fail(500, { error: error.message });

		return { success: true };
	},

	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const { error } = await supabase.from('categories').delete().eq('id', id);
		if (error) return fail(500, { error: error.message });
		return { success: true };
	}
};
