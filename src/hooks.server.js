/** @type {import('@sveltejs/kit').Handle} */

import { currentUser } from '$lib/store';
import { redirect } from '@sveltejs/kit';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
	const userStuffCookie = event.cookies.get('userStuff');

	if (userStuffCookie) {
		event.locals.userStuff = JSON.parse(userStuffCookie);
	}

	// Redirects to login page if an unknown user tries to access other pages
	// if (event.url.pathname === '/' && userStuffCookie) {
	// 	console.log(`${event.locals.userStuff.username} is currently logged in`);
	// 	throw redirect(302, '/dashboard');
	// }
	if (event.url.pathname !== '/' && !userStuffCookie) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	const response = await resolve(event);

	return response;
}
