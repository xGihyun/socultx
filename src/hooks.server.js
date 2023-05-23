/** @type {import('@sveltejs/kit').Handle} */

import { redirect } from '@sveltejs/kit';

// https://kit.svelte.dev/docs/hooks
export async function handle({ event, resolve }) {
	const cookies = event.cookies;
	const path = event.url.pathname;
	const locals = event.locals;

	const userUIDCookie = cookies.get('userUID');
	const userStuffCookie = cookies.get('userStuff');

	if (userStuffCookie && userUIDCookie) {
		locals.userUID = userUIDCookie;
		locals.userStuff = JSON.parse(userStuffCookie);
	}

  // Redirects to login page if an unknown user tries to access other pages
	if (path !== '/' && !locals.userUID) {
		console.log('Access Denied');
		throw redirect(307, '/');
	}

	console.log(locals);

	const response = await resolve(event);

	return response;
}
