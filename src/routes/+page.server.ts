import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {

    search: async ({ request, locals }) => {
        const formData = await request.formData();
        const searchQuery = formData.get('query') as string;

        const { data, error } = await locals.supabase.from('profiles').select().textSearch('username', searchQuery);

        if (error) {
            return {
                results: [],
                error: error
            }
        }

        return {
            results: data,
            error: null
        }
    }
};