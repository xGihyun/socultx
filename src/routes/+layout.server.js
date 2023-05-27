import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase/firebase';

/** @type {import('./$types').LayoutServerLoad} */

export async function load({ locals, cookies }) {
	const userUIDCookie = cookies.get('userUID');
	const userStuffCookie = cookies.get('userStuff');

	if (userStuffCookie && userUIDCookie) {
		locals.userUID = userUIDCookie;
		locals.userStuff = JSON.parse(userStuffCookie);
	}

	const userStuff = locals.userStuff;

	// if (userUID) {
	// 	console.log('User logged in (layout.server.js): ' + locals.userStuff.isLoggedIn);
	// 	console.log('User Stuff Cookie: ' + userStuff);
	// }

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
		docData.push(doc.data());
	});

	return {
		user: userStuff,
		users: docData
	};
}
