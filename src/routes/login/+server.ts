import { auth } from "$lib/firebase/firebase";
import type { UserData } from "$lib/types";
import { fail } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";
import { signInWithEmailAndPassword } from "firebase/auth";

export const POST = (async ({ request }) => {
    const data = await request.formData();
    const email = data.get('email') as string;
    const password = data.get('password') as string;

    if (!email || !password) {
        console.log('Missing email or password!');
        return new Response('');
    }

    try {
        let result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Database stuff
        let dataToStore: UserData = {
            username: user.displayName,
            uid: user.uid,
            email: user.email,
            photo_url: user.photoURL,
            is_logged_in: true
        };


        console.log('Successfully logged in -> ', email);



    } catch (err: any) {
        console.error(err);
        // return new Response('', {
        //     headers: {
        //         Location: '/',
        //         status: 302
        //     }
        // })

        // return new Response(JSON.stringify({ message: "No account found" }), {
        //     headers: {
        //         location: '/',
        //         status: 302
        //     }
        // })

        // return new Response('', {
        //     headers: {
        //         location: '/listen',
        //         status: 302,
        //     }
        // })
        // goto('/', { invalidateAll: true });
    }


    return new Response('');



}) satisfies RequestHandler;
