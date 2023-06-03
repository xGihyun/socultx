/** @type {import('@sveltejs/kit').Handle} */

import { browser } from '$app/environment';
import { db } from '$lib/firebase/firebase';
import { redirect } from '@sveltejs/kit';
import { doc, setDoc } from 'firebase/firestore';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
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

	const response = await resolve(event);

	return response;
}
