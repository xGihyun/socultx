/** @type {import('./$types').LayoutServerLoad} */

import { auth } from '$lib/firebase';
import { redirect } from '@sveltejs/kit';
// import { userInfo } from '../lib/store';

export async function load({ request, cookies }) {
	/**
	 * @type {{ email: string | null | undefined; username: string | null | undefined; isLoggedIn: boolean; }}
	 */
	let userStuff = {
		username: '',
		email: '',
		isLoggedIn: false
	};

	let userUIDCookie = cookies.get('userUID');
	let userStuffCookie = cookies.get('userStuff');

	if (userStuffCookie) {
		userStuff = JSON.parse(userStuffCookie);
		console.log('User UID Cookie: ' + userUIDCookie);
		console.log('User Stuff Cookie: ' + userStuffCookie);
	}

	return {
		user: userStuff
	};
}
