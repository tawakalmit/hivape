import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, url }) => {
	const { session } = await safeGetSession();

	if (!session && url.pathname !== '/admin/login') {
		throw redirect(303, '/admin/login');
	}

	return { session };
};
