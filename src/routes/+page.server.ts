import { ensureUserExists } from "$lib/client/auth";
import { auth } from "$lib/client/firebase";
import type { UserData } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";



export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete('sessionCookie');
        console.log("Cookies are deleted!")
        throw redirect(302, '/');
    },

    login: async ({ cookies, request }) => {

        const formData = await request.formData();

        const userToken = formData.get('userToken') as string;

        if (!userToken) {
            return fail(400, { message: 'Token is a required field and must be a string' });
        }

        // Set 'sessionCookie' to expire within 7 days
        cookies.set('sessionCookie', userToken, {
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return { success: true };
    },

    register: async ({ cookies, request }) => {
        const formData = await request.formData();

        const userToken = formData.get('userToken') as string;

        if (!userToken) {
            return fail(400, { message: 'Token is a required field and must be a string' });
        }

        // Set 'sessionCookie' to expire within 7 days
        cookies.set('sessionCookie', userToken, {
            secure: true,
            path: '/',
            maxAge: 60 * 60 * 24 * 7
        })

        return { success: true };
    }
};