// import { db } from "$lib/client/supabase";
import type { Actions } from "@sveltejs/kit";
// import { collection, getDocs, limit, query, where } from "firebase/firestore";

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

        // console.log(data)

        return {
            results: data,
            error: null
        }
    }
};