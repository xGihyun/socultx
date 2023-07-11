// import { db } from "$lib/client/supabase";
import { fail, redirect, type Actions } from "@sveltejs/kit";
// import { collection, getDocs, limit, query, where } from "firebase/firestore";

export const actions: Actions = {

    // auth: async ({ cookies, request }) => {
    //     const formData = await request.formData();

    //     const sessionCookieToken = formData.get('sessionCookieToken') as string;

    //     if (!sessionCookieToken) {
    //         return fail(400, { message: 'sessionCookieToken is a required field and must be a string' });
    //     }

    //     // Set 'sessionCookie' to expire within 7 days
    //     cookies.set('sessionCookieToken', sessionCookieToken, {
    //         secure: true,
    //         path: '/',
    //         maxAge: 60 * 60 * 24 * 7
    //     })

    //     return { success: true };
    // },


    search: async ({ request }) => {
        const formData = await request.formData();
        const searchQuery = formData.get('query') as string;


        // There is no such thing as a 'full text search' in firestore/firebase, instead we have to rely on such code
        // or just migrate to supabase 


        // const usersCollectionRef = collection(db, 'users');
        // const q = query(usersCollectionRef,
        //     where('username', '>=', searchQuery),
        //     where('username', '<=', searchQuery + '\uf8ff')
        // );
        // const querySnapshot = await getDocs(q);


        // return {
        //     results: querySnapshot.docs.map(item => item.data())
        // }
    }
    // login: async ({ cookies, request }) => {

    //     const formData = await request.formData();

    //     const userToken = formData.get('userToken') as string;

    //     if (!userToken) {
    //         return fail(400, { message: 'Token is a required field and must be a string' });
    //     }

    //     // Set 'sessionCookie' to expire within 7 days
    //     cookies.set('sessionCookie', userToken, {
    //         secure: true,
    //         path: '/',
    //         maxAge: 60 * 60 * 24 * 7
    //     })

    //     return { success: true };
    // },

    // register: async ({ cookies, request }) => {
    //     const formData = await request.formData();

    //     const userToken = formData.get('userToken') as string;

    //     if (!userToken) {
    //         return fail(400, { message: 'Token is a required field and must be a string' });
    //     }

    //     // console.log("this is from +page.server.ts: ", locals.user)

    //     // Set 'sessionCookie' to expire within 7 days
    //     cookies.set('sessionCookie', userToken, {
    //         secure: true,
    //         path: '/',
    //         maxAge: 60 * 60 * 24 * 7
    //     })

    //     return { success: true };
    // }

};