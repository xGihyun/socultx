import { db } from '$lib/firebase/firebase';
// import { redirect } from '@sveltejs/kit';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

/** @type {import('./$types').PageServerLoad} */

export async function load({ locals }) {
	const userStuff = locals.userStuff;
	const userUID = locals.userUID;

	if (!userUID) {
		return;
	}

	// Document of the current user only
	const docRef = doc(db, 'users', userUID);
	const docSnap = await getDoc(docRef);
	const userData = docSnap.data();

	// Get all of the documents
	const docCollection = collection(db, 'users');
	const docs = await getDocs(docCollection);

	// I guess this works???
	/**
	 * @type {import("@firebase/firestore").DocumentData[]}
	 */
	let docData = [];

	docs.forEach((doc) => {
		// There is no map() in docs apparently
		docData.push(doc.data())
	})	

	console.log('Run') 
	// console.log(docData);

	/**
	 * The user data to store
	 * @type {import('$lib/types').UserData}
	 */
	let dataToStore = JSON.parse(JSON.stringify(userData));

	// console.log('User UID Cookie: ' + userUID);
	// console.log('\nUser logged in (page.server.js): ' + locals.isLoggedIn); // console.log('User posts: ' + dataToStore.posts);

	return {
		users: docData,
		user: userStuff,
		uid: userUID,
		posts: dataToStore.posts,
	};
}

// Added actions specifically on /logout route, check /logout/+page.js and /logout/+page.svelte

// /** @type {import('./$types').Actions} */
// export const actions = {
// 	default: async ({ cookies, locals }) => {
// 		const allCookies = cookies.getAll();

// 		// Doesn't work, undefined for some reason
// 		// console.log(auth.currentUser?.displayName);
// 		// await auth.signOut();

// 		allCookies.forEach((cookie) => {
// 			cookies.delete(cookie.name);
// 		});

// 		// Reset locals
// 		locals.userUID = undefined
// 		locals.userStuff = {
// 			username: '',
// 			email: '',
// 			isLoggedIn: false,
// 		}
// 	}
// };
