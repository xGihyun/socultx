import { auth, db } from '$lib/firebase/firebase';
import { redirect } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	const docRef = doc(db, 'users', userUID);
	const docSnap = await getDoc(docRef);
	const userData = docSnap.data();

	/**
	 * The user data to store
	 * @type {import('$lib/types').PostData}
	 */
	let dataToStore = JSON.parse(JSON.stringify(userData));

	// console.log('User UID Cookie: ' + userUID);
	// console.log('\nUser logged in (page.server.js): ' + locals.isLoggedIn);
	// console.log('User posts: ' + dataToStore.posts);

	return {
		user: userStuff,
		uid: userUID,
		posts: dataToStore.posts
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, locals }) => {
		const allCookies = cookies.getAll();

		// Doesn't work, undefined for some reason
		// console.log(auth.currentUser?.displayName);
		// await auth.signOut();

		allCookies.forEach((cookie) => {
			cookies.delete(cookie.name);
		});

		// Reset locals
		locals.userUID = undefined
		locals.userStuff = {
			username: '',
			email: '',
			isLoggedIn: false,
		}
	}
};
