import { redirect } from '@sveltejs/kit';
import cookie from 'cookie'
import type { Handle } from '@sveltejs/kit';
import { decodeToken } from '$lib/server/firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export const handle = (async ({ event, resolve }) => {

	/*
	const userStuffCookie = event.cookies.get('userStuff');

	if (userStuffCookie) {
		event.locals.userStuff = JSON.parse(userStuffCookie);
	}

	// TODO: set is_logged_in to 'false' when the app is not running in the browser (pls help)
	// if (!browser) {
	// 	const userRef = doc(db, 'users', event.locals.userStuff.uid || '');

	// 	// Set login to false in the database
	// 	await setDoc(userRef, { is_logged_in: false }, { merge: true });
	// }

	// Redirects to login page if an unknown user tries to access other pages
	if (event.url.pathname !== '/' && !userStuffCookie) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	*/

	// const response = await resolve(event);

	// return response;

	// Allow the '/login' endpoint to be accessible to only post requests even if no token is needed
	// if (event.url.pathname == '/login' && event.request.method === "POST") {
	// 	console.log("Someone tried to log in")
	// 	return resolve(event);
	// }
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	const token = cookies['sessionCookie'];

	if (event.url.pathname !== '/' && !token) {
		console.log("Access denied!, user tried to go to -> ", event.url.pathname);
		throw redirect(307, '/')
	}

	if (token) {
		const decodedToken: DecodedIdToken | null = await decodeToken(token);
		if (decodedToken) {
			event.locals.user = decodedToken;
			console.log(decodedToken)
		} else {
			console.log("Access denied");
			// Remove the cookie to avoid loop redirection
			event.cookies.delete('sessionCookie');
			console.log("Removed sessionCookie for good...")
			throw redirect(307, '/')
		}
	}
	return resolve(event);


}) satisfies Handle;