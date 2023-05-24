/** @type {import('@sveltejs/kit').Handle} */

import { redirect } from '@sveltejs/kit';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
	const userUIDCookie = event.cookies.get('userUID');
	const userStuffCookie = event.cookies.get('userStuff');

	if (userStuffCookie && userUIDCookie) {
		event.locals.userUID = userUIDCookie;
		event.locals.userStuff = JSON.parse(userStuffCookie);
	}

	// Redirects to login page if an unknown user tries to access other pages
	if (event.url.pathname !== '/' && (!event.locals.userUID)) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	// console.log('\nFrom hooks.server.js');
	// console.log(event.locals);

	const response = await resolve(event);

	return response;
}
