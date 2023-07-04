// import { auth, db } from '$lib/firebase/firebase';
// import { getAuth, signOut } from 'firebase/auth';
// import { redirect } from '@sveltejs/kit';
// import { doc, setDoc } from 'firebase/firestore';
// import { currentUser } from '$lib/store';
// import type { Actions } from './$types';

// import type { RequestHandler } from '@sveltejs/kit';
// import cookie from 'cookie'

/*
export const actions: Actions = {
	default: async ({ cookies, locals }) => {
		console.log('Resetting writable...');
		currentUser.set({
			username: '',
			uid: '',
			photo_url: '',
			email: '',
			is_logged_in: false
		});

		console.log('Logging out, deleting cookies now, and redirecting to homepage...');
		// cookies.delete('userStuff');
		cookies.delete('sessionCookie')

		// const userRef = doc(db, 'users', locals.userStuff.uid || '');

		// // Set login to false in the database
		// await setDoc(userRef, { is_logged_in: false }, { merge: true });

		// // Reset locals
		// locals.userUID = undefined;
		// locals.userStuff = {
		// 	username: '',
		// 	uid: '',
		// 	photo_url: '',
		// 	email: '',
		// 	is_logged_in: false
		// };

		// Log out user from Google
		signOut(auth).then(() => {
			console.log('Successfully signed out?');
		})
			.catch((err) => console.error(err));


		console.log("The user has been logged out, now redirecting to '/'");
		// console.log(auth)

		throw redirect(302, '/');
	}
};
*/

// TODO: Maybe just create +page.server.ts for all actions like login/logout/register
// Which means you'll have to modify the logout Navbar, signOutAccount method inside auth.ts
// export const POST = (async () => {
// 	return new Response('', {
// 		headers: {
// 			'set-cookie': cookie.serialize('sessionCookie', '', {
// 				path: '/',
// 				httpOnly: true,
// 				maxAge: -1,
// 			})
// 		}
// 	});
// }) satisfies RequestHandler;