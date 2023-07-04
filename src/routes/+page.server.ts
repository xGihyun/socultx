// import { browser } from "$app/environment";
import { invalidateAll } from "$app/navigation";
import { ensureUserExists } from "$lib/firebase/auth";
import { auth } from "$lib/firebase/firebase";
import type { UserData } from "$lib/types";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { signInWithEmailAndPassword } from "firebase/auth";

export const actions: Actions = {
    logout: async ({ cookies }) => {
        cookies.delete('sessionCookie');
        console.log("Cookies are deleted!")
        throw redirect(302, '/');
    },

    login: async ({ cookies, request }) => {
        const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;

        if (!email || !password) {
            return fail(400, {
                message: "Missing email or password!"
            })
        }

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;

            // Database stuff
            let dataToStore: UserData = {
                username: user.displayName,
                uid: user.uid,
                email: user.email,
                photo_url: user.photoURL,
                is_logged_in: true
            };

            await ensureUserExists(dataToStore);
            // await getAllUsers();

            let userToken = await user.getIdToken()

            // Set 'sessionCookie' to expire within 7 days
            cookies.set('sessionCookie', userToken, {
                secure: true,
                maxAge: 60 * 60 * 24 * 7
            })

            await invalidateAll()

            console.log('Successfully logged in -> ', email);

        } catch (error: any) {
            if (error.code == 'auth/user-not-found') {
                return fail(400, {
                    message: "Account notfound!"
                })
            } else {
                return fail(400, {
                    messages: "Failed to log in!"
                })
            }
        }

    },

    register: async ({ cookies }) => {

    }
};